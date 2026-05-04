// ── PAGE NAVIGATION ──
function go(page) {
  if (page === 'home' && window.opener && !window.opener.closed) {
    window.opener.focus();
    window.close();
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('p-' + page).classList.add('active');
  document.getElementById('n-' + page).classList.add('active');
  const isHome = page === 'home';
  document.querySelector('nav').classList.toggle('nav-hidden', isHome);
  document.querySelector('.wrap').classList.toggle('home-active', isHome);
  document.body.classList.toggle('home-active', isHome);
  history.replaceState(null, '', isHome ? location.pathname : '#' + page);
  if (isHome) alignButtons();
}

function goNewTab(page) {
  window.open(location.href.split('#')[0] + '#' + page, '_blank');
}

// ── INITIAL STATE: start on home ──
document.querySelector('nav').classList.add('nav-hidden');
document.querySelector('.wrap').classList.add('home-active');
document.body.classList.add('home-active');

// ── HERO BUTTON ALIGNMENT ──
function alignButtons() {
  const name = document.querySelector('.hero-name');
  const cta = document.querySelector('.hero-cta');
  if (name && cta) {
    cta.style.width = 'auto';
    const nameW = name.offsetWidth;
    cta.style.width = nameW + 'px';
  }
}

// ── VIDEO SCALING ──
function adjustVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;
  const naturalW = video.videoWidth || 1920;
  const naturalH = video.videoHeight || 1080;
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const scaleW = winW / naturalW;
  const scaleH = winH / naturalH;
  const scale = Math.max(scaleW, scaleH);
  video.style.objectFit = 'cover';
  video.style.width = '100%';
  video.style.height = '100%';
}

// ── HERO NAME LETTER ANIMATION ──
function initHeroLetters() {
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const words = ['MONA', 'FARROKHI'];
  el.innerHTML = '';
  words.forEach((word, wi) => {
    word.split('').forEach((ch, ci) => {
      const s = document.createElement('span');
      s.className = 'hero-char';
      s.textContent = ch;
      s.dataset.wi = String(wi);
      s.dataset.ci = String(ci);
      el.appendChild(s);
    });
    if (wi < words.length - 1) el.appendChild(document.createElement('br'));
  });
  el.addEventListener('mouseover', e => {
    const t = e.target.closest('.hero-char');
    if (!t) return;
    const wi = t.dataset.wi;
    const ci = parseInt(t.dataset.ci);
    const line = [...el.querySelectorAll('.hero-char')].filter(s => s.dataset.wi === wi);
    line.forEach(s => { s.style.transform = ''; s.classList.remove('hero-char-trail'); });
    t.style.transform = 'translateX(7px) scale(1.25)';
    void t.offsetWidth;
    t.classList.add('hero-char-trail');
    if (line[ci + 1]) line[ci + 1].style.transform = 'translateX(8px) scale(1.08)';
  });
  el.addEventListener('mouseleave', () => {
    el.querySelectorAll('.hero-char').forEach(s => s.style.transform = '');
  });
}

// ── ON LOAD ──
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (['artist', 'direction', 'educator'].includes(hash)) go(hash);
  initHeroLetters();
  alignButtons();
  adjustVideo();
});

window.addEventListener('resize', () => {
  alignButtons();
  adjustVideo();
});

document.getElementById('hero-video').addEventListener('loadedmetadata', adjustVideo);

// ── CONTACT MODAL ──
function openContact() {
  document.getElementById('contact-modal').classList.add('open');
}

function closeContact() {
  document.getElementById('contact-modal').classList.remove('open');
}

function closeContactIfBg(e) {
  if (e.target === document.getElementById('contact-modal')) closeContact();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeContact();
});

// ── CONTEXT MENU PROTECTION ──
document.addEventListener('contextmenu', e => {
  if (e.target.closest('img,video,.hero-img,.hero-splash,.gal-item,.gallery-strip')) e.preventDefault();
});
