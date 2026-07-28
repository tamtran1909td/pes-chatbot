(function () {
  "use strict";

  // === CONFIG ===
  const API_URL =
    window.PES_CHATBOT_API || "https://pes-chatbot.vercel.app/api/chat";
  const BRAND = {
    primary: "#BB86FC",
    teal: "#03DAC6",
    bg: "#1a1a1a",
    bgDark: "#121212",
    text: "#e0e0e0",
    textMuted: "#999",
    white: "#ffffff",
  };

  // === STATE ===
  let isOpen = false;
  let messages = [];
  let isLoading = false;

  // === STYLES ===
  const style = document.createElement("style");
  style.textContent = `
    #pes-chat-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${BRAND.primary};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(187,134,252,0.4);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #pes-chat-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(187,134,252,0.55);
    }
    #pes-chat-btn svg { width: 28px; height: 28px; fill: ${BRAND.white}; }

    #pes-chat-box {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: ${BRAND.bgDark};
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      z-index: 99998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid rgba(187,134,252,0.2);
    }
    #pes-chat-box.open { display: flex; }

    .pes-chat-header {
      background: ${BRAND.bg};
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .pes-chat-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pes-chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${BRAND.primary};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      color: ${BRAND.white};
    }
    .pes-chat-title {
      font-size: 15px;
      font-weight: 600;
      color: ${BRAND.white};
    }
    .pes-chat-subtitle {
      font-size: 11px;
      color: ${BRAND.teal};
      margin-top: 2px;
    }
    .pes-chat-close {
      background: none;
      border: none;
      color: ${BRAND.textMuted};
      cursor: pointer;
      font-size: 20px;
      padding: 4px;
      line-height: 1;
    }
    .pes-chat-close:hover { color: ${BRAND.white}; }

    .pes-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .pes-chat-messages::-webkit-scrollbar { width: 4px; }
    .pes-chat-messages::-webkit-scrollbar-track { background: transparent; }
    .pes-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

    .pes-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .pes-msg a {
      color: ${BRAND.teal};
      text-decoration: underline;
    }
    .pes-msg-user {
      align-self: flex-end;
      background: ${BRAND.primary};
      color: ${BRAND.white};
      border-bottom-right-radius: 4px;
    }
    .pes-msg-bot {
      align-self: flex-start;
      background: ${BRAND.bg};
      color: ${BRAND.text};
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .pes-msg-loading {
      align-self: flex-start;
      background: ${BRAND.bg};
      padding: 12px 18px;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .pes-dots { display: flex; gap: 5px; }
    .pes-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${BRAND.textMuted};
      animation: pesBounce 1.2s infinite ease-in-out;
    }
    .pes-dots span:nth-child(2) { animation-delay: 0.15s; }
    .pes-dots span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes pesBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    .pes-chat-input-wrap {
      padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      gap: 8px;
      background: ${BRAND.bg};
    }
    .pes-chat-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: ${BRAND.bgDark};
      color: ${BRAND.white};
      font-size: 14px;
      outline: none;
      resize: none;
      font-family: inherit;
      max-height: 80px;
    }
    .pes-chat-input::placeholder { color: ${BRAND.textMuted}; }
    .pes-chat-input:focus { border-color: ${BRAND.primary}; }
    .pes-chat-send {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: ${BRAND.primary};
      color: ${BRAND.white};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s;
    }
    .pes-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .pes-chat-send svg { width: 18px; height: 18px; fill: ${BRAND.white}; }

    .pes-chat-footer {
      padding: 8px;
      text-align: center;
      font-size: 10px;
      color: ${BRAND.textMuted};
      background: ${BRAND.bgDark};
    }
    .pes-chat-footer a {
      color: ${BRAND.primary};
      text-decoration: none;
    }

    .pes-quick-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .pes-quick-btn {
      padding: 6px 12px;
      border-radius: 16px;
      border: 1px solid rgba(187,134,252,0.3);
      background: transparent;
      color: ${BRAND.primary};
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s, border-color 0.15s;
    }
    .pes-quick-btn:hover {
      background: rgba(187,134,252,0.12);
      border-color: ${BRAND.primary};
    }

    @media (max-width: 480px) {
      #pes-chat-box {
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
      }
      #pes-chat-btn { bottom: 16px; right: 16px; width: 54px; height: 54px; }
    }
  `;
  document.head.appendChild(style);

  // === BUILD DOM ===
  // Floating button
  const btn = document.createElement("button");
  btn.id = "pes-chat-btn";
  btn.setAttribute("aria-label", "Má» chat tÆ° váº¥n PES Studio");
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
  document.body.appendChild(btn);

  // Chat box
  const box = document.createElement("div");
  box.id = "pes-chat-box";
  box.innerHTML = `
    <div class="pes-chat-header">
      <div class="pes-chat-header-left">
        <div class="pes-chat-avatar">P</div>
        <div>
          <div class="pes-chat-title">PES Studio</div>
          <div class="pes-chat-subtitle">TÆ° váº¥n bÃ¡o giÃ¡ tá»± Äá»ng</div>
        </div>
      </div>
      <button class="pes-chat-close" aria-label="ÄÃ³ng chat">&times;</button>
    </div>
    <div class="pes-chat-messages" id="pes-msgs"></div>
    <div class="pes-chat-input-wrap">
      <textarea class="pes-chat-input" id="pes-input" placeholder="Nháº­p cÃ¢u há»i..." rows="1"></textarea>
      <button class="pes-chat-send" id="pes-send" aria-label="Gá»­i">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="pes-chat-footer">
      Powered by <a href="https://pes-studio.com" target="_blank" rel="noopener">PES Studio</a>
    </div>
  `;
  document.body.appendChild(box);

  const msgsEl = document.getElementById("pes-msgs");
  const inputEl = document.getElementById("pes-input");
  const sendBtn = document.getElementById("pes-send");

  // === HELPERS ===
  function scrollToBottom() {
    setTimeout(() => { msgsEl.scrollTop = msgsEl.scrollHeight; }, 50);
  }

  function formatMessage(text) {
    // Convert markdown bold
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Convert URLs to links
    text = text.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );
    return text;
  }

  function addMessage(role, content) {
    messages.push({ role, content });

    const div = document.createElement("div");
    div.className = `pes-msg pes-msg-${role === "user" ? "user" : "bot"}`;
    div.innerHTML = formatMessage(content);
    msgsEl.appendChild(div);
    scrollToBottom();
  }

  function showLoading() {
    const div = document.createElement("div");
    div.className = "pes-msg-loading";
    div.id = "pes-loading";
    div.innerHTML = `<div class="pes-dots"><span></span><span></span><span></span></div>`;
    msgsEl.appendChild(div);
    scrollToBottom();
  }

  function hideLoading() {
    const el = document.getElementById("pes-loading");
    if (el) el.remove();
  }

  function showQuickButtons() {
    const wrap = document.createElement("div");
    wrap.className = "pes-quick-btns";
    wrap.id = "pes-quick";

    const buttons = [
      "Chá»¥p cÄn há» 2PN",
      "Chá»¥p homestay",
      "Quay video villa",
      "Xem báº£ng giÃ¡",
    ];

    buttons.forEach((text) => {
      const b = document.createElement("button");
      b.className = "pes-quick-btn";
      b.textContent = text;
      b.addEventListener("click", () => {
        wrap.remove();
        sendMessage(text);
      });
      wrap.appendChild(b);
    });

    msgsEl.appendChild(wrap);
    scrollToBottom();
  }

  // === GREETING ===
  function showGreeting() {
    addMessage(
      "assistant",
      "ChÃ o anh/chá»! Em lÃ  trá»£ lÃ½ tÆ° váº¥n cá»§a PES Studio.\n\nAnh/chá» Äang quan tÃ¢m dá»ch vá»¥ chá»¥p áº£nh / quay video cho khÃ´ng gian nÃ o áº¡?"
    );
    showQuickButtons();
  }

  // === API CALL ===
  async function sendMessage(text) {
    if (isLoading || !text.trim()) return;

    // Remove quick buttons if present
    const quickEl = document.getElementById("pes-quick");
    if (quickEl) quickEl.remove();

    addMessage("user", text.trim());
    isLoading = true;
    sendBtn.disabled = true;
    inputEl.value = "";
    inputEl.style.height = "auto";
    showLoading();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      hideLoading();

      if (res.ok && data.reply) {
        addMessage("assistant", data.reply);
      } else {
        addMessage(
          "assistant",
          data.error ||
            "Xin lá»i, em Äang gáº·p sá»± cá». Anh/chá» vui lÃ²ng thá»­ láº¡i sau hoáº·c nháº¯n Zalo Äá» ÄÆ°á»£c tÆ° váº¥n trá»±c tiáº¿p."
        );
      }
    } catch (err) {
      hideLoading();
      addMessage(
        "assistant",
        "Xin lá»i, khÃ´ng thá» káº¿t ná»i. Anh/chá» vui lÃ²ng kiá»m tra káº¿t ná»i máº¡ng vÃ  thá»­ láº¡i."
      );
    }

    isLoading = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

  // === EVENTS ===
  btn.addEventListener("click", () => {
    isOpen = !isOpen;
    box.classList.toggle("open", isOpen);
    if (isOpen) {
      if (messages.length === 0) showGreeting();
      inputEl.focus();
    }
  });

  box.querySelector(".pes-chat-close").addEventListener("click", () => {
    isOpen = false;
    box.classList.remove("open");
  });

  sendBtn.addEventListener("click", () => sendMessage(inputEl.value));

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + "px";
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (isOpen && !box.contains(e.target) && !btn.contains(e.target)) {
      isOpen = false;
      box.classList.remove("open");
    }
  });
})();
