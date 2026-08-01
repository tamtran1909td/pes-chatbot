// Trang xem hội thoại chatbot PES — dành riêng cho nội bộ.
// GET https://pes-chatbot.vercel.app/api/logs?token=<INSIGHTS_TOKEN>&month=YYYYMM
//   &format=json   → trả JSON thay vì HTML
//   &q=<từ khoá>   → lọc phiên có chứa từ khoá
//   &phone=1       → chỉ hiện phiên khách có để lại số điện thoại
// Bảo vệ bằng cùng INSIGHTS_TOKEN với /api/insights.

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

function thisMonthYYYYMM() {
  return new Date().toISOString().slice(0, 7).replace("-", "");
}

function fmtTime(ts) {
  // Giờ Việt Nam (UTC+7)
  const d = new Date(Number(ts) + 7 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Gom các lượt trao đổi thành phiên theo sid
function buildSessions(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const sid = e.sid || "(không rõ)";
    if (!map.has(sid)) {
      map.set(sid, {
        sid: sid,
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
  // Phiên mới nhất lên đầu
  sessions.sort((a, b) => b.lastTs - a.lastTs);
  return sessions;
}

function renderHTML(month, sessions, stats, token) {
  const rows = sessions
    .map((s, i) => {
      const firstQ = (s.turns[0] && s.turns[0].q) || "";
      return `<tr class="row" data-i="${i}">
      <td class="num">${i + 1}</td>
      <td class="t">${fmtTime(s.firstTs)}</td>
      <td>${s.phone ? `<a class="phone" href="https://zalo.me/${esc(s.phone)}" target="_blank" rel="noopener">${esc(s.phone)}</a>` : '<span class="muted">—</span>'}</td>
      <td class="num">${s.turns.length}</td>
      <td class="dev">${esc(s.dev || "—")}</td>
      <td class="page">${esc(s.page || "—")}</td>
      <td class="first">${esc(firstQ.slice(0, 90))}${firstQ.length > 90 ? "…" : ""}</td>
      <td>${s.errors ? '<span class="err">lỗi</span>' : ""}</td>
    </tr>
    <tr class="detail" id="d${i}"><td colspan="8"><div class="chat">${s.turns
        .map(
          (t) => `
        <div class="msg user"><span class="who">Khách · ${fmtTime(t.ts)}</span><div class="bub">${esc(t.q) || '<i class="muted">(gửi ảnh)</i>'}</div></div>
        ${t.a ? `<div class="msg bot"><span class="who">Bot</span><div class="bub">${esc(t.a)}</div></div>` : `<div class="msg bot"><span class="who">Bot</span><div class="bub err">Không trả lời được${t.err ? " — " + esc(t.err) : ""}</div></div>`}`
        )
        .join("")}</div></td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Hội thoại chatbot ${month} · PES Studio</title>
<style>
:root{--bg:#121212;--card:#1a1a1a;--alt:#181818;--pri:#BB86FC;--teal:#03DAC6;--tx:#e0e0e0;--mut:#888}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
header{padding:20px 24px;border-bottom:1px solid #262626;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between}
h1{font-size:17px;margin:0;color:var(--pri);font-weight:600}
.stats{display:flex;gap:10px;flex-wrap:wrap}
.stat{background:var(--card);border:1px solid #262626;border-radius:8px;padding:8px 14px;min-width:96px}
.stat b{display:block;font-size:19px;color:var(--teal);font-weight:600}
.stat span{font-size:11px;color:var(--mut);letter-spacing:.4px;text-transform:uppercase}
.bar{padding:12px 24px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;border-bottom:1px solid #262626}
input,select,button{background:var(--card);border:1px solid #333;color:var(--tx);border-radius:8px;padding:8px 12px;font:inherit;font-size:13px}
button{cursor:pointer;border-color:rgba(187,134,252,.4);color:var(--pri)}
button:hover{background:rgba(187,134,252,.12)}
a{color:var(--teal)}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;color:var(--pri);font-weight:600;border-bottom:1px solid #333;position:sticky;top:0;background:var(--bg);font-size:12px;letter-spacing:.3px}
td{padding:10px 12px;border-bottom:1px solid #222;vertical-align:top}
tr.row{cursor:pointer}
tr.row:hover{background:var(--alt)}
tr.row.open{background:rgba(187,134,252,.08)}
.num{text-align:right;color:var(--mut);width:1%;white-space:nowrap}
.t{white-space:nowrap;color:var(--mut)}
.dev,.page{color:var(--mut);font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.first{color:var(--tx)}
.muted{color:var(--mut)}
.phone{font-weight:600}
.err{color:#ff6b6b}
tr.detail{display:none}
tr.detail.show{display:table-row}
tr.detail td{background:var(--alt);padding:14px 20px}
.chat{max-width:820px}
.msg{margin-bottom:12px}
.who{display:block;font-size:11px;color:var(--mut);margin-bottom:3px}
.bub{padding:10px 14px;border-radius:10px;white-space:pre-wrap;word-break:break-word}
.msg.user .bub{background:rgba(187,134,252,.16);border:1px solid rgba(187,134,252,.25)}
.msg.bot .bub{background:var(--card);border:1px solid #2a2a2a}
.empty{padding:60px 24px;text-align:center;color:var(--mut)}
@media(max-width:720px){.dev,.page,th.dev,th.page{display:none}header{padding:16px}.bar{padding:10px 16px}td,th{padding:8px}}
</style></head><body>
<header>
  <h1>Hội thoại chatbot · tháng ${month.slice(4)}/${month.slice(0, 4)}</h1>
  <div class="stats">
    <div class="stat"><b>${stats.sessions}</b><span>Phiên</span></div>
    <div class="stat"><b>${stats.turns}</b><span>Lượt hỏi</span></div>
    <div class="stat"><b>${stats.withPhone}</b><span>Có SĐT</span></div>
    <div class="stat"><b>${stats.errors}</b><span>Lỗi bot</span></div>
  </div>
</header>
<div class="bar">
  <form method="get" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <input type="hidden" name="token" value="${esc(token)}">
    <input name="month" value="${esc(month)}" size="8" placeholder="YYYYMM">
    <input name="q" placeholder="Tìm trong nội dung..." value="${esc(stats.q || "")}">
    <label style="color:var(--mut);font-size:13px"><input type="checkbox" name="phone" value="1" ${stats.onlyPhone ? "checked" : ""} style="vertical-align:-2px"> chỉ phiên có SĐT</label>
    <button type="submit">Lọc</button>
  </form>
  <button type="button" onclick="toggleAll()">Mở/đóng tất cả</button>
</div>
${
  sessions.length
    ? `<table>
<thead><tr><th class="num">#</th><th>Bắt đầu</th><th>SĐT khách</th><th class="num">Lượt</th><th class="dev">Thiết bị</th><th class="page">Trang</th><th>Câu hỏi đầu tiên</th><th></th></tr></thead>
<tbody>${rows}</tbody></table>`
    : `<div class="empty">Không có phiên nào khớp bộ lọc trong tháng ${month}.</div>`
}
<script>
document.querySelectorAll('tr.row').forEach(function(r){
  r.addEventListener('click', function(){
    var d = document.getElementById('d' + r.dataset.i);
    d.classList.toggle('show'); r.classList.toggle('open');
  });
});
var allOpen = false;
function toggleAll(){
  allOpen = !allOpen;
  document.querySelectorAll('tr.detail').forEach(function(d){ d.classList.toggle('show', allOpen); });
  document.querySelectorAll('tr.row').forEach(function(r){ r.classList.toggle('open', allOpen); });
}
</script>
</body></html>`;
}

module.exports = async function handler(req, res) {
  const token = (req.query && req.query.token) || req.headers["x-insights-token"];
  if (!process.env.INSIGHTS_TOKEN || token !== process.env.INSIGHTS_TOKEN) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(401).send("Unauthorized");
  }
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: "Upstash not configured" });
  }

  const month =
    (req.query && /^\d{6}$/.test(req.query.month || "") ? req.query.month : null) ||
    thisMonthYYYYMM();
  const q = ((req.query && req.query.q) || "").toString().trim().toLowerCase();
  const onlyPhone = !!(req.query && req.query.phone);
  const format = (req.query && req.query.format) || "html";

  try {
    const r = await redisPipeline([["LRANGE", "pes:chatlog:" + month, 0, -1]]);
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

    let sessions = buildSessions(entries);
    if (onlyPhone) sessions = sessions.filter((s) => s.phone);
    if (q) {
      sessions = sessions.filter((s) =>
        s.turns.some(
          (t) =>
            String(t.q || "").toLowerCase().includes(q) ||
            String(t.a || "").toLowerCase().includes(q)
        )
      );
    }

    const stats = {
      sessions: sessions.length,
      turns: sessions.reduce((n, s) => n + s.turns.length, 0),
      withPhone: sessions.filter((s) => s.phone).length,
      errors: sessions.reduce((n, s) => n + s.errors, 0),
      q: q,
      onlyPhone: onlyPhone,
    };

    if (format === "json") {
      return res.status(200).json({ month: month, stats: stats, sessions: sessions });
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    return res.status(200).send(renderHTML(month, sessions, stats, token));
  } catch (error) {
    console.error("logs error:", error.message);
    return res.status(500).json({ error: "Logs failed: " + error.message });
  }
};
