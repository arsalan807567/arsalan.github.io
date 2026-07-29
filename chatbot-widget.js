(function () {
  // ==== CONFIGURE THIS ====
  const WORKER_URL = "https://portfolio-chatbot.arslankhan807567.workers.dev/chat";
  // =========================

  const BOT_SVG = `<svg class="cb-bot-svg" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="cb-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="cb-helmet-grad" cx="30%" cy="25%" r="75%">
        <stop offset="0%" stop-color="#ffffff" /><stop offset="65%" stop-color="#f1f5f9" /><stop offset="100%" stop-color="#cbd5e1" />
      </radialGradient>
      <linearGradient id="cb-chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc" /><stop offset="50%" stop-color="#94a3b8" /><stop offset="100%" stop-color="#475569" />
      </linearGradient>
      <radialGradient id="cb-screen-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1e293b" /><stop offset="85%" stop-color="#0f172a" /><stop offset="100%" stop-color="#020617" />
      </radialGradient>
      <pattern id="cb-led-pattern" width="8" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="2" x2="8" y2="2" stroke="#00f2fe" stroke-width="2.5" />
      </pattern>
    </defs>
    <rect x="154" y="32" width="12" height="34" fill="url(#cb-chrome-grad)" rx="2" />
    <polygon points="142,32 178,32 170,16 150,16" fill="url(#cb-chrome-grad)" />
    <rect x="152" y="20" width="16" height="6" fill="#00f2fe" filter="url(#cb-glow-filter)" />
    <rect x="15" y="110" width="30" height="100" rx="4" fill="url(#cb-chrome-grad)" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="25" y="130" width="8" height="60" rx="2" fill="#00f2fe" filter="url(#cb-glow-filter)" />
    <rect x="275" y="110" width="30" height="100" rx="4" fill="url(#cb-chrome-grad)" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="287" y="130" width="8" height="60" rx="2" fill="#00f2fe" filter="url(#cb-glow-filter)" />
    <path d="M 90,65 L 230,65 L 275,110 L 275,210 L 230,255 L 90,255 L 45,210 L 45,110 Z" fill="url(#cb-helmet-grad)" stroke="#94a3b8" stroke-width="2" />
    <path d="M 102,80 L 218,80 L 260,122 L 260,198 L 218,240 L 102,240 L 60,198 L 60,122 Z" fill="#020617" stroke="rgba(0,242,254,0.3)" stroke-width="1.5" />
    <path d="M 102,80 L 218,80 L 260,122 L 260,198 L 218,240 L 102,240 L 60,198 L 60,122 Z" fill="none" stroke="#00f2fe" stroke-width="2" opacity="0.8" filter="url(#cb-glow-filter)" />
    <path d="M 104,83 L 216,83 L 257,124 L 257,196 L 216,237 L 104,237 L 63,196 L 63,124 Z" fill="url(#cb-screen-grad)" />
    <path d="M 88,122 L 138,114" stroke="#00f2fe" stroke-width="4.5" stroke-linecap="square" filter="url(#cb-glow-filter)" />
    <rect x="90" y="135" width="46" height="25" rx="3" fill="#00f2fe" opacity="0.45" filter="url(#cb-glow-filter)" />
    <rect x="90" y="135" width="46" height="25" rx="3" fill="url(#cb-led-pattern)" />
    <path d="M 182,114 L 232,122" stroke="#00f2fe" stroke-width="4.5" stroke-linecap="square" filter="url(#cb-glow-filter)" />
    <rect x="184" y="135" width="46" height="25" rx="3" fill="#00f2fe" opacity="0.45" filter="url(#cb-glow-filter)" />
    <rect x="184" y="135" width="46" height="25" rx="3" fill="url(#cb-led-pattern)" />
    <path d="M 130,190 L 160,202 L 190,190" fill="none" stroke="#00f2fe" stroke-width="5" stroke-linejoin="round" stroke-linecap="square" filter="url(#cb-glow-filter)" />
  </svg>`;

  const BOT_SVG_SMALL = `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <path d="M 90,65 L 230,65 L 275,110 L 275,210 L 230,255 L 90,255 L 45,210 L 45,110 Z" fill="#e3e8f0" />
    <rect x="15" y="120" width="26" height="80" rx="4" fill="#48607f" />
    <rect x="279" y="120" width="26" height="80" rx="4" fill="#48607f" />
    <path d="M 104,83 L 216,83 L 257,124 L 257,196 L 216,237 L 104,237 L 63,196 L 63,124 Z" fill="#0f172a" />
    <rect x="90" y="135" width="46" height="25" rx="6" fill="#22e8ff" />
    <rect x="184" y="135" width="46" height="25" rx="6" fill="#22e8ff" />
  </svg>`;

  const ICONS = {
    close: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.4 20.6L21 12 3.4 3.4 3.4 10.4 15 12 3.4 13.6 3.4 20.6Z" fill="#fff"/>
    </svg>`,
    whatsapp: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4.1 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7C28.7 8.7 23 3 16 3z" fill="#fff"/>
      <path d="M23 19.3c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.8-1.8-1-2.5-.3-.6-.5-.5-.8-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.2-.6-.4z" fill="#25D366"/>
    </svg>`,
  };

  const history = [];

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  const particles = el("div", { class: "cb-particles" }, [
    el("div", { class: "cb-particle p1" }),
    el("div", { class: "cb-particle p2" }),
    el("div", { class: "cb-particle p3" }),
    el("div", { class: "cb-particle p4" }),
  ]);
  const gloss = el("div", { class: "cb-gloss" });
  const headSvgWrap = el("div", { html: BOT_SVG });
  const head = el("div", { class: "cb-head" }, [gloss, headSvgWrap.firstElementChild]);
  const headWrapper = el("div", { class: "cb-head-wrapper" }, [head]);
  const scene = el("div", { class: "cb-scene" }, [particles, headWrapper]);

  const tooltipDots = el("div", { class: "cb-typing-dots" }, [el("span"), el("span"), el("span")]);
  const tooltipText = el("span", { class: "cb-tooltip-text", html: "Need my help?" });
  const tooltip = el("div", { id: "cb-tooltip" }, [tooltipDots, tooltipText]);

  const launcher = el("button", { id: "cb-launcher", "aria-label": "Open chat" }, [scene]);
  const launcherWrap = el("div", { id: "cb-launcher-wrap" }, [tooltip, launcher]);
  document.body.appendChild(launcherWrap);

  function tooltipCycle() {
    if (win.classList.contains("cb-open")) {
      tooltip.style.opacity = "0";
      return;
    }
    tooltip.style.opacity = "1";
    tooltipDots.style.display = "flex";
    tooltipText.style.display = "none";
    setTimeout(() => {
      tooltipDots.style.display = "none";
      tooltipText.style.display = "inline";
    }, 700);
    setTimeout(() => {
      tooltip.style.opacity = "0";
    }, 1700);
  }
  tooltipCycle();
  setInterval(tooltipCycle, 2000);

  const headerAvatar = el("div", { id: "cb-header-avatar", html: BOT_SVG_SMALL });
  const headerText = el("div", { id: "cb-header-text" }, [
    el("div", { id: "cb-header-title", html: "Arsalan AI" }),
    el("div", { id: "cb-header-status" }, [
      el("span", { class: "cb-dot" }),
      el("span", { html: "Online now" }),
    ]),
  ]);
  const closeBtn = el("button", { id: "cb-close", "aria-label": "Close chat", html: ICONS.close });
  const header = el("div", { id: "cb-header" }, [headerAvatar, headerText, closeBtn]);

  const messagesEl = el("div", { id: "cb-messages" });
  const input = el("input", { id: "cb-input", type: "text", placeholder: "Ask me anything..." });
  const sendBtn = el("button", { id: "cb-send", "aria-label": "Send", html: ICONS.send });
  const inputRow = el("div", { id: "cb-input-row" }, [input, sendBtn]);

  const win = el("div", { id: "cb-window" }, [header, messagesEl, inputRow]);
  document.body.appendChild(win);

  function toggleWindow() {
    const opening = !win.classList.contains("cb-open");
    win.classList.toggle("cb-open");
    if (opening && messagesEl.children.length === 0) {
      addBotMessage(
        "Hi! I can answer questions about Arsalan's AI services, tools, and portfolio projects. What would you like to know?"
      );
    }
    if (opening) setTimeout(() => input.focus(), 320);
  }
  launcher.addEventListener("click", toggleWindow);
  closeBtn.addEventListener("click", toggleWindow);

  function addRow(bubbleNode, sender) {
    const row = el("div", { class: `cb-row cb-${sender}` });
    if (sender === "bot") {
      row.appendChild(el("div", { class: "cb-avatar-sm", html: BOT_SVG_SMALL }));
    }
    row.appendChild(bubbleNode);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return row;
  }

  function addMessage(text, sender) {
    const bubble = el("div", { class: `cb-msg cb-${sender}` });
    bubble.textContent = text;
    addRow(bubble, sender);
    return bubble;
  }

  function addBotMessage(text) {
    return addMessage(text, "bot");
  }

  function addTypingIndicator() {
    const bubble = el("div", { class: "cb-msg cb-bot" });
    bubble.appendChild(
      el("div", { class: "cb-typing-dots" }, [el("span"), el("span"), el("span")])
    );
    return addRow(bubble, "bot");
  }

  function addWhatsappButton(link) {
    const a = el("a", {
      class: "cb-whatsapp-btn",
      href: link,
      target: "_blank",
      rel: "noopener noreferrer",
      html: `${ICONS.whatsapp}<span>Chat on WhatsApp</span>`,
    });
    messagesEl.appendChild(a);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    addMessage(text, "user");
    history.push({ role: "user", content: text });

    const typingRow = addTypingIndicator();

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(-6) }),
      });
      const data = await res.json();
      typingRow.remove();

      addBotMessage(data.reply || "Sorry, something went wrong.");
      history.push({ role: "assistant", content: data.reply || "" });

      if (data.whatsapp && data.whatsappLink) {
        addWhatsappButton(data.whatsappLink);
      }
    } catch (err) {
      typingRow.remove();
      addBotMessage("Sorry, I couldn't reach the server. Please try again in a moment.");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
