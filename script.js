// ===== ԿԱՐԵՎՈՐ =====
const PHONE = '37400000000';
const W = 791, H = 1024;
const stage = document.getElementById('stage');
const key = document.getElementById('key');
let s = 1;

function fit() {
  const vw = innerWidth, vh = innerHeight;
  s = Math.min(vw / 450, (vh - 60) / 810);
  if (stage) {
    stage.style.width = W * s + 'px';
    stage.style.height = H * s + 'px';
    stage.style.left = (vw / 2 - 395 * s) + 'px';
    stage.style.top = ((vh - 50) / 2 - 445 * s) + 'px';
  }
}
fit();
addEventListener('resize', fit);

let started = false;
function start() {
  if (started) return;
  started = true;

  // Միացնում ենք երաժշտությունը բանալին սեղմելիս
  playMusic();

  const hint = document.getElementById('hint');
  if (hint) hint.style.opacity = 0;
  if (key) key.classList.add('go');

  const dx = (395 - 585) * s, dy = (398 - 738) * s;
  if (key) key.style.transform = `translate(${dx}px,${dy}px) rotate(-90deg)`;

  setTimeout(() => {
    // if (key) key.classList.add('shake');
    const glow = document.getElementById('glow');
    if (glow) glow.style.opacity = 1;
  }, 2500);

  setTimeout(() => {
    const intro = document.getElementById('intro');
    if (intro) intro.classList.add('done');
    document.body.classList.add('open');
    scrollTo(0, 0);
    setTimeout(reveal, 400);
    setTimeout(() => {
      if (intro) intro.style.display = 'none';
    }, 2600);
  }, 3900);
}

if (key) key.addEventListener('click', start);
const hintEl = document.getElementById('hint');
if (hintEl) {
  hintEl.addEventListener('click', start);
  hintEl.style.cursor = 'pointer';
}

const $ = id => document.getElementById(id);

function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }), { threshold: .15 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  sparkle();
}

// Countdown
const target = new Date('2026-11-01T13:30:00+04:00');
const cd = $('cd');
function tick() {
  let d = Math.max(0, target - Date.now());
  const v = [[864e5, 'օր'], [36e5, 'ժամ'], [6e4, 'րոպե'], [1e3, 'վրկ']];
  if (cd) {
    cd.innerHTML = v.map(([m, l]) => {
      const n = Math.floor(d / m);
      d -= n * m;
      return `<div><b>${String(n).padStart(2, '0')}</b><small>${l}</small></div>`;
    }).join('');
  }
}
tick();
setInterval(tick, 1000);

// Sparkles
function sparkle() {
  const c = $('sp');
  if (!c) return;
  const x = c.getContext('2d');
  let w, h, ps = [];
  function rs() { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; }
  rs();
  addEventListener('resize', rs);
  for (let i = 0; i < 40; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + .6, v: Math.random() * .4 + .15, p: Math.random() * 6 });
  (function f(t) {
    x.clearRect(0, 0, w, h);
    ps.forEach(p => {
      p.y -= p.v;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      x.globalAlpha = .25 + .5 * Math.abs(Math.sin(t / 900 + p.p));
      x.fillStyle = '#d9b060';
      x.beginPath();
      x.arc(p.x + Math.sin(t / 1500 + p.p) * 12, p.y, p.r, 0, 7);
      x.fill();
    });
    requestAnimationFrame(f);
  })(0);
}

// RSVP counter
let n = 1;
const gw = $('gw');
if ($('pl')) $('pl').onclick = () => { n = Math.min(10, n + 1);$('ct').textContent = n; };
if ($('mi')) $('mi').onclick = () => { n = Math.max(1, n - 1);$('ct').textContent = n; };
document.querySelectorAll('[name=a]').forEach(r => r.onchange = () => {
  if (gw) gw.style.display = r.value === 'yes' ? 'block' : 'none';
});

// Google Sheets-ի հղումը
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzZE62XoWx4oUsmiJxNJnzxJUAq1zYK1CMaIh2yAjJW-7qSm4eckIjzox4taO28saTF/exec';

if ($('f')) {$('f').onsubmit = e => {
    e.preventDefault();
    const nm = $('nm').value.trim();
    if (!nm) {
      if ($('er'))$('er').textContent = 'Խնդրում ենք գրել ձեր անունը։';
      $('nm').focus();
      return;
    }
    if ($('er'))$('er').textContent = '';

    // Անվտանգ ստուգումներ ընտրությունների համար
    const attendEl = document.querySelector('[name=a]:checked');
    const yes = attendEl ? (attendEl.value === 'yes') : true;

    const sideEl = document.querySelector('[name=side]:checked');
    let sideText = 'Փեսայի կողմից';
    if (sideEl) {
      if (sideEl.value === 'bride' || sideEl.value.includes('հարս') || sideEl.value.includes('Հարս')) {
        sideText = 'Հարսի կողմից';
      } else if (sideEl.value === 'groom' || sideEl.value.includes('փեսա') || sideEl.value.includes('Փեսա')) {
        sideText = 'Փեսայի կողմից';
      } else {
        sideText = sideEl.value;
      }
    }

    const form = $('f');

    // 1. Միանգամից ցույց ենք տալիս շնորհակալական տեքստը
    form.classList.add('sent');
    if ($('ok'))$('ok').classList.add('on');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 2. Տվյալները Google Sheet ենք ուղարկում URLSearchParams + application/x-www-form-urlencoded
    if (SHEET_URL) {
      const params = new URLSearchParams();
      params.append('name', nm);
      params.append('side', sideText);
      params.append('attend', yes ? 'Այո' : 'Ոչ');
      params.append('guests', yes ? n : 0);
      params.append('message', '');

      fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      }).catch(err => console.error('Error sending to sheet:', err));
    }
  };
}

// ===== ԵՐԱԺՇՏՈՒԹՅԱՆ ԿԱՌԱՎԱՐՈՒՄ =====
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

function playMusic() {
  if (bgMusic) {
    bgMusic.play().then(() => {
      if (musicToggle) musicToggle.classList.add('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
    }).catch(err => console.log('Autoplay blocked:', err));
  }
}

if (musicToggle) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });
}