(function () {
  // ==== CONFIGURE THIS ====
  const WORKER_URL = "https://portfolio-chatbot.arslankhan807567.workers.dev/chat";
  // =========================

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

  const launcher = el("button", { id: "cb-launcher", "aria-label": "Open chat" }, []);
  launcher.textContent = "💬";
  document.body.appendChild(launcher);

  const messagesEl = el("div", { id: "cb-messages" });
  const input = el("input", { id: "cb-input", type: "text", placeholder: "Ask me anything..." });
  const sendBtn = el("button", { id: "cb-send", "aria-label": "Send" });
  sendBtn.textContent = "➤";

  const header = el("div", { id: "cb-header" }, [
    el("span", { html: "Ask Arsalan — AI Assistant" }),
  ]);
  const closeBtn = el("button", {}, []);
  closeBtn.textContent = "✕";
  header.appendChild(closeBtn);

  const inputRow = el("div", { id: "cb-input-row" }, [input, sendBtn]);
  const win = el("div", { id: "cb-window" }, [header, messagesEl, inputRow]);
  document.body.appendChild(win);

  function toggleWindow() {
    win.classList.toggle("cb-open");
    if (win.classList.contains("cb-open") && messagesEl.children.length === 0) {
      addBotMessage("Hi! I can answer questions about Arsalan's AI services, tools, and portfolio projects. What would you like to know?");
    }
  }
  launcher.addEventListener("click", toggleWindow);
  closeBtn.addEventListener("click", toggleWindow);

  function addMessage(text, sender) {
    const msg = el("div", { class: `cb-msg cb-${sender}` });
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function addBotMessage(text) {
    return addMessage(text, "bot");
  }

  function addWhatsappButton(link) {
    const a = el("a", {
      class: "cb-whatsapp-btn",
      href: link,
      target: "_blank",
      rel: "noopener noreferrer",
    });
    a.textContent = "🟢 Chat on WhatsApp";
    messagesEl.appendChild(a);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    addMessage(text, "user");
    history.push({ role: "user", content: text });

    const typing = addMessage("Typing...", "bot");
    typing.classList.add("cb-typing");

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(-6) }),
      });
      const data = await res.json();
      typing.remove();

      addBotMessage(data.reply || "Sorry, something went wrong.");
      history.push({ role: "assistant", content: data.reply || "" });

      if (data.whatsapp && data.whatsappLink) {
        addWhatsappButton(data.whatsappLink);
      }
    } catch (err) {
      typing.remove();
      addBotMessage("Sorry, I couldn't reach the server. Please try again in a moment.");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();