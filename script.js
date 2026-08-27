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
   AVATAR FALLBACK
   ════════════════════════════════════════════ */
function initAvatarFallback() {
  const avatarImg = $('.avatar-photo');
  const initials = $('.avatar-initials');

  if (avatarImg && initials) {
    const handleAvatarError = () => {
      avatarImg.style.display = 'none';
      initials.style.display = 'flex';
    };

    avatarImg.addEventListener('error', handleAvatarError);

    // Check if the image already failed to load before listener was attached
    if (avatarImg.complete && avatarImg.naturalWidth === 0) {
      handleAvatarError();
    }
  }
}

/* ════════════════════════════════════════════
   NAVIGATION & ACCESSIBLE MOBILE MENU
   ════════════════════════════════════════════ */
function initNav() {
  const header = $('#site-header');
  const hamburger = $('#hamburger');
  const navMenu = $('#nav-menu');
  const navLinks = $$('[data-nav]');

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  /* Scroll-based header styling */
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  }, { passive: true });

  function openMenu() {
    navMenu?.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Move focus inside menu
    const focusables = navMenu ? $$(focusableSelector, navMenu) : [];
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  }

  function closeMenu() {
    if (!navMenu?.classList.contains('open')) return;
    navMenu.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger?.focus();
  }

  /* Hamburger toggle */
  hamburger?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close menu on link click */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!header?.contains(e.target) && navMenu?.classList.contains('open')) {
      closeMenu();
    }
  });

  /* Keyboard focus trap & Escape key handler */
  document.addEventListener('keydown', (e) => {
    if (!navMenu?.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = $$(focusableSelector, navMenu);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !navMenu.contains(document.activeElement)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !navMenu.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
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
    const rounded = Math.min(Math.round(pct), 100);
    bar.style.width = `${rounded}%`;
    bar.setAttribute('aria-valuenow', String(rounded));
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
  const cvButtons = $$('#cv-btn, #hero-cv-btn');

  cvButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (!href || href === '#' || href === 'yassa-cv.pdf') {
        e.preventDefault();
        alert(
          'CV download will be available once the file is uploaded.\n\n' +
          'Please update the href attribute with your actual CV PDF link.'
        );
      }
    });
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
   SMOOTH SCROLL (fallback for anchor links)
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
    button.setAttribute('aria-expanded', 'false');

    const btnText = $('span', button);
    const icon = $('i', button);

    button.addEventListener('click', () => {
      const isExpanded = panel.classList.toggle('expanded');
      button.setAttribute('aria-expanded', String(isExpanded));

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
   EXPERIENCE TIMELINE PROGRESS OBSERVER
   Drives .active / .completed on mobile.
   Uses IntersectionObserver — zero scroll listener overhead.
   ════════════════════════════════════════════ */
function initExperienceObserver() {
  const cards = $$('.exp-card');
  if (!cards.length) return;

  /* Recalculates which card is active and marks all others as
     completed (past) or neither (upcoming) */
  const update = () => {
    let activeIdx = -1;

    /* Walk from bottom to top; last card whose top edge is above
       the viewport's 60% line becomes the active experience     */
    cards.forEach((card, i) => {
      const { top } = card.getBoundingClientRect();
      if (top < window.innerHeight * 0.6) activeIdx = i;
    });

    cards.forEach((card, i) => {
      if (i < activeIdx) {
        card.classList.remove('active');
        card.classList.add('completed');
      } else if (i === activeIdx) {
        card.classList.add('active');
        card.classList.remove('completed');
      } else {
        card.classList.remove('active', 'completed');
      }
    });
  };

  /* IntersectionObserver triggers update() on any card entering
     or leaving the viewport — far cheaper than a scroll handler */
  const io = new IntersectionObserver(update, {
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });
  cards.forEach(card => io.observe(card));

  /* Run once immediately so initial viewport state is correct  */
  update();
}

/* ════════════════════════════════════════════
   INIT ALL
   ════════════════════════════════════════════ */
function init() {
  initTheme();
  initAvatarFallback();
  initNav();
  initScrollProgress();
  initBackToTop();
  initScrollReveal();
  initTabs();
  initShowMoreProjects();
  initCVButton();
  initExperienceObserver();
  initFooterYear();
  initSmoothScroll();
}

/* Run when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
