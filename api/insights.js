const { GoogleGenerativeAI } = require("@google/generative-ai");

// Endpoint tổng hợp câu hỏi khách trong khung chat (đọc log Upstash + Gemini tóm tắt).
// Bảo vệ bằng INSIGHTS_TOKEN. Dùng cho báo cáo hàng tháng.

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
    const uniqueSessions = new Set(entries.map((e) => e.sid).filter(Boolean))
      .size;

    if (total === 0) {
      return res.status(200).json({
        month,
        total: 0,
        uniqueSessions: 0,
        report: `Chưa có câu hỏi nào được ghi nhận trong tháng ${month}.`,
      });
    }

    // Giới hạn số câu đưa vào phân tích để kiểm soát chi phí token
    const questions = entries.map((e) => e.q).filter(Boolean);
    const sample = questions.slice(-1200);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        month,
        total,
        uniqueSessions,
        report:
          "Thiếu GEMINI_API_KEY nên chỉ trả về số liệu thô. Tổng câu hỏi: " +
          total,
        questions: sample,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { maxOutputTokens: 2000, temperature: 0.4 },
    });

    const prompt = `Bạn là chuyên gia phân tích insight khách hàng cho PES Studio (đơn vị chụp/quay kiến trúc - nội thất - bất động sản tại TP.HCM).

Dưới đây là ${sample.length} câu hỏi/tin nhắn khách gõ vào chatbot tư vấn giá trên website trong tháng ${month} (mỗi dòng 1 tin, đã ẩn số điện thoại):

${sample.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Hãy viết BÁO CÁO INSIGHT tháng bằng tiếng Việt, định dạng Markdown, gồm:
1. **Tổng quan**: nhận xét ngắn về nhu cầu khách trong tháng.
2. **Top chủ đề được hỏi nhiều nhất**: nhóm câu hỏi theo chủ đề, kèm ước lượng tỉ trọng (%).
3. **Loại không gian / dịch vụ được quan tâm nhất** (căn hộ, homestay, villa, resort, chụp/quay/combo...).
4. **Phản đối giá & thắc mắc thường gặp** (nếu có).
5. **Câu hỏi mà chatbot có thể trả lời chưa tốt / khách còn phân vân**.
6. **Gợi ý hành động**: 3-5 ý tưởng nội dung (blog/FAQ/carousel) và cải thiện chatbot dựa trên dữ liệu thực tế.

Viết súc tích, đi thẳng vào insight có thể hành động. Không bịa số liệu ngoài dữ liệu đã cho.`;

    const result = await model.generateContent(prompt);
    const report = result.response.text();

    return res.status(200).json({ month, total, uniqueSessions, report });
  } catch (error) {
    console.error("insights error:", error.message);
    return res.status(500).json({ error: "Insights failed: " + error.message });
  }
};
