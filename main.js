// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress bar
const progress = document.getElementById('progress');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll. Content stays visible if JS fails; the animation is a bonus.
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach((el) => io.observe(el));

// Cursor-follow glow on cards
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const closeMenu = () => {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
};
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    closeMenu();
    navToggle.focus();
  }
});
document.addEventListener('pointerdown', (e) => {
  if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    closeMenu();
  }
});

// Live status chip: real numbers from the office feed, graceful fallback
const statusEl = document.getElementById('status');
const statusText = document.getElementById('status-text');
const STATUS_URL = 'https://noypinews.blog/office-status.json';
const refreshStatus = async () => {
  try {
    const r = await fetch(STATUS_URL, { cache: 'no-store' });
    if (!r.ok) return;
    const s = await r.json();
    if (!s || !s.gateway || !s.bots) return;
    const running = s.gateway.state === 'running';
    statusEl.classList.toggle('idle', !running);
    statusText.textContent =
      (running ? 'My systems are running right now' : 'Systems idle right now') +
      ` · ${s.bots.online} of ${s.bots.total} bots online`;
  } catch {
    // Feed unreachable. Keep the default text rather than break the page.
  }
};
refreshStatus();
setInterval(refreshStatus, 60000);
