/* ==========================================================================
   UrbanNest Front Dashboard AI Chatbot - N8N Integration Handler
   ========================================================================== */

let conversationId = 'conv-' + Date.now();
let soundEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

function initChatbot() {
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  const modalChatInput = document.getElementById('modalChatInput');
  const modalChatSendBtn = document.getElementById('modalChatSendBtn');

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage(chatInput.value, 'dashboard');
    });
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      sendChatMessage(chatInput ? chatInput.value : '', 'dashboard');
    });
  }

  if (modalChatInput) {
    modalChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage(modalChatInput.value, 'modal');
    });
  }

  if (modalChatSendBtn) {
    modalChatSendBtn.addEventListener('click', () => {
      sendChatMessage(modalChatInput ? modalChatInput.value : '', 'modal');
    });
  }
}

function toggleFloatingChat() {
  const modal = document.getElementById('floatingChatModal');
  if (modal) {
    modal.classList.toggle('open');
    if (modal.classList.contains('open')) {
      const input = document.getElementById('modalChatInput');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }
}

async function sendChatMessage(customText, sourceOrigin = 'dashboard') {
  const dashboardInput = document.getElementById('chatInput');
  const modalInput = document.getElementById('modalChatInput');
  const n8nUrlInput = document.getElementById('n8nWebhookUrlInput');

  let text = customText !== undefined ? customText.trim() : '';

  if (!text) {
    if (sourceOrigin === 'modal' && modalInput) text = modalInput.value.trim();
    else if (dashboardInput) text = dashboardInput.value.trim();
  }

  if (!text) return;

  if (dashboardInput) dashboardInput.value = '';
  if (modalInput) modalInput.value = '';

  const n8nWebhookUrl = n8nUrlInput ? n8nUrlInput.value.trim() : '';

  // Append User Message to both containers
  appendBubble('user', text);

  // Append Typing Indicators
  const typingBubbles = appendTypingIndicator();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        conversationId,
        n8nWebhookUrl: n8nWebhookUrl || undefined
      })
    });

    const data = await res.json();
    typingBubbles.forEach(b => b.remove());

    if (data.success) {
      appendBubble('bot', data.reply);
      if (soundEnabled) playNotificationSound();
    } else {
      appendBubble('bot', "⚠️ Sorry, I ran into a minor issue. Please try again or fill out our Query Form!");
    }
  } catch (err) {
    console.error('Chat error:', err);
    typingBubbles.forEach(b => b.remove());
    appendBubble('bot', "🤖 I'm currently working offline. You can reach out directly via our Customer Query form below!");
  }
}

async function checkN8nStatus() {
  const customUrlInput = document.getElementById('n8nWebhookUrlInput');
  const customUrl = customUrlInput ? customUrlInput.value.trim() : '';

  showToast('🔍 Inspecting N8N Connection Status...', 'info');

  try {
    const res = await fetch('/api/n8n-status');
    const data = await res.json();

    const isCustomActive = customUrl.startsWith('http');
    const chatbotStatus = isCustomActive ? '🟢 Live Webhook URL Active (Custom User Input)' : 
      (data.chatbotWebhook.status === 'LIVE_N8N_CONNECTED' ? '🟢 Connected to Live N8N Webhook' : '🟡 Smart Local AI Fallback Engine Active');

    const queryStatus = data.queryWebhook.status === 'LIVE_N8N_CONNECTED' ? '🟢 Connected to Live N8N Webhook' : '🟡 Local Reference Generator Active';

    const infoText = `⚡ N8N Connection Status Inspector:\n\n` +
      `• Chatbot Endpoint: ${chatbotStatus}\n` +
      `  URL: ${customUrl || data.chatbotWebhook.url}\n\n` +
      `• Query Form Endpoint: ${queryStatus}\n` +
      `  URL: ${data.queryWebhook.url}\n\n` +
      `💡 Note: If your N8N Webhook URL is set in .env or pasted in the URL box, all requests post directly to your live N8N workflow!`;

    alert(infoText);
  } catch (err) {
    alert(`⚠️ Connection Error: Unable to inspect N8N server status. Error: ${err.message}`);
  }
}

function sendPresetQuery(text) {
  sendChatMessage(text, 'dashboard');
}

function appendBubble(sender, text) {
  const containers = [
    document.getElementById('chatMessages'),
    document.getElementById('modalChatMessages')
  ].filter(Boolean);

  let createdBubbles = [];

  containers.forEach(container => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    // Simple Markdown Formatter
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    bubble.innerHTML = formattedText;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    createdBubbles.push(bubble);
  });

  return createdBubbles;
}

function appendTypingIndicator() {
  const containers = [
    document.getElementById('chatMessages'),
    document.getElementById('modalChatMessages')
  ].filter(Boolean);

  let createdBubbles = [];

  containers.forEach(container => {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.innerHTML = `
      <div style="display: flex; gap: 4px; align-items: center; padding: 4px 8px;">
        <span class="typing-dot" style="width:6px; height:6px; background:var(--accent-primary); border-radius:50%; animation: pulse 1s infinite;"></span>
        <span class="typing-dot" style="width:6px; height:6px; background:var(--accent-primary); border-radius:50%; animation: pulse 1s infinite 0.2s;"></span>
        <span class="typing-dot" style="width:6px; height:6px; background:var(--accent-primary); border-radius:50%; animation: pulse 1s infinite 0.4s;"></span>
      </div>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    createdBubbles.push(bubble);
  });

  return createdBubbles;
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // Audio Context not allowed or muted
  }
}

window.sendChatMessage = sendChatMessage;
window.sendPresetQuery = sendPresetQuery;
window.toggleFloatingChat = toggleFloatingChat;
window.checkN8nStatus = checkN8nStatus;
