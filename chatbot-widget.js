(function () {
  // ==== CONFIGURE THIS ====
  const WORKER_URL = "https://portfolio-chatbot.arslankhan807567.workers.dev/chat";
  // =========================

  const ICONS = {
    bot: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cb-bot-face">
      <rect x="4" y="7" width="16" height="13" rx="5" fill="currentColor" opacity="0.001"/>
      <path d="M12 2v3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="12" cy="2" r="1.3" fill="#fff"/>
      <rect x="3.5" y="6.5" width="17" height="14" rx="6" stroke="#fff" stroke-width="1.6"/>
      <rect x="7.5" y="11.5" width="3" height="4" rx="1.5" class="cb-bot-eye"/>
      <rect x="13.5" y="11.5" width="3" height="4" rx="1.5" class="cb-bot-eye"/>
      <path d="M9 17.5c1 .8 5 .8 6 0" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    botSmall: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="6.5" width="17" height="14" rx="6" stroke="#fff" stroke-width="1.8"/>
      <circle cx="9" cy="13.5" r="1.6" fill="#fff"/>
      <circle cx="15" cy="13.5" r="1.6" fill="#fff"/>
      <path d="M9.5 17.3c1 .7 4 .7 5 0" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M12 2.2v3.3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="12" cy="2.2" r="1.1" fill="#fff"/>
    </svg>`,
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

  const launcher = el("button", {
    id: "cb-launcher",
    "aria-label": "Open chat",
    html: ICONS.bot,
  });
  document.body.appendChild(launcher);

  const headerAvatar = el("div", { id: "cb-header-avatar", html: ICONS.botSmall });
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
      row.appendChild(el("div", { class: "cb-avatar-sm", html: ICONS.botSmall }));
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
    const row = addRow(bubble, "bot");
    return row;
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
