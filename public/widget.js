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

  // PES Studio logo (white, 72x72)
  const LOGO_B64 = "data:image/png;base64,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";

  // === STATE ===
  let isOpen = false;
  let messages = [];
  let isLoading = false;
  let pendingImage = null; // { base64, mimeType }

  // === STYLES ===
  const style = document.createElement("style");
  style.textContent = `
    #pes-chat-btn {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 60px !important;
      height: 60px !important;
      min-width: 60px !important;
      min-height: 60px !important;
      max-width: 60px !important;
      max-height: 60px !important;
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 50% !important;
      background: ${BRAND.primary} !important;
      border: none !important;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(187,134,252,0.4);
      z-index: 99999;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.2s, box-shadow 0.2s;
      box-sizing: border-box !important;
      line-height: 1 !important;
      font-size: 0 !important;
      text-indent: 0 !important;
      letter-spacing: 0 !important;
    }
    #pes-chat-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(187,134,252,0.55);
    }
    #pes-chat-btn svg { width: 28px; height: 28px; fill: ${BRAND.white}; }

    #pes-chat-box {
      position: fixed;
      bottom: 96px;
      right: 80px;
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

    /* Notification bubble */
    #pes-chat-notify {
      position: fixed;
      bottom: 90px;
      right: 24px;
      background: ${BRAND.bg};
      color: ${BRAND.text};
      padding: 12px 16px;
      border-radius: 12px;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      max-width: 280px;
      border: 1px solid rgba(187,134,252,0.25);
      animation: pesSlideUp 0.4s ease-out;
      cursor: pointer;
    }
    #pes-chat-notify:hover {
      border-color: ${BRAND.primary};
    }
    #pes-chat-notify .pes-notify-close {
      position: absolute;
      top: 4px;
      right: 8px;
      background: none;
      border: none;
      color: ${BRAND.textMuted};
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 2px;
    }
    @keyframes pesSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Upload button */
    .pes-chat-upload-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: ${BRAND.textMuted};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: color 0.2s, background 0.2s;
    }
    .pes-chat-upload-btn:hover {
      color: ${BRAND.primary};
      background: rgba(187,134,252,0.1);
    }
    .pes-chat-upload-btn svg { width: 20px; height: 20px; fill: currentColor; }

    /* Image preview */
    .pes-img-preview {
      padding: 8px 16px 0;
      background: ${BRAND.bg};
    }
    .pes-img-preview-inner {
      position: relative;
      display: inline-block;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .pes-img-preview img {
      max-width: 120px;
      max-height: 80px;
      display: block;
    }
    .pes-img-preview-close {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(0,0,0,0.7);
      border: none;
      color: ${BRAND.white};
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    /* Image in message */
    .pes-msg img.pes-msg-image {
      max-width: 100%;
      border-radius: 8px;
      margin-bottom: 6px;
      display: block;
    }

    /* Privacy notice */
    .pes-privacy {
      text-align: center;
      font-size: 10px;
      color: ${BRAND.textMuted};
      padding: 4px 16px 8px;
      line-height: 1.4;
    }
    .pes-privacy svg { width: 10px; height: 10px; fill: ${BRAND.teal}; vertical-align: -1px; margin-right: 3px; }

    /* Logo avatar */
    .pes-chat-avatar img { width: 24px; height: 24px; object-fit: contain; }

    @media (max-width: 480px) {
      #pes-chat-box {
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
      }
      #pes-chat-btn { bottom: 16px !important; right: 16px !important; width: 54px !important; height: 54px !important; min-width: 54px !important; max-width: 54px !important; min-height: 54px !important; max-height: 54px !important; padding: 0 !important; }
      #pes-chat-notify { bottom: 76px; right: 16px; max-width: 260px; }
    }
  `;
  document.head.appendChild(style);

  // === BUILD DOM ===
  // Floating button
  const btn = document.createElement("button");
  btn.id = "pes-chat-btn";
  btn.setAttribute("aria-label", "Mở chat tư vấn PES Studio");
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
  document.body.appendChild(btn);

  // Chat box
  const box = document.createElement("div");
  box.id = "pes-chat-box";
  box.innerHTML = `
    <div class="pes-chat-header">
      <div class="pes-chat-header-left">
        <div class="pes-chat-avatar"><img src="${LOGO_B64}" alt="PES"></div>
        <div>
          <div class="pes-chat-title">PES Studio</div>
          <div class="pes-chat-subtitle">Tư vấn báo giá tự động</div>
        </div>
      </div>
      <button class="pes-chat-close" aria-label="Đóng chat">&times;</button>
    </div>
    <div class="pes-chat-messages" id="pes-msgs"></div>
    <div class="pes-img-preview" id="pes-img-preview" style="display:none;">
      <div class="pes-img-preview-inner">
        <img id="pes-img-thumb" src="" alt="Preview">
        <button class="pes-img-preview-close" id="pes-img-remove" aria-label="Xóa ảnh">&times;</button>
      </div>
    </div>
    <div class="pes-chat-input-wrap">
      <button class="pes-chat-upload-btn" id="pes-upload-btn" aria-label="Tải ảnh lên">
        <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
      </button>
      <input type="file" id="pes-file-input" accept="image/*" style="display:none;">
      <textarea class="pes-chat-input" id="pes-input" placeholder="Nhập câu hỏi..." rows="1"></textarea>
      <button class="pes-chat-send" id="pes-send" aria-label="Gửi">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="pes-privacy">
      <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
      Nội dung được bảo mật và lưu trữ nội bộ PES Studio
    </div>
    <div class="pes-chat-footer">
      Powered by <a href="https://pes-studio.com" target="_blank" rel="noopener">PES Studio</a>
    </div>
  `;
  document.body.appendChild(box);

  const msgsEl = document.getElementById("pes-msgs");
  const inputEl = document.getElementById("pes-input");
  const sendBtn = document.getElementById("pes-send");
  const uploadBtn = document.getElementById("pes-upload-btn");
  const fileInput = document.getElementById("pes-file-input");
  const imgPreview = document.getElementById("pes-img-preview");
  const imgThumb = document.getElementById("pes-img-thumb");
  const imgRemove = document.getElementById("pes-img-remove");

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

  function addMessage(role, content, imageData) {
    const msg = { role, content };
    if (imageData) msg.image = imageData;
    messages.push(msg);

    const div = document.createElement("div");
    div.className = `pes-msg pes-msg-${role === "user" ? "user" : "bot"}`;
    let html = "";
    if (imageData) {
      html += `<img class="pes-msg-image" src="data:${imageData.mimeType};base64,${imageData.base64}" alt="Ảnh đính kèm">`;
    }
    html += formatMessage(content);
    div.innerHTML = html;
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
      "Chụp căn hộ 2PN",
      "Chụp homestay",
      "Quay video villa",
      "Xem bảng giá",
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
      "Chào anh/chị! Em là trợ lý tư vấn của PES Studio.\n\nAnh/chị đang quan tâm dịch vụ chụp ảnh / quay video cho không gian nào ạ?"
    );
    showQuickButtons();
  }

  // === API CALL ===
  async function sendMessage(text) {
    if (isLoading || (!text.trim() && !pendingImage)) return;

    // Remove quick buttons if present
    const quickEl = document.getElementById("pes-quick");
    if (quickEl) quickEl.remove();

    const currentImage = pendingImage;
    pendingImage = null;
    imgPreview.style.display = "none";

    const msgText = text.trim() || (currentImage ? "Anh/chị gửi ảnh không gian để tham khảo báo giá." : "");
    addMessage("user", msgText, currentImage);
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
          messages: messages.map((m) => {
            const obj = { role: m.role, content: m.content };
            if (m.image) obj.image = m.image;
            return obj;
          }),
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
            "Xin lỗi, em đang gặp sự cố. Anh/chị vui lòng thử lại sau hoặc nhắn Zalo để được tư vấn trực tiếp."
        );
      }
    } catch (err) {
      hideLoading();
      addMessage(
        "assistant",
        "Xin lỗi, không thể kết nối. Anh/chị vui lòng kiểm tra kết nối mạng và thử lại."
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

  // === IMAGE UPLOAD ===
  uploadBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate: max 5MB, image only
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh (JPG, PNG, WEBP).");
      fileInput.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Full = reader.result; // data:image/jpeg;base64,...
      const parts = base64Full.split(",");
      const mimeType = parts[0].match(/:(.*?);/)[1];
      const base64 = parts[1];

      pendingImage = { base64, mimeType };
      imgThumb.src = base64Full;
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
  });

  imgRemove.addEventListener("click", () => {
    pendingImage = null;
    imgPreview.style.display = "none";
    imgThumb.src = "";
  });

  // === NOTIFICATION BUBBLE (after 5s) ===
  let notifyTimer = null;
  let notifyShown = false;

  function showNotification() {
    if (notifyShown || isOpen) return;
    notifyShown = true;

    const notif = document.createElement("div");
    notif.id = "pes-chat-notify";
    notif.innerHTML = `
      <button class="pes-notify-close" aria-label="Đóng">&times;</button>
      <strong style="color:${BRAND.primary}">PES Studio AI</strong> có thể giúp anh/chị chọn gói chụp phù hợp nhất cho dự án!
    `;
    document.body.appendChild(notif);

    // Click notification → open chat
    notif.addEventListener("click", (e) => {
      if (e.target.classList.contains("pes-notify-close")) {
        notif.remove();
        return;
      }
      notif.remove();
      isOpen = true;
      box.classList.add("open");
      if (messages.length === 0) showGreeting();
      inputEl.focus();
    });

    // Auto-hide after 8s
    setTimeout(() => { if (notif.parentNode) notif.remove(); }, 8000);
  }

  notifyTimer = setTimeout(showNotification, 5000);

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (isOpen && !box.contains(e.target) && !btn.contains(e.target)) {
      isOpen = false;
      box.classList.remove("open");
    }
    // Also dismiss notification on outside click
    const notif = document.getElementById("pes-chat-notify");
    if (notif && !notif.contains(e.target) && !btn.contains(e.target)) {
      notif.remove();
    }
  });
})();
