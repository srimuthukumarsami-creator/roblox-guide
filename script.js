// === PARTICLES ===
function createParticles() {
  const c = document.querySelector('.particles');
  const colors = ['#ff6b9d','#c44dff','#4d9fff','#4dffc3','#ffe14d'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*10+8}s;
      animation-delay:${Math.random()*10}s;
    `;
    c.appendChild(p);
  }
}

// === PROGRESS BAR ===
function updateProgress() {
  const bar = document.querySelector('.progress-bar');
  const h = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (window.scrollY / h * 100) + '%';
}

// === SCROLL ANIMATIONS ===
function revealOnScroll() {
  document.querySelectorAll('.step-card,.timeline-item').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.85) el.classList.add('visible');
  });
}

// === ACTIVE NAV ===
function updateNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// === SCROLL TOP BUTTON ===
function toggleScrollTop() {
  const btn = document.querySelector('.scroll-top');
  btn.classList.toggle('show', window.scrollY > 500);
}

// === CHECKLIST ===
function initChecklist() {
  document.querySelectorAll('.checklist li').forEach(li => {
    li.addEventListener('click', () => {
      li.classList.toggle('checked');
      const icon = li.querySelector('.check-icon');
      icon.textContent = li.classList.contains('checked') ? '✓' : '';
    });
  });
}

// === ACCORDION ===
function initAccordion() {
  document.querySelectorAll('.acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const wasOpen = item.classList.contains('open');
      // close all in same group
      item.parentElement.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initChecklist();
  initAccordion();
  initSmoothScroll();

  window.addEventListener('scroll', () => {
    updateProgress();
    revealOnScroll();
    updateNav();
    toggleScrollTop();
  });

  // initial trigger
  revealOnScroll();

  // scroll top button
  document.querySelector('.scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === AI CHATBOT ===
  initChatbot();
});

// === CHATBOT ===
function initChatbot() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const close = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  const msgs = document.getElementById('chat-messages');

  if (!fab) return;

  let history = [];
  const SYS = `You are a super friendly, cute, and helpful AI assistant on a Roblox game creation guide website made for a girl named Lia who has zero coding experience (she's a BCom/CA accountant). Your job is to help her understand how to create and publish a Roblox game. Be very warm, use emojis, explain things like you're talking to a complete beginner. Keep answers concise but clear. If she asks about code, give her copy-paste ready Lua scripts with explanations. Always be encouraging and supportive! You know everything about Roblox Studio, Lua scripting, publishing games, and using AI tools to help with game development. Never be condescending. If she asks something unrelated to Roblox, gently guide her back but still be helpful.`;

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && msgs.children.length === 0) {
      addMsg('bot', "Hii Lia! 👋💖 I'm your Roblox helper! Ask me anything about making your game — no question is too silly, I promise! 😊");
    }
  });

  close.addEventListener('click', () => panel.classList.remove('open'));

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);

    history.push({ role: 'user', content: text });

    // typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.innerHTML = '<div class="chat-bubble typing">✨ thinking...</div>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    try {
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYS },
            ...history.slice(-10)
          ],
          model: 'openai',
          temperature: 0.7
        })
      });
      const answer = await res.text();
      typing.remove();
      history.push({ role: 'assistant', content: answer });
      addMsg('bot', answer.replace(/\n/g, '<br>'));
    } catch (e) {
      typing.remove();
      addMsg('bot', "Oops! I couldn't connect right now 😅 Try again in a moment, or reach out to Pablo for help! 📱");
    }
  }
}
