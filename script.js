/**
 * YASSA HAMMAM — PORTFOLIO SCRIPT
 * Clean, modular, production-ready JavaScript
 * =========================================== */

'use strict';

/* ── Helpers ── */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ════════════════════════════════════════════
   THEME TOGGLE (Dark / Light)
   ════════════════════════════════════════════ */
function initTheme() {
  const html   = document.documentElement;
  const toggle = $('#theme-toggle');
  const stored = localStorage.getItem('portfolio-theme');
  const prefer = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme  = stored || prefer;

  html.setAttribute('data-theme', theme);

  toggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
function initNav() {
  const header    = $('#site-header');
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');
  const navLinks  = $$('[data-nav]');

  /* Scroll-based header styling */
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  }, { passive: true });

  /* Hamburger toggle */
  hamburger?.addEventListener('click', () => {
    const open = navMenu?.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Close menu on link click */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!header?.contains(e.target) && navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* Keyboard nav */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* Active section highlight */
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    const sections = $$('section[id]');

    sections.forEach(section => {
      const { top, bottom } = section.getBoundingClientRect();
      const absTop = top + window.scrollY;
      const absBot = bottom + window.scrollY;

      if (scrollY >= absTop && scrollY < absBot) {
        const id = section.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  updateActiveNav();
}

/* ════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = $('#scroll-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

/* ════════════════════════════════════════════
   BACK TO TOP
   ════════════════════════════════════════════ */
function initBackToTop() {
  const btn = $('#back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    if (show) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════
   TYPEWRITER EFFECT
   ════════════════════════════════════════════ */
function initTypewriter() {
  const el = $('#type-text');
  if (!el) return;

  const phrases = [
    'Data Engineer',
    'Data Analyst',
    'Power BI Developer',
    'AI Enthusiast',
    'Python Developer',
    'ETL Engineer',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.textContent = currentPhrase.substring(0, charIdx);

    let delay = isDeleting ? 50 : 95;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting  = false;
      phraseIdx   = (phraseIdx + 1) % phrases.length;
      delay       = 350;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
}

/* ════════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -48px 0px' }
  );

  $$('.reveal').forEach(el => observer.observe(el));

  return observer;
}

/* ════════════════════════════════════════════
   COUNTERS
   ════════════════════════════════════════════ */
function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;

        const duration = 1400;
        const stepTime = Math.max(Math.floor(duration / target), 14);
        let current    = 0;

        const timer = setInterval(() => {
          current++;
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, stepTime);

        observer.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  $$('[data-count]').forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   PROJECT TABS
   ════════════════════════════════════════════ */
function initTabs() {
  const tabs   = $$('.tab');
  const panels = $$('.projects-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      /* Update tab buttons */
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      /* Update panels */
      panels.forEach(panel => {
        const isActive = panel.id === `tab-${target}`;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });

      /* Trigger reveal on newly visible elements */
      const activePanel = $(`#tab-${target}`);
      if (activePanel) {
        $$('.reveal', activePanel).forEach(el => {
          if (!el.classList.contains('visible')) {
            setTimeout(() => el.classList.add('visible'), 50);
          }
        });
      }
    });
  });
}

/* ════════════════════════════════════════════
   CUSTOM CURSOR (pointer devices only)
   ════════════════════════════════════════════ */
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = $('#cursor');
  const trail  = $('#cursor-trail');
  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.14;
    trailY += (mouseY - trailY) * 0.14;
    trail.style.left = `${trailX}px`;
    trail.style.top  = `${trailY}px`;
    rafId = requestAnimationFrame(animateTrail);
  }

  animateTrail();

  /* Hover state on interactive elements */
  const interactiveSelector = 'a, button, .tab, .pill, .trait-card, .proj-card, .cert-card, .contact-link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('hover');
      trail.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove('hover');
      trail.classList.remove('hover');
    }
  });

  /* Hide on leave */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '';
    trail.style.opacity  = '';
  });
}

/* ════════════════════════════════════════════
   CONTACT FORM
   ════════════════════════════════════════════ */
function initContactForm() {
  const form    = $('#contact-form');
  const btnText = $('#btn-text');
  const success = $('#form-success');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(field, msg) {
    field.classList.add('error');
    const errEl = field.parentElement?.querySelector('.form-error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(field) {
    field.classList.remove('error');
    const errEl = field.parentElement?.querySelector('.form-error');
    if (errEl) errEl.textContent = '';
  }

  /* Live validation */
  $$('.form-control', form).forEach(field => {
    field.addEventListener('blur', () => {
      if (field.required && !field.value.trim()) {
        setError(field, 'This field is required.');
      } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
        setError(field, 'Please enter a valid email.');
      } else {
        clearError(field);
      }
    });

    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameField  = $('#cf-name');
    const emailField = $('#cf-email');
    const msgField   = $('#cf-msg');
    let valid = true;

    if (!nameField?.value.trim()) {
      setError(nameField, 'Please enter your name.');
      valid = false;
    }

    if (!emailField?.value.trim()) {
      setError(emailField, 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(emailField.value)) {
      setError(emailField, 'Please enter a valid email address.');
      valid = false;
    }

    if (!msgField?.value.trim()) {
      setError(msgField, 'Please enter your message.');
      valid = false;
    }

    if (!valid) return;

    const btn = $('#submit-btn');
    if (!btn || !btnText) return;

    /* Simulate send (replace with real backend/FormSpree) */
    btn.disabled = true;
    btnText.textContent = 'Sending…';

    setTimeout(() => {
      btn.style.display  = 'none';
      success.removeAttribute('hidden');
      success.style.display = 'block';
      form.reset();
    }, 1800);
  });
}

/* ════════════════════════════════════════════
   CV DOWNLOAD HANDLER
   ════════════════════════════════════════════ */
function initCVButton() {
  const btn = $('#cv-btn');
  if (!btn) return;

  /* If no actual PDF is linked, show a friendly alert */
  btn.addEventListener('click', (e) => {
    const href = btn.getAttribute('href');
    if (!href || href === 'yassa-cv.pdf') {
      e.preventDefault();
      alert('CV download will be available once the file is uploaded.\n\nLink your actual PDF by setting the href attribute on the Download CV button.');
    }
    /* If href is a real URL, the default behavior (download) kicks in */
  });
}

/* ════════════════════════════════════════════
   FOOTER YEAR
   ════════════════════════════════════════════ */
function initFooterYear() {
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ════════════════════════════════════════════
   SMOOTH SCROLL (fallback for older browsers)
   ════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = $(id);
      if (!target) return;

      e.preventDefault();
      const offset = 76; /* header height */
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   STAT FILL ANIMATION
   ════════════════════════════════════════════ */
function initStatFill() {
  const fills = $$('.stat-fill');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* The CSS transition handles the animation once class is added */
          entry.target.style.transitionDelay = '0.3s';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* ════════════════════════════════════════════
   INIT ALL
   ════════════════════════════════════════════ */
function init() {
  initTheme();
  initNav();
  initScrollProgress();
  initBackToTop();
  initTypewriter();
  initScrollReveal();
  initCounters();
  initTabs();
  initCursor();
  initContactForm();
  initCVButton();
  initFooterYear();
  initSmoothScroll();
  initStatFill();
}

/* Run when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
