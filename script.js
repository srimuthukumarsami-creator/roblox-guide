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
});
