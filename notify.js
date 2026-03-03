const notifyForm = document.getElementById("notifyForm");
const messageInput = document.getElementById("messageInput");
const notifyResult = document.getElementById("notifyResult");
const sendBtn = document.getElementById("sendBtn");
const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const NTFY_TOPIC = "comparateur-petit-coeur";
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;
const HISTORY_STORAGE_KEY = "notify_history_v1";
const MAX_HISTORY_ITEMS = 30;

function setResult(message, state = "info") {
  notifyResult.textContent = message;
  notifyResult.classList.remove("status-success", "status-error");
  if (state === "success") notifyResult.classList.add("status-success");
  if (state === "error") notifyResult.classList.add("status-error");
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function formatTimestamp(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR");
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = "";

  history.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const textWrap = document.createElement("div");
    textWrap.className = "history-item-main";

    const text = document.createElement("p");
    text.className = "history-text";
    text.textContent = entry.message;

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = formatTimestamp(entry.createdAt);

    textWrap.appendChild(text);
    textWrap.appendChild(date);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "history-remove-btn";
    removeBtn.textContent = "Supprimer";
    removeBtn.dataset.id = entry.id;

    li.appendChild(textWrap);
    li.appendChild(removeBtn);
    historyList.appendChild(li);
  });

  const hasItems = history.length > 0;
  historyEmpty.hidden = hasItems;
  clearHistoryBtn.disabled = !hasItems;
}

function addHistoryEntry(message) {
  const history = loadHistory();
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      createdAt: new Date().toISOString()
    },
    ...history
  ].slice(0, MAX_HISTORY_ITEMS);

  saveHistory(next);
  renderHistory();
}

function removeHistoryEntry(id) {
  const history = loadHistory();
  const next = history.filter((entry) => entry.id !== id);
  saveHistory(next);
  renderHistory();
}

function clearHistory() {
  saveHistory([]);
  renderHistory();
}

async function sendNotification(message) {
  const response = await fetch(NTFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      Title: "Nouveau message",
      Priority: "default"
    },
    body: message
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }
}

notifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();

  if (!message) {
    setResult("Ecris un message avant d'envoyer.", "error");
    return;
  }

  sendBtn.disabled = true;
  setResult("Envoi en cours...");

  try {
    await sendNotification(message);
    addHistoryEntry(message);
    setResult("Message envoye !", "success");
    notifyForm.reset();
  } catch (error) {
    setResult("Envoi impossible. Envoie un message a ton cheri pour lui dire qu'il y a un soucis !", "error");
    console.error(error);
  } finally {
    sendBtn.disabled = false;
  }
});

historyList.addEventListener("click", (event) => {
  const btn = event.target.closest(".history-remove-btn");
  if (btn) {
    const { id } = btn.dataset;
    if (!id) return;
    removeHistoryEntry(id);
    return;
  }

  const item = event.target.closest(".history-item");
  if (!item) return;

  const textEl = item.querySelector(".history-text");
  const text = textEl?.textContent?.trim();
  if (!text) return;

  messageInput.value = text;
  messageInput.focus();
  messageInput.setSelectionRange(messageInput.value.length, messageInput.value.length);
  setResult("Message recopie depuis l'historique.");
});

clearHistoryBtn.addEventListener("click", () => {
  clearHistory();
  setResult("Historique supprime.", "success");
});

renderHistory();
