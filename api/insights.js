const { GoogleGenerativeAI } = require("@google/generative-ai");

// Endpoint tổng hợp hội thoại khách trong khung chat (đọc log Upstash + Gemini tóm tắt).
// Bảo vệ bằng INSIGHTS_TOKEN. Dùng cho báo cáo hàng tháng.
// GET /api/insights?token=...&month=YYYYMM
//   &transcripts=0  → bỏ phần transcript đầy đủ (mặc định có)
// Trả JSON: { month, total, uniqueSessions, withPhone, errors, report, table, transcripts }
//   report      = markdown insight do Gemini viết
//   table       = markdown BẢNG phiên khách hàng (dán thẳng vào báo cáo)
//   transcripts = markdown toàn bộ hội thoại 2 chiều

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisPipeline(commands) {
  const r = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error("Upstash HTTP " + r.status);
  return r.json();
}

function prevMonthYYYYMM() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 7).replace("-", "");
}

// Giờ Việt Nam (UTC+7)
function fmtTime(ts) {
  const d = new Date(Number(ts) + 7 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

function mdCell(s, max) {
  return String(s || "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .slice(0, max || 100);
}

// Gom lượt trao đổi thành phiên theo sid
function buildSessions(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const sid = e.sid || "(không rõ)";
    if (!map.has(sid)) {
      map.set(sid, {
        sid,
        firstTs: e.ts,
        lastTs: e.ts,
        turns: [],
        phone: "",
        page: e.page || "",
        dev: e.dev || "",
        errors: 0,
      });
    }
    const s = map.get(sid);
    s.turns.push(e);
    s.firstTs = Math.min(s.firstTs, e.ts);
    s.lastTs = Math.max(s.lastTs, e.ts);
    if (e.phone && !s.phone) s.phone = e.phone;
    if (!s.page && e.page) s.page = e.page;
    if (!s.dev && e.dev) s.dev = e.dev;
    if (e.err) s.errors++;
  });
  const sessions = [...map.values()];
  sessions.forEach((s) => s.turns.sort((a, b) => a.ts - b.ts));
  sessions.sort((a, b) => a.firstTs - b.firstTs);
  return sessions;
}

function renderTable(sessions) {
  const head =
    "| # | Thời điểm | SĐT khách | Lượt hỏi | Thiết bị | Trang vào chat | Câu hỏi đầu tiên | Ghi chú |\n" +
    "|---|---|---|---|---|---|---|---|\n";
  const rows = sessions
    .map((s, i) => {
      const firstQ = (s.turns[0] && s.turns[0].q) || "(gửi ảnh)";
      const note = [];
      if (s.phone) note.push("🟢 có lead");
      if (s.errors) note.push(`⚠️ bot lỗi ${s.errors} lượt`);
      return `| ${i + 1} | ${fmtTime(s.firstTs)} | ${s.phone ? "**" + s.phone + "**" : "—"} | ${s.turns.length} | ${mdCell(s.dev) || "—"} | ${mdCell(s.page, 40) || "—"} | ${mdCell(firstQ, 80)} | ${note.join(", ")} |`;
    })
    .join("\n");
  return head + rows;
}

function renderTranscripts(sessions) {
  return sessions
    .map((s, i) => {
      const header = `### Phiên ${i + 1} — ${fmtTime(s.firstTs)}${s.phone ? " · SĐT: **" + s.phone + "**" : ""}${s.page ? " · trang: `" + mdCell(s.page, 60) + "`" : ""}`;
      const body = s.turns
        .map((t) => {
          const q = `**Khách** (${fmtTime(t.ts)}): ${String(t.q || "(gửi ảnh)").trim()}`;
          const a = t.a
            ? `**Bot**: ${String(t.a).trim()}`
            : `**Bot**: _không trả lời được${t.err ? " — " + t.err : ""}_`;
          return q + "\n\n" + a;
        })
        .join("\n\n");
      return header + "\n\n" + body;
    })
    .join("\n\n---\n\n");
}

module.exports = async function handler(req, res) {
  // Auth
  const token =
    (req.query && req.query.token) || req.headers["x-insights-token"];
  if (!process.env.INSIGHTS_TOKEN || token !== process.env.INSIGHTS_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: "Upstash not configured" });
  }

  const month =
    (req.query && /^\d{6}$/.test(req.query.month || "")
      ? req.query.month
      : null) || prevMonthYYYYMM();
  const wantTranscripts = !(req.query && req.query.transcripts === "0");
  const key = "pes:chatlog:" + month;

  try {
    const r = await redisPipeline([["LRANGE", key, 0, -1]]);
    const raw = (r[0] && r[0].result) || [];
    const entries = raw
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    const total = entries.length;
    const sessions = buildSessions(entries);
    const uniqueSessions = sessions.length;
    const withPhone = sessions.filter((s) => s.phone).length;
    const errors = sessions.reduce((n, s) => n + s.errors, 0);

    if (total === 0) {
      return res.status(200).json({
        month,
        total: 0,
        uniqueSessions: 0,
        withPhone: 0,
        errors: 0,
        report: `Chưa có câu hỏi nào được ghi nhận trong tháng ${month}.`,
        table: "",
        transcripts: "",
      });
    }

    const table = renderTable(sessions);
    const transcripts = wantTranscripts ? renderTranscripts(sessions) : "";

    // Giới hạn số lượt đưa vào phân tích để kiểm soát chi phí token
    const questions = entries.map((e) => e.q).filter(Boolean);
    const sample = questions.slice(-1200);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        month,
        total,
        uniqueSessions,
        withPhone,
        errors,
        report:
          "Thiếu GEMINI_API_KEY nên chỉ trả về số liệu thô. Tổng lượt hỏi: " +
          total,
        table,
        transcripts,
        questions: sample,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { maxOutputTokens: 2000, temperature: 0.4 },
    });

    const prompt = `Bạn là chuyên gia phân tích insight khách hàng cho PES Studio (đơn vị chụp/quay kiến trúc - nội thất - bất động sản tại TP.HCM).

Dưới đây là ${sample.length} câu hỏi/tin nhắn khách gõ vào chatbot tư vấn giá trên website trong tháng ${month} (mỗi dòng 1 tin). Trong tháng có ${uniqueSessions} phiên trò chuyện, ${withPhone} phiên khách để lại số điện thoại${errors ? `, ${errors} lượt bot không trả lời được` : ""}.

${sample.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Hãy viết BÁO CÁO INSIGHT tháng bằng tiếng Việt, định dạng Markdown, gồm:
1. **Tổng quan**: nhận xét ngắn về nhu cầu khách trong tháng, kèm tỉ lệ phiên để lại SĐT.
2. **Top chủ đề được hỏi nhiều nhất**: nhóm câu hỏi theo chủ đề, kèm ước lượng tỉ trọng (%).
3. **Loại không gian / dịch vụ được quan tâm nhất** (căn hộ, homestay, villa, resort, chụp/quay/combo...).
4. **Phản đối giá & thắc mắc thường gặp** (nếu có).
5. **Câu hỏi mà chatbot có thể trả lời chưa tốt / khách còn phân vân**.
6. **Dấu hiệu phiên đáng gọi lại**: cách nhận biết khách có ý định thuê thật (nhắc diện tích, địa chỉ, thời gian chụp, để lại SĐT).
7. **Gợi ý hành động**: 3-5 ý tưởng nội dung (blog/FAQ/carousel) và cải thiện chatbot dựa trên dữ liệu thực tế.

Viết súc tích, đi thẳng vào insight có thể hành động. Không bịa số liệu ngoài dữ liệu đã cho.`;

    const result = await model.generateContent(prompt);
    const report = result.response.text();

    return res.status(200).json({
      month,
      total,
      uniqueSessions,
      withPhone,
      errors,
      report,
      table,
      transcripts,
    });
  } catch (error) {
    console.error("insights error:", error.message);
    return res.status(500).json({ error: "Insights failed: " + error.message });
  }
};
