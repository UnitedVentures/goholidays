/* ============================================================
   GO HOLIDAYS — MAIN JS
   ============================================================ */

/* ── DOM READY ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── HAMBURGER ────────────────────────────────────────── */
  document.getElementById('hamburger').addEventListener('click', () => {
    navbar.classList.toggle('open');
  });

  /* ── PARALLAX HERO ────────────────────────────────────── */
  const parallaxLayers = [
    { el: document.querySelector('.parallax-layer--bg'),     speed: 0.40 },
    { el: document.querySelector('.parallax-layer--mid'),    speed: 0.22 },
    { el: document.querySelector('.parallax-layer--stripe'), speed: 0.14 },
  ];
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxLayers.forEach(({ el, speed }) => {
          if (el) el.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── REVEAL ON SCROLL ─────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  function animateCounter(el, target, suffix = '') {
    const dur = 1800;
    const start = performance.now();
    const step = now => {
      const prog = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(el => {
          animateCounter(el, +el.dataset.count, el.dataset.suffix || '');
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.stats');
  if (statsEl) statsObserver.observe(statsEl);

  /* ── ITINERARY FILTERS ────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const itinCards  = document.querySelectorAll('.itin-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      itinCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });

  /* ── CURRENCY TOGGLE ──────────────────────────────────── */
  const USD_RATE   = 334;   // 1 USD = 334 LKR  (fetched 2026-06-04)
  const toggleBtns = document.querySelectorAll('.currency-toggle__btn');
  let currentCurrency = 'LKR';

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.currency === currentCurrency) return;
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency;
      updatePrices(currentCurrency);
    });
  });

  function updatePrices(currency) {
    document.querySelectorAll('.itin-card__price-val').forEach(el => {
      const lkr = parseInt(el.dataset.lkr, 10);
      if (currency === 'USD') {
        const usd = Math.ceil(lkr / USD_RATE / 50) * 50; // round up to nearest $50
        el.textContent = 'USD ' + usd.toLocaleString();
      } else {
        el.textContent = 'LKR ' + lkr.toLocaleString();
      }
    });
    // update from-label
    document.querySelectorAll('.itin-card__price-from').forEach(el => {
      el.textContent = currency === 'USD' ? 'From (approx.)' : 'From';
    });
  }

  /* ── INQUIRY MODAL ────────────────────────────────────── */
  const modalOverlay = document.getElementById('inquiryModal');
  const modalTitle   = document.getElementById('modalTitle');
  const modalTrip    = document.getElementById('modalTrip');
  const modalClose   = document.getElementById('modalClose');
  const inquiryForm  = document.getElementById('inquiryForm');
  const successMsg   = document.getElementById('successMsg');

  document.querySelectorAll('.js-inquire').forEach(btn => {
    btn.addEventListener('click', () => {
      const card  = btn.closest('.itin-card');
      const title = card.querySelector('.itin-card__title').textContent;
      const price = card.querySelector('.itin-card__price-val').textContent;
      modalTitle.textContent = 'Enquire — ' + title;
      modalTrip.value = title + ' | ' + price;
      inquiryForm.style.display = '';
      successMsg.classList.remove('show');
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  inquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    inquiryForm.style.display = 'none';
    successMsg.classList.add('show');
    setTimeout(closeModal, 3000);
  });

  /* ── CONTACT FORM ─────────────────────────────────────── */
  const contactForm    = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      contactForm.style.display = 'none';
      contactSuccess.classList.add('show');
    });
  }

  /* ── SMOOTH ANCHOR LINKS ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        navbar.classList.remove('open');
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── ACTIVE NAV HIGHLIGHT ─────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__nav a[href^="#"]');
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.navbar__nav a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => activeObserver.observe(s));

});
