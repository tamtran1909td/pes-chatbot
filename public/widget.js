(function () {
  "use strict";

  // === CONFIG ===
  const API_URL =
    window.PES_CHATBOT_API || "https://pes-chatbot.vercel.app/api/chat";
  // Số Zalo chính thức DUY NHẤT của PES Studio (chốt 01/07/2026)
  const ZALO_PHONE = "0368390315";
  const ZALO_URL = window.PES_ZALO_URL || "https://zalo.me/" + ZALO_PHONE;
  // Trang khách tự thao tác chọn gói / xem báo giá
  const BOOKING_URL = window.PES_BOOKING_URL || "https://book.pes-studio.com/";
  const BRAND = {
    primary: "#BB86FC",
    teal: "#03DAC6",
    bg: "#1a1a1a",
    bgDark: "#121212",
    text: "#e0e0e0",
    textMuted: "#999",
    white: "#ffffff",
  };

  // PES Studio logo (96x96, black on white background)
  const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAKKUlEQVR42u2bW0hUXRuA1957nBoxD+WIYR6+8lhjWampXShWI2ZYkiZBCiZEdKGUBd14iKxACsOEIvLCoLqSskwIxKCDqIgjaqikY5Fm4+HP7YzVzD6s/+Kl1fzqjPN93x4b+/d7pWvvWXutZ7/rPa21KYwxksW20DICGZAMSAYkA5IByYBkQDIgWWRAMiAZkAxIBiQDkgHJgGSRAcmAZEArJApnPwBjLIoiRVGkhaIo8i9cJRsH1u3kTpr+nW+R+i27GqIoiqJI07SDk+d53vGbVw0gQRAYhnnz5s21a9c4jjObzQqFgmGY8+fPa7VauGd2dnZoaGhgYECv109MTLAsa7FYVCrV+vXrAwMDIyMjo6Ojt2zZQrBijBmG+UOWGKAfGRlpbm62bs/Ozh4eHn78+HFra2t3d/fk5KSdTpRKpUajSU9Pz8nJ2bFjB2BCCK2cNmGnCcdxGONHjx4xDKNUKpmfEhQUpFQqrU2SwkoYhrH++5c3oemMjIyWlhbonOd5vCLidEAPHz5ECC1eFzB/a+O9tAmgKJqmFYpfmp6VlTUwMIAxFgQBFp1ThV4B9Vw8Z4qieJ4XBGFZCwhujud5oEzT9OPHj+Pi4mpqamiapigKVtyqjIPAu7u5uVn7b1vUHLT6oigyDGMymYqLi48dOzY3N0fTtCAIq88GgXZMTk4mJCRIHsuA2UIIxcTEfPjwwakmCTmPzufPnzUajfM8DjAKCQkZGRkhD10FgERRFASBZVnwytb21d5Sp2niv8DWOM4oLCxsamoKnuvqgERRBOeVkZGBEAIDtOxiWdKXwaVlSQGjffv2CYLA87zkfk1iQGALrl69uiwdiqKsff+mTZuSk5Ozs7NzcnJSUlICAwPJpWWjAXhQRUWFM4wRkpxOb2+vm5ub/VkRvfD39y8pKWlra5ufn7fuan5+vqOjo7S0lOQZdjIMYK1QKHp6eiRnhCS3zSkpKfbnA5dUKlVZWdnU1BRZmzzP8zzPcZzFYiHWxGQy1dTU+Pr6OtJncnKy5NYaSas+TU1Njsxk586d8Lbtv/AfP37AH6Ojo8nJyfZNPvTc1NQkrRIhadUnKSlpgXFZPIcDBw4YjUYyf57nm5ubT58+HRcXFxwcHB4enpGRUV1dPTo6Cj2bzWaMscViyczMtEMfFnViYqK07gxJqD7t7e12oh5oj4+P//btG5n2s2fPoqKi4IaAgIDY2Njo6Ghi3YuKimZnZ4EOAI2Li1v2EW/fvpVQiaQBBK79zJkztlYBBNPe3t4Q+AKd0tJShJCnp2dVVZVeryddiaLY2dmZlpaGEIqKihoaGiKM3r9/7+HhAVmYLZdfWFjoWoAg9DCbzSEhIbZeL6yL2tpasrLKy8sRQgcPHpyYmCBdtbS0+Pj4xMbG3rt3D2NcX18PsfL4+LgoioD1ypUrthYaUPP394clLElMhKRaX11dXQuS0gWaHx4ebrFYQBFaW1sRQmlpafBbcFuiKBqNxpcvX1ZUVPj5+UVERLAs29jYiBDSarXwIEEQjEajv7+/rTcBjVA2kkSJkFTrq7a21tb6gsabN2/CzTzPb9u2zcvLy2Aw2JqG2Ww+cuSIWq3GGJ87dw4h9Pz5c6J9Fy9etP+ssrIyMjBXAVRYWLjkoEGnVCrVp0+fQOdfv36NELp06dLiOUA0BFqGMdZoNPn5+RzHrVmzJjU1FXRNFMWuri6IDCFrY6xEqVTSNH348GEX0iDwqRCnLDYN1iEcGJELFy4ghIaHh+34YzDVHR0dCCGj0Xj06FGGYb5+/UribG9vbzvJR2hoqFRJmeLfl5NomhZF8cuXL6RQv1iD9u7dS652d3d7eXmFhITYyUUUCgXGOD4+fuPGjW1tbenp6Q0NDXq9fteuXYIguLu7Z2Zm9vf3MwwjiiLktBhjKDByHBcQECAIAnSybFV3JXY1vn//Pjc3tyQgkPDwcGJBZ2Zm/Pz8GIaxP3q4qlQqh4eHN2/ejBCCR4CAg3OktOYSJVez2czz/JKjAWQ+Pj6kRaVSmUwmGL2d2iv0lpWVFRMTMz09DbBW6948RVEsy9rZ1QPjDQX2yMhIg8EwPT3tyMuvrq5OSkp69eoVxjgoKIi0g+2zJVDkdwlAsOwhGnZ3d+d5ftl6oFarFUWxpaUF6vD2DRzHcRzHNTU1hYWFBQQEEI07fvx4REREVFRUxP8KtGRmZkq2YyxVIRFj3NfXR/aUSZ0QdAqiGHDqLMt6enpu376deCtb3YK/B3Nz48YN0sKy7Lp16+xMKi0tzYXc/IKqRX19fWhoKPHxSqWSoigABBUfjPH169cRQpWVlcBosbMXRRFYfPz4ccOGDQEBASzLksaGhgYoJNKLBOKgJYOs35/NkzHNzc1VVVUFBweTV9rc3Ay3kcJYamoqQujWrVskmOJ+CulteHh469atCKEXL15Y801MTLSVjrliqgFpZGFhIagJWXEsy969ezc5OZmiqCdPnpARw9mX6enphIQEhFBubu67d+8W9Gkyme7cuePh4YEQqqurg9+C+tTV1dlPVtVq9dzcnAslq6A1xcXFYDt1Ot2CG3p7e8fGxqxHDGvKaDSeOnUK5paQkFBSUlJdXV1ZWZmbmwthwV9//UV0B54yODjo6elpp9xBUdSJEydcq9wBsx0cHIRCl0KhyMvL6+jocORXGOOOjo6CggKoOhPZs2fP7du3TSYTvADQnfHxceuA09b6am1tdbmCGYzm0KFDkDHCcPfv33///n1I2e1vokGaptfru7u7+/v7rSv5kL5BOSUsLGzZkivkIi5acu3s7CQ7MGTcvr6+WVlZQ0ND/7hUbDAYysvL165d68h2gLWxc8Vdjfz8fBI3W2vTkuPmef4/P2VmZmb6p0xOTo6Njel0ugcPHhQUFKjV6gW7abboQEnERbd9QLENBoNarbY+zgFVG+LmrQ1QX1/f+qXEy8vL3d198fKxv3GoUqkGBwcl36GXfmf16dOntiLpBYB0Op39KB9W67IZOTgHKGO79NYzcfmXL1+GcZM9siUB9fT0ULbFwVQJ6Jw9e1aq0Nnpx19glCUlJaBHYI9sAZLkGNXJkydJmL4KAEEygTEuKysDy0rTtOSAiFUqKirCzjzQ6ZQTZoRRXV0dmNsljfQ/A0QUx83NraamBjv5uKvTjwHrdLq4uLjGxsZ/D8j6PPDu3bvb29ux8w9MI6f2TrJT2OpckGcsCwjChQW+zN/fv6qqCiJsZ1hliXc1lrUU8NEK5OV/q6j+6x3+FI1Gk5eXR0JH2M9Y9Z9DwYbMkiwWzH+xqFQqPz+/8PDwxMRErVabkJAAQYMgCCv28c/v+RyKbBYNDg5yHGfLBnt7e/v6+kIWRr6LcuQDhj8EkOMn9uHQvq0y0J8MyPpzwyUN09+Kqv9PNej3ivxRrwxIBiQDkgHJgGRAMiAZkCwyIBmQDEgGJAOSAcmAZECyyIBkQDIgGZAMSAb0R8h/AbpIuXnqmL63AAAAAElFTkSuQmCC";

  // === STATE ===
  let isOpen = false;
  let messages = [];
  let isLoading = false;
  let pendingImage = null; // { base64, mimeType }
  // Chống spam phía client
  let lastSentAt = 0;
  let lastSentText = "";
  let sentCount = 0;
  const SEND_COOLDOWN_MS = 1500; // tối thiểu giữa 2 tin
  const MAX_MSGS_PER_SESSION = 25; // trần số tin mỗi phiên

  // ID phiên (nhóm hội thoại khi phân tích) + tracking GA4
  const SESSION_ID =
    "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  function track(event, params) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", event, params || {});
      } else {
        (window.dataLayer = window.dataLayer || []).push(
          Object.assign({ event: event }, params || {})
        );
      }
    } catch (e) {}
  }

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
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffffff;
      padding: 2px;
      box-sizing: border-box;
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
      width: 36px !important;
      height: 36px !important;
      border-radius: 0 !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      color: ${BRAND.primary};
      cursor: pointer;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0;
      padding: 0 !important;
      outline: none !important;
      transition: opacity 0.2s;
    }
    .pes-chat-send:hover { opacity: 0.75; }
    .pes-chat-send:disabled { opacity: 0.3; cursor: not-allowed; }
    .pes-chat-send svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

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

    /* === Thanh hành động theo ngữ cảnh (P4-020 / P4-022) === */
    .pes-action-bar {
      display: none;
      align-items: center;
      gap: 8px;
      padding: 8px 12px 2px;
      background: ${BRAND.bgDark};
      border-top: 1px solid rgba(255,255,255,0.06);
      animation: pesActionIn 0.22s ease-out;
    }
    .pes-action-bar.is-visible { display: flex; }
    @keyframes pesActionIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pes-action-btn.is-hidden { display: none !important; }
    .pes-action-dismiss {
      flex: 0 0 auto;
      width: 26px; height: 26px;
      display: flex; align-items: center; justify-content: center;
      border: none; background: transparent;
      color: ${BRAND.textMuted};
      font-size: 18px; line-height: 1;
      cursor: pointer; border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    .pes-action-dismiss:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .pes-action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid transparent;
      transition: opacity 0.15s, background 0.15s, border-color 0.15s;
    }
    .pes-action-btn svg {
      width: 16px; height: 16px; flex: 0 0 16px;
      fill: none; stroke: currentColor; stroke-width: 2;
      stroke-linecap: round; stroke-linejoin: round;
    }
    .pes-action-btn.zalo {
      background: ${BRAND.primary};
      color: #121212;
    }
    .pes-action-btn.zalo:hover { opacity: 0.85; }
    .pes-action-btn.book {
      background: transparent;
      color: ${BRAND.teal};
      border-color: rgba(3,218,198,0.45);
    }
    .pes-action-btn.book:hover {
      background: rgba(3,218,198,0.12);
      border-color: ${BRAND.teal};
    }
    /* Tablet / iPad: giữ 2 nút cân đối, giảm nhẹ chiều cao */
    @media (min-width: 481px) and (max-width: 1024px) {
      .pes-action-bar { padding: 8px 12px 2px; }
      .pes-action-btn { font-size: 13px; padding: 9px 8px; }
    }
    /* Điện thoại: thanh mỏng, chữ nhỏ, không chiếm tầm nhìn */
    @media (max-width: 480px) {
      .pes-action-bar { padding: 6px 10px 2px; gap: 6px; }
      .pes-action-btn { font-size: 12px; padding: 8px 6px; border-radius: 8px; }
      .pes-action-btn svg { width: 14px; height: 14px; flex: 0 0 14px; }
      .pes-action-dismiss { width: 24px; height: 24px; font-size: 16px; }
    }
    @media (max-width: 380px) {
      .pes-action-btn { font-size: 11px; padding: 8px 4px; gap: 4px; }
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
      width: 36px !important;
      height: 36px !important;
      border-radius: 0 !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      color: ${BRAND.textMuted};
      cursor: pointer;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0;
      padding: 0 !important;
      outline: none !important;
      transition: color 0.2s;
    }
    .pes-chat-upload-btn:hover { color: ${BRAND.primary}; background: transparent !important; }
    .pes-chat-upload-btn svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

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
    .pes-chat-avatar img { width: 100%; height: 100%; object-fit: contain; border-radius: 50%; }

    @media (max-width: 480px) {
      #pes-chat-box {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100vw;
        height: 65vh;
        height: 65dvh;
        max-height: 65dvh;
        border-radius: 16px 16px 0 0;
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
    <div class="pes-action-bar" id="pes-action-bar">
      <a class="pes-action-btn zalo is-hidden" id="pes-zalo-btn" href="${ZALO_URL}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        Nhắn Zalo tư vấn
      </a>
      <a class="pes-action-btn book is-hidden" id="pes-book-btn" href="${BOOKING_URL}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Xem bảng giá
      </a>
      <button class="pes-action-dismiss" id="pes-action-dismiss" aria-label="Ẩn nút gợi ý" title="Ẩn">&times;</button>
    </div>
    <div class="pes-img-preview" id="pes-img-preview" style="display:none;">
      <div class="pes-img-preview-inner">
        <img id="pes-img-thumb" src="" alt="Preview">
        <button class="pes-img-preview-close" id="pes-img-remove" aria-label="Xóa ảnh">&times;</button>
      </div>
    </div>
    <div class="pes-chat-input-wrap">
      <button class="pes-chat-upload-btn" id="pes-upload-btn" aria-label="Tải ảnh lên">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </button>
      <input type="file" id="pes-file-input" accept="image/*" style="display:none;">
      <textarea class="pes-chat-input" id="pes-input" placeholder="Nhập câu hỏi..." rows="1"></textarea>
      <button class="pes-chat-send" id="pes-send" aria-label="Gửi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
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
  const zaloBtn = document.getElementById("pes-zalo-btn");
  const bookBtn = document.getElementById("pes-book-btn");

  // Tracking 2 nút hành động (P4-020) — đo hiệu quả trong báo cáo insight hàng tháng
  if (zaloBtn) {
    zaloBtn.addEventListener("click", function () {
      track("pes_chat_zalo_click", {
        session_id: SESSION_ID,
        msgs_before_click: sentCount,
      });
    });
  }
  if (bookBtn) {
    bookBtn.addEventListener("click", function () {
      track("pes_chat_booking_click", {
        session_id: SESSION_ID,
        msgs_before_click: sentCount,
      });
    });
  }

  // === P4-022: thanh hành động hiện THEO NGỮ CẢNH ===
  // Không hiện mặc định (che tầm nhìn trên điện thoại) — chỉ bật đúng nút
  // khi câu của khách hoặc câu trả lời của bot chạm từ khoá tương ứng.
  const actionBar = document.getElementById("pes-action-bar");
  const actionDismiss = document.getElementById("pes-action-dismiss");

  // Bỏ dấu tiếng Việt để bắt được cả trường hợp khách gõ không dấu
  function pesNoAccent(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  // Từ khoá bảng giá: khách đang hỏi tiền → đưa trang báo giá tự phục vụ
  // Cố ý KHÔNG dùng "gia" trần (trùng "gia đình", "tham gia") hay "tien"
  // (trùng "tiện nghi") — chỉ bắt cụm đủ rõ nghĩa để tránh bật nút sai lúc.
  const PRICE_KEYWORDS = [
    "bao gia", "bang gia", "don gia", "gia ca", "gia chup", "gia quay",
    "gia bao nhieu", "gia the nao", "gia goi", "chi phi", "bao nhieu",
    "het bao nhieu", "bao nhieu tien", "goi chup", "goi quay", "combo",
    "khuyen mai", "uu dai", "mac khong", "re khong", "budget", "price",
    "tinh phi", "phu phi", "thanh toan", "coc",
  ];
  // Từ khoá tư vấn / chốt lịch: khách muốn nói chuyện với người thật
  const CONTACT_KEYWORDS = [
    "zalo", "lien he", "tu van", "goi dien", "so dien thoai", "sdt",
    "dat lich", "book lich", "dat cho", "dat hen", "hen lich", "lich chup",
    "lich trong", "gap nhan vien", "noi chuyen truc tiep", "nhan tin",
    "khao sat", "ky hop dong", "goi lai", "de lai so",
  ];

  function pesMatch(text, list) {
    const t = pesNoAccent(text);
    return list.some(function (k) { return t.indexOf(k) > -1; });
  }

  let actionBarDismissed = false;

  function updateActionBar(text) {
    if (!actionBar || !text) return;
    const wantPrice = pesMatch(text, PRICE_KEYWORDS);
    const wantContact = pesMatch(text, CONTACT_KEYWORDS);
    if (!wantPrice && !wantContact) return;

    // Có tín hiệu mới → bỏ trạng thái đã tắt trước đó
    actionBarDismissed = false;

    const shown = [];
    if (wantPrice && bookBtn && bookBtn.classList.contains("is-hidden")) {
      bookBtn.classList.remove("is-hidden");
      shown.push("booking");
    }
    if (wantContact && zaloBtn && zaloBtn.classList.contains("is-hidden")) {
      zaloBtn.classList.remove("is-hidden");
      shown.push("zalo");
    }
    if (!actionBar.classList.contains("is-visible")) {
      actionBar.classList.add("is-visible");
      scrollToBottom();
    }
    if (shown.length) {
      track("pes_chat_actionbar_shown", {
        session_id: SESSION_ID,
        buttons: shown.join(","),
        msgs_before: sentCount,
      });
    }
  }

  if (actionDismiss) {
    actionDismiss.addEventListener("click", function () {
      actionBar.classList.remove("is-visible");
      if (zaloBtn) zaloBtn.classList.add("is-hidden");
      if (bookBtn) bookBtn.classList.add("is-hidden");
      actionBarDismissed = true;
      track("pes_chat_actionbar_dismiss", { session_id: SESSION_ID, msgs_before: sentCount });
    });
  }

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
    // P4-022: bật nút gợi ý nếu nội dung (của khách hoặc của bot) chạm từ khoá
    updateActionBar(content);
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

    // === Chống spam phía client ===
    const now = Date.now();
    if (now - lastSentAt < SEND_COOLDOWN_MS) return; // cooldown, bỏ qua bấm dồn
    const trimmed = text.trim();
    if (trimmed && trimmed === lastSentText && now - lastSentAt < 15000) return; // chặn tin trùng liên tiếp
    if (sentCount >= MAX_MSGS_PER_SESSION) {
      addMessage(
        "assistant",
        "Anh/chị đã trao đổi khá nhiều với em rồi ạ. Để được tư vấn chi tiết và nhanh nhất, anh/chị vui lòng nhắn Zalo giúp em nhé!"
      );
      return;
    }
    lastSentAt = now;
    lastSentText = trimmed;
    sentCount++;
    track("pes_chat_message", { count: sentCount });

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
          sessionId: SESSION_ID,
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
      stopNotifyLoop();
      track("pes_chat_open");
      if (messages.length === 0) showGreeting();
      inputEl.focus();
      adjustViewport();
    } else {
      box.style.bottom = "";
      box.style.height = "";
    }
  });

  box.querySelector(".pes-chat-close").addEventListener("click", () => {
    isOpen = false;
    box.classList.remove("open");
    box.style.bottom = "";
    box.style.height = "";
    // Restart notify loop when chat is closed
    startNotifyLoop();
  });

  // === MOBILE: co khung chat theo bàn phím (visualViewport) — hết mảng đen ===
  const isMobile = () => window.matchMedia("(max-width: 480px)").matches;
  function adjustViewport() {
    if (!isMobile() || !isOpen) {
      box.style.bottom = "";
      box.style.height = "";
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    const avail = vv.height - 12;
    const target = Math.min(Math.round(window.innerHeight * 0.65), avail);
    box.style.bottom = keyboard + "px";
    box.style.height = target + "px";
    scrollToBottom();
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", adjustViewport);
    window.visualViewport.addEventListener("scroll", adjustViewport);
  }
  window.addEventListener("resize", adjustViewport);

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

  // === NOTIFICATION BUBBLE (repeating: 10s interval, 5s display) ===
  let notifyInterval = null;

  // Pop sound using Web Audio API
  function playPopSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
  }

  function showNotification() {
    if (isOpen) return;
    // Remove existing notification if any
    const existing = document.getElementById("pes-chat-notify");
    if (existing) existing.remove();

    playPopSound();

    const notif = document.createElement("div");
    notif.id = "pes-chat-notify";
    notif.innerHTML = `
      <button class="pes-notify-close" aria-label="Đóng">&times;</button>
      <strong style="color:$` + `{BRAND.primary}">PES Studio AI</strong> có thể giúp anh/chị chọn gói chụp phù hợp nhất cho dự án!
    `;
    document.body.appendChild(notif);

    // Click notification → open chat
    notif.addEventListener("click", (e) => {
      if (e.target.classList.contains("pes-notify-close")) {
        notif.remove();
        return;
      }
      notif.remove();
      stopNotifyLoop();
      isOpen = true;
      box.classList.add("open");
      if (messages.length === 0) showGreeting();
      inputEl.focus();
    });

    // Auto-hide after 5s
    setTimeout(() => { if (notif.parentNode) notif.remove(); }, 5000);
  }

  function startNotifyLoop() {
    showNotification();
    notifyInterval = setInterval(showNotification, 15000); // 5s display + 10s pause = 15s cycle
  }

  function stopNotifyLoop() {
    if (notifyInterval) { clearInterval(notifyInterval); notifyInterval = null; }
    const existing = document.getElementById("pes-chat-notify");
    if (existing) existing.remove();
  }

  // Start first popup after 5s, then loop
  setTimeout(startNotifyLoop, 5000);

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
