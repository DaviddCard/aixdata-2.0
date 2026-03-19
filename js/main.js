// AIXDATA 2026 — main.js
// Loader, animated background, flip clock, theme toggle,
// FAQ accordion, scroll reveal, stats counter, scroll-to-top

const EVENT_DATE = new Date('April 18, 2026 09:00:00').getTime();


// ── Loader ────────────────────────────────────────────────────────
const loader      = document.getElementById('loader');
const loaderBar   = document.getElementById('loader-bar');
const loaderCv    = document.getElementById('loader-canvas');

function runLoaderBokeh() {
  const ctx = loaderCv.getContext('2d');
  loaderCv.width  = window.innerWidth;
  loaderCv.height = window.innerHeight;

  const orbs = Array.from({ length: 16 }, () => ({
    x: Math.random() * loaderCv.width,
    y: Math.random() * loaderCv.height,
    r: 50 + Math.random() * 130,
    dx: (Math.random() - 0.5) * 0.38,
    dy: (Math.random() - 0.5) * 0.38,
    color: Math.random() > 0.5 ? '67,190,40' : '255,181,32',
    alpha: 0.03 + Math.random() * 0.065
  }));

  let raf;
  function draw() {
    ctx.clearRect(0, 0, loaderCv.width, loaderCv.height);
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.color},${o.alpha})`);
      g.addColorStop(1, `rgba(${o.color},0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      o.x += o.dx; o.y += o.dy;
      if (o.x < -o.r) o.x = loaderCv.width + o.r;
      if (o.x > loaderCv.width + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = loaderCv.height + o.r;
      if (o.y > loaderCv.height + o.r) o.y = -o.r;
    });
    raf = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(raf);
}

let stopLoaderBokeh = runLoaderBokeh();

let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 20;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    loaderBar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('done');
      stopLoaderBokeh();
      initBgCanvas();
      startClock();
      initScrollReveal();
    }, 500);
  }
  loaderBar.style.width = progress + '%';
}, 110);


// ── Background canvas ─────────────────────────────────────────────
// Deep-ocean bokeh + neural-network node layer + electric spark particles
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Bokeh orbs — large glowing blobs that drift slowly
  const orbs = Array.from({ length: 28 }, () => {
    const seed = Math.random();
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 100 + Math.random() * 240,
      dx: (Math.random() - 0.5) * 0.16,
      dy: (Math.random() - 0.5) * 0.16,
      color: pickOrbColor(),
      alpha: 0.028 + Math.random() * 0.058,
      _seed: seed
    };
  });

  function pickOrbColor() {
    const r = Math.random();
    if (r < 0.38) return '67,190,40';   // green
    if (r < 0.60) return '255,181,32';  // gold
    if (r < 0.80) return '23,60,99';    // navy
    return '0,229,255';                  // electric cyan
  }

  function pickLightOrbColor(seed) {
    if (seed < 0.35) return '148,80,220';  // violet
    if (seed < 0.60) return '180,100,240'; // soft purple
    if (seed < 0.78) return '100,60,180';  // deep indigo
    return '67,190,40';                    // green accent
  }

  // Neural-network nodes
  const nodes = Array.from({ length: 62 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1.4 + Math.random() * 2.2,
    dx: (Math.random() - 0.5) * 0.28,
    dy: (Math.random() - 0.5) * 0.28,
    alpha: 0.2 + Math.random() * 0.38,
    color: (() => {
      const c = Math.random();
      if (c < 0.5)  return '67,190,40';
      if (c < 0.78) return '255,181,32';
      return '0,229,255';
    })()
  }));

  // Electric spark particles — blink like discharge points
  const sparks = Array.from({ length: 20 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.9 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.06 + Math.random() * 0.1,
    dx: (Math.random() - 0.5) * 0.45,
    dy: (Math.random() - 0.5) * 0.45
  }));

  const LINK_DIST = 145;

  function drawBg() {
    const isLight = document.documentElement.dataset.theme === 'light';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isLight) {
      const lg = ctx.createLinearGradient(0, 0, canvas.width * 0.5, canvas.height);
      lg.addColorStop(0, '#f1f0f5');
      lg.addColorStop(1, '#e8e6ef');
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Deep-ocean radial gradient — slightly lighter in the center
      const dg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.42, 0,
        canvas.width * 0.5, canvas.height * 0.5,  canvas.width * 0.82
      );
      dg.addColorStop(0,   '#0d1814');
      dg.addColorStop(0.38,'#080e0b');
      dg.addColorStop(1,   '#030808');
      ctx.fillStyle = dg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Bokeh layer
    orbs.forEach(o => {
      const a = isLight ? o.alpha * 0.5 : o.alpha;
      const col = o.color;
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      o.x += o.dx; o.y += o.dy;
      if (o.x < -o.r) o.x = canvas.width + o.r;
      if (o.x > canvas.width + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;
    });

    // Neural-network connection lines
    const lineAlpha = isLight ? 0.05 : 0.11;
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ddx  = nodes[i].x - nodes[j].x;
        const ddy  = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          // alternate green and cyan connections
          const lc = (i + j) % 3 === 0 ? '0,229,255' : '67,190,40';
          ctx.strokeStyle = `rgba(${lc},${lineAlpha * (1 - dist / LINK_DIST)})`;
          ctx.stroke();
        }
      }
    }

    // Neural-network node dots
    nodes.forEach(n => {
      const a = isLight ? n.alpha * 0.42 : n.alpha;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color},${a})`;
      ctx.fill();
      n.x += n.dx; n.y += n.dy;
      if (n.x < 0) n.x = canvas.width;
      if (n.x > canvas.width) n.x = 0;
      if (n.y < 0) n.y = canvas.height;
      if (n.y > canvas.height) n.y = 0;
    });

    // Electric spark particles — only in dark mode
    if (!isLight) {
      sparks.forEach(s => {
        s.phase += s.speed;
        const brightness = Math.max(0, Math.sin(s.phase)) * 0.85 + 0.12;
        // inner dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${brightness * 0.8})`;
        ctx.fill();
        // outer soft glow
        const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        sg.addColorStop(0, `rgba(0,229,255,${brightness * 0.18})`);
        sg.addColorStop(1, 'rgba(0,229,255,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
        s.x += s.dx; s.y += s.dy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
      });
    }

    requestAnimationFrame(drawBg);
  }
  drawBg();
}


