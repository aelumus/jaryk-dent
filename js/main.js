/* =============================================
   ЖАРЫК ДЕНТ — PREMIUM JS v2
   ============================================= */

// ---- Preloader ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hide');
    // Trigger hero animations
    document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 200);
    });
    // Start counters in hero
    startHeroCounters();
    // Show cookie
    if (!localStorage.getItem('cookieOk')) {
      setTimeout(() => document.getElementById('cookieBanner').classList.add('show'), 1400);
    }
  }, 1500);
});

// ---- Language ----
let lang = localStorage.getItem('lang') || 'ru';
function setLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.getElementById('langRu').classList.toggle('active', l === 'ru');
  document.getElementById('langKz').classList.toggle('active', l === 'kz');
  document.querySelectorAll('[data-ru]').forEach(el => {
    const val = el.getAttribute('data-' + l);
    if (val !== null) el.innerHTML = val;
  });
  document.querySelectorAll('select option[data-ru]').forEach(opt => {
    const v = opt.getAttribute('data-' + l);
    if (v) opt.textContent = v;
  });
}
// Apply on load
document.addEventListener('DOMContentLoaded', () => setLang(lang));

// ---- Scroll progress ----
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

// ---- Navbar ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile menu ----
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  const burger = document.getElementById('burger');
  const open = menu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}
document.querySelectorAll('.nav-link, .footer__nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMenu').classList.remove('open');
    document.getElementById('burger').querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 75, behavior: 'smooth' });
    }
  });
});

// ---- Scroll reveal ----
const ro = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 90);
    ro.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ---- Active nav link ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 100;
  sections.forEach(s => {
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (!link) return;
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');
    }
  });
}, { passive: true });

// ---- Counter animation ----
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target).toLocaleString('ru');
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('ru');
  };
  requestAnimationFrame(update);
}

function startHeroCounters() {
  document.querySelectorAll('.hero__badges .badge-num[data-target]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target));
  });
}

// Counter observer for other sections
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-target]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.doctor-card, .reviews__trust').forEach(el => counterObs.observe(el));

// ---- Services tabs ----
function switchTab(event, name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.querySelectorAll('.services__panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');
}

// ---- Reviews slider (infinite loop) ----
const track = document.getElementById('reviewTrack');
const dotsContainer = document.getElementById('sliderDots');
let reviewIdx = 0;
let isTransitioning = false;

function getStride() {
  const all = track.querySelectorAll('.review-card');
  if (all.length < 2) return all[0]?.offsetWidth || 300;
  // Use actual DOM offset difference for precise stride (handles any gap value)
  return all[1].offsetLeft - all[0].offsetLeft;
}

function getSlidesPerView() {
  return window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3;
}

function initSlider() {
  if (!track) return;
  const origCards = [...track.querySelectorAll('.review-card')];
  const spv = getSlidesPerView();

  // Clone first and last slides for infinite loop
  origCards.slice(0, spv).forEach(c => track.appendChild(c.cloneNode(true)));
  origCards.slice(-spv).forEach(c => track.insertBefore(c.cloneNode(true), track.firstChild));

  const allCards = track.querySelectorAll('.review-card');
  reviewIdx = spv; // start after clones

  // Position instantly to real first slide (use getStride after layout)
  requestAnimationFrame(() => {
    const w = getStride();
    track.style.transition = 'none';
    track.style.transform = `translateX(-${reviewIdx * w}px)`;
  });

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    origCards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.onclick = () => jumpTo(i);
      dotsContainer.appendChild(d);
    });
  }

  // Transition end handler for infinite wrap
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    const total = track.querySelectorAll('.review-card').length;
    const spvNow = getSlidesPerView();
    const wNow = getStride();

    if (reviewIdx >= total - spvNow) {
      reviewIdx = spvNow;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${reviewIdx * wNow}px)`;
    } else if (reviewIdx < spvNow) {
      reviewIdx = total - spvNow * 2;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${reviewIdx * wNow}px)`;
    }
    updateDots();
  });
}

function updateDots() {
  const spv = getSlidesPerView();
  const origLen = track ? (track.querySelectorAll('.review-card').length - spv * 2) : 0;
  const realIdx = ((reviewIdx - spv) % origLen + origLen) % origLen;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === realIdx));
}

function slideReviews(dir) {
  if (isTransitioning || !track) return;
  isTransitioning = true;
  const w = getStride();
  reviewIdx += dir;
  track.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
  track.style.transform = `translateX(-${reviewIdx * w}px)`;
  updateDots();
}

function jumpTo(origI) {
  if (!track) return;
  const spv = getSlidesPerView();
  const w = getStride();
  reviewIdx = origI + spv;
  track.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
  track.style.transform = `translateX(-${reviewIdx * w}px)`;
  updateDots();
}

window.addEventListener('resize', () => {
  if (!track) return;
  const w = getStride();
  track.style.transition = 'none';
  track.style.transform = `translateX(-${reviewIdx * w}px)`;
});

initSlider();

// Auto-slide every 4s
setInterval(() => slideReviews(1), 4000);

// ---- Booking form ----
function submitForm(e) {
  e.preventDefault();
  let ok = true;
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const ne = document.getElementById('nameError');
  const pe = document.getElementById('phoneError');

  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add('err'); ne.textContent = lang === 'ru' ? 'Введите имя' : 'Атыңызды енгізіңіз'; ne.classList.add('show'); ok = false;
  } else { name.classList.remove('err'); ne.classList.remove('show'); }

  const phoneClean = phone.value.replace(/\D/g, '');
  if (phoneClean.length < 10) {
    phone.classList.add('err'); pe.textContent = lang === 'ru' ? 'Введите корректный номер' : 'Дұрыс нөмір енгізіңіз'; pe.classList.add('show'); ok = false;
  } else { phone.classList.remove('err'); pe.classList.remove('show'); }

  if (!ok) return;
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').style.display = 'block';
}

// Phone mask
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (v.startsWith('7') && v.length > 1) {
      let m = '+7';
      if (v.length > 1) m += ' (' + v.slice(1, 4);
      if (v.length >= 4) m += ') ' + v.slice(4, 7);
      if (v.length >= 7) m += '-' + v.slice(7, 9);
      if (v.length >= 9) m += '-' + v.slice(9, 11);
      this.value = m;
    }
  });
}

// Min date
const dateInput = document.getElementById('date');
if (dateInput) {
  const t = new Date();
  dateInput.min = [t.getFullYear(), String(t.getMonth() + 1).padStart(2, '0'), String(t.getDate()).padStart(2, '0')].join('-');
}

// ---- Cookie ----
function acceptCookies() {
  localStorage.setItem('cookieOk', '1');
  document.getElementById('cookieBanner').classList.remove('show');
}

// ---- Particles ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation-duration:${Math.random() * 16 + 10}s;
      animation-delay:${Math.random() * 8}s;
      opacity:${Math.random() * .25 + .05};
    `;
    container.appendChild(p);
  }
}
createParticles();
