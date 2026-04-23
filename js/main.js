// AIXDATA 2026 — main.js
// Loader, animated background, flip clock, theme toggle,
// FAQ accordion, scroll reveal, stats counter, scroll-to-top

const SHEET_ENDPOINT = 'YOUR_APPS_SCRIPT_URL_HERE';

const EVENT_DATE = new Date('May 22, 2026 08:00:00').getTime();


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
  const orbs = Array.from({ length: 32 }, () => {
    const seed = Math.random();
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 80 + Math.random() * 280,
      dx: (Math.random() - 0.5) * 0.14,
      dy: (Math.random() - 0.5) * 0.14,
      color: pickOrbColor(),
      alpha: 0.032 + Math.random() * 0.065,
      _seed: seed
    };
  });

  function pickOrbColor() {
    const r = Math.random();
    if (r < 0.35) return '67,190,40';
    if (r < 0.56) return '255,181,32';
    if (r < 0.76) return '0,180,220';
    return '80,40,180';
  }

  function pickLightOrbColor(seed) {
    if (seed < 0.28) return '120,50,220';   // deep violet
    if (seed < 0.50) return '190,50,170';   // fuchsia/rose
    if (seed < 0.68) return '50,110,235';   // sky blue
    if (seed < 0.84) return '80,180,200';   // teal
    return '150,60,230';                     // purple
  }

  // Neural-network nodes
  const nodes = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1.2 + Math.random() * 2.4,
    dx: (Math.random() - 0.5) * 0.26,
    dy: (Math.random() - 0.5) * 0.26,
    alpha: 0.22 + Math.random() * 0.42,
    color: (() => {
      const c = Math.random();
      if (c < 0.48) return '67,190,40';
      if (c < 0.74) return '255,181,32';
      return '0,229,255';
    })()
  }));

  // Electric spark particles — blink like discharge points
  const sparks = Array.from({ length: 24 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.8 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.05 + Math.random() * 0.09,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4
  }));

  // Data stream columns — matrix-style falling dot chains
  const streams = Array.from({ length: 22 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.35 + Math.random() * 0.65,
    len: 4 + Math.floor(Math.random() * 7),
    alpha: 0.05 + Math.random() * 0.09,
    gap: 13 + Math.random() * 9
  }));

  const LINK_DIST = 150;

  function drawBg() {
    const isLight = document.documentElement.dataset.theme === 'light';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isLight) {
      // Pure white base
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora bloom 1 — violet/purple, top-right
      const a1 = ctx.createRadialGradient(
        canvas.width * 0.82, canvas.height * 0.08, 0,
        canvas.width * 0.82, canvas.height * 0.08, canvas.width * 0.55
      );
      a1.addColorStop(0,   'rgba(130,60,220,0.18)');
      a1.addColorStop(0.5, 'rgba(130,60,220,0.07)');
      a1.addColorStop(1,   'rgba(130,60,220,0)');
      ctx.fillStyle = a1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora bloom 2 — rose/fuchsia, bottom-left
      const a2 = ctx.createRadialGradient(
        canvas.width * 0.1, canvas.height * 0.85, 0,
        canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.5
      );
      a2.addColorStop(0,   'rgba(200,60,180,0.13)');
      a2.addColorStop(0.5, 'rgba(200,60,180,0.05)');
      a2.addColorStop(1,   'rgba(200,60,180,0)');
      ctx.fillStyle = a2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora bloom 3 — sky-blue, top-left
      const a3 = ctx.createRadialGradient(
        canvas.width * 0.05, canvas.height * 0.15, 0,
        canvas.width * 0.05, canvas.height * 0.15, canvas.width * 0.42
      );
      a3.addColorStop(0,   'rgba(60,120,240,0.11)');
      a3.addColorStop(0.5, 'rgba(60,120,240,0.04)');
      a3.addColorStop(1,   'rgba(60,120,240,0)');
      ctx.fillStyle = a3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle dot grid
      ctx.fillStyle = 'rgba(108,60,210,0.065)';
      const lgsp = 36;
      for (let gx = lgsp; gx < canvas.width; gx += lgsp) {
        for (let gy = lgsp; gy < canvas.height; gy += lgsp) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Rich off-center dark gradient — teal core, deep navy-black edges
      const dg = ctx.createRadialGradient(
        canvas.width * 0.38, canvas.height * 0.38, 0,
        canvas.width * 0.52, canvas.height * 0.5,  canvas.width * 0.9
      );
      dg.addColorStop(0,    '#0f2018');
      dg.addColorStop(0.22, '#0a1410');
      dg.addColorStop(0.55, '#06090f');
      dg.addColorStop(1,    '#020407');
      ctx.fillStyle = dg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle secondary accent — faint indigo bloom top-right
      const ig = ctx.createRadialGradient(
        canvas.width * 0.85, canvas.height * 0.12, 0,
        canvas.width * 0.85, canvas.height * 0.12, canvas.width * 0.4
      );
      ig.addColorStop(0, 'rgba(40,20,90,0.18)');
      ig.addColorStop(1, 'rgba(40,20,90,0)');
      ctx.fillStyle = ig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint dot-grid (circuit texture)
      ctx.fillStyle = 'rgba(67,190,40,0.055)';
      const gsp = 38;
      for (let gx = gsp; gx < canvas.width; gx += gsp) {
        for (let gy = gsp; gy < canvas.height; gy += gsp) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Bokeh layer
    orbs.forEach(o => {
      const a   = isLight ? o.alpha * 1.6 : o.alpha;
      const col = isLight ? pickLightOrbColor(o._seed) : o.color;
      const g   = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
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
    const lineAlpha = isLight ? 0.16 : 0.13;
    ctx.lineWidth = 0.65;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ddx  = nodes[i].x - nodes[j].x;
        const ddy  = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < LINK_DIST) {
          const fade = lineAlpha * (1 - dist / LINK_DIST);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          const lc = isLight
            ? '110,70,190'
            : (i + j) % 3 === 0 ? '0,229,255' : '67,190,40';
          ctx.strokeStyle = `rgba(${lc},${fade})`;
          ctx.stroke();
        }
      }
    }

    // Neural-network node dots
    nodes.forEach(n => {
      const a = isLight ? n.alpha * 0.65 : n.alpha;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${isLight ? '110,70,190' : n.color},${a})`;
      ctx.fill();
      n.x += n.dx; n.y += n.dy;
      if (n.x < 0) n.x = canvas.width;
      if (n.x > canvas.width) n.x = 0;
      if (n.y < 0) n.y = canvas.height;
      if (n.y > canvas.height) n.y = 0;
    });

    // Dark mode only effects
    if (!isLight) {
      // Data streams — faint falling dot chains
      streams.forEach(s => {
        for (let k = 0; k < s.len; k++) {
          const ya   = s.y - k * s.gap;
          const fade = (1 - k / s.len) * s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, ya, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(67,190,40,${fade})`;
          ctx.fill();
        }
        s.y += s.speed;
        if (s.y > canvas.height + s.len * s.gap) s.y = -s.gap;
      });

      // Electric spark particles
      sparks.forEach(s => {
        s.phase += s.speed;
        const brightness = Math.max(0, Math.sin(s.phase)) * 0.85 + 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${brightness * 0.8})`;
        ctx.fill();
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

      // Edge vignette
      const vg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.28,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.88
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.52)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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


// ── Registration form → Google Sheets via Apps Script ────────────
const form = document.getElementById('signup-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Submitting…';
    btn.disabled = true;

    const data = {
      fname: form.fname.value.trim(),
      lname: form.lname.value.trim(),
      email: form.email.value.trim(),
      major: form.major.value.trim(),
      exp:   form.exp.value,
      team:  form.team.value.trim()
    };

    try {
      const res = await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const wrapper = document.getElementById('signup');
      wrapper.innerHTML = `
        <div class="form-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>You're registered!</h3>
          <p>Thanks, ${data.fname}! We'll send updates to <strong>${data.email}</strong>.<br>
             See you on May 22, 2026 ⚡</p>
        </div>`;
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;

      let msg = form.querySelector('.form-error');
      if (!msg) {
        msg = document.createElement('p');
        msg.className = 'form-error';
        form.appendChild(msg);
      }
      msg.textContent = 'Something went wrong — please try again or email datathon@csulbai.org.';
    }
  });
}