// ── Flip clock ────────────────────────────────────────────────────
const pad = n => String(Math.floor(n)).padStart(2, '0');
let prev  = { d: -1, h: -1, m: -1, s: -1 };

function flipUnit(id, val) {
  const card = document.getElementById(`fc-${id}`);
  const num  = document.getElementById(`${id}-top`);
  if (!card || !num) return;
  if (num.textContent === val) return;
  num.textContent = val;
  card.classList.remove('flip-anim');
  void card.offsetWidth;
  card.classList.add('flip-anim');
}

function startClock() {
  function tick() {
    const diff = EVENT_DATE - Date.now();
    if (diff <= 0) {
      ['days','hours','mins','secs'].forEach(id => flipUnit(id, '00'));
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (d !== prev.d) { flipUnit('days',  pad(d)); prev.d = d; }
    if (h !== prev.h) { flipUnit('hours', pad(h)); prev.h = h; }
    if (m !== prev.m) { flipUnit('mins',  pad(m)); prev.m = m; }
    if (s !== prev.s) { flipUnit('secs',  pad(s)); prev.s = s; }

    setTimeout(tick, 1000);
  }
  tick();
}


// ── Theme toggle ──────────────────────────────────────────────────
const html         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');
const THEME_KEY    = 'aixdata-theme';

// restore saved preference
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) html.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
});


// ── Navbar scroll state ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── Hamburger menu ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)'  : '';
  bars[1].style.opacity   = open ? '0' : '';
  bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});


// ── FAQ accordion ─────────────────────────────────────────────────
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});


// ── Scroll reveal ─────────────────────────────────────────────────
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '#about .section-heading, #about .about-card, #about .about-highlights,' +
    '#about .live-banner, #about .signup-form,' +
    '#schedule .section-heading, .timeline-item,' +
    '#tracks .section-heading, .track-wrap,' +
    '#faq .section-heading, .faq-item,' +
    '#speakers .section-heading, .speaker-card,' +
    '#sponsors .section-heading, .sponsor-slot,' +
    '#team .section-heading, .team-member'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), (i % 5) * 55);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => io.observe(el));
}


// ── Stats counter ─────────────────────────────────────────────────
function initStats() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);

      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1100;
      const t0     = performance.now();

      function step(now) {
        const p      = Math.min((now - t0) / dur, 1);
        const eased  = 1 - (1 - p) * (1 - p);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  nums.forEach(el => io.observe(el));
}
initStats();


// ── Mascot tilt on mouse move ─────────────────────────────────────
const mascot = document.getElementById('mascot');
if (mascot) {
  document.addEventListener('mousemove', e => {
    const rect = mascot.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / window.innerWidth;
    const dy   = (e.clientY - cy) / window.innerHeight;
    mascot.style.transform =
      `rotateY(${dx * 14}deg) rotateX(${-dy * 9}deg)`;
  }, { passive: true });
}


// ── Scroll to top ─────────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ── Mascot image fallback ─────────────────────────────────────────
// If assets/stingray.png doesn't exist yet, reveal the SVG fallback
const mascotImg = document.querySelector('.mascot-img');
if (mascotImg) {
  mascotImg.addEventListener('error', () => {
    mascotImg.classList.add('hidden');
  });
}


// ── Registration form (stub) ──────────────────────────────────────
const form = document.getElementById('signup-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Submitted ✓';
    btn.style.background = 'linear-gradient(180deg, #3da820 0%, #1d6010 100%)';
    btn.disabled = true;
    // TODO: wire to backend / Google Forms endpoint
  });
}
