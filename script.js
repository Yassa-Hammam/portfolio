

'use strict';

/* ── Helpers ── */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ════════════════════════════════════════════
   THEME TOGGLE (Dark / Light)
   ════════════════════════════════════════════ */
function initTheme() {
  const html = document.documentElement;
  const toggle = $('#theme-toggle');
  const stored = localStorage.getItem('portfolio-theme');
  const theme = stored || 'dark';

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
  const header = $('#site-header');
  const hamburger = $('#hamburger');
  const navMenu = $('#nav-menu');
  const navLinks = $$('[data-nav]');

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
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
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
   PROJECT TABS
   ════════════════════════════════════════════ */
function initTabs() {
  const tabs = $$('.tab');
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
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   SHOW MORE PROJECTS (Mobile Only)
   ════════════════════════════════════════════ */
function initShowMoreProjects() {
  const panels = $$('.projects-panel');
  panels.forEach(panel => {
    const cards = $$('.proj-card', panel);
    const moreContainer = $('.projects-more-container', panel);
    if (!moreContainer) return;

    if (cards.length <= 2) {
      moreContainer.style.display = 'none';
      return;
    }

    const button = $('button', moreContainer);
    if (!button) return;
    const btnText = $('span', button);
    const icon = $('i', button);

    button.addEventListener('click', () => {
      const isExpanded = panel.classList.toggle('expanded');
      if (isExpanded) {
        if (btnText) btnText.textContent = 'Show Less';
        if (icon) icon.className = 'fa-solid fa-chevron-up';

        // Trigger reveal animations on newly visible cards
        $$('.reveal', panel).forEach(el => {
          if (!el.classList.contains('visible')) {
            setTimeout(() => el.classList.add('visible'), 50);
          }
        });
      } else {
        if (btnText) btnText.textContent = 'Show More';
        if (icon) icon.className = 'fa-solid fa-chevron-down';

        const projectsSection = $('#projects');
        if (projectsSection) {
          const offset = 76;
          const top = projectsSection.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
}

/* ════════════════════════════════════════════
   INIT ALL
   ════════════════════════════════════════════ */
function init() {
  initTheme();
  initNav();
  initScrollProgress();
  initBackToTop();
  initScrollReveal();
  initTabs();
  initShowMoreProjects();
  initCVButton();
  initFooterYear();
  initSmoothScroll();
}

/* Run when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

