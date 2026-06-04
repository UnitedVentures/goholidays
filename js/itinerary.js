/* ============================================================
   ITINERARY PAGE JS — Japan
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  document.getElementById('hamburger')?.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });

  /* ── DAY ACCORDION ────────────────────────────────────── */
  const dayItems = document.querySelectorAll('.day-item');
  dayItems.forEach(item => {
    const header = item.querySelector('.day-header');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      dayItems.forEach(d => d.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first day by default
  if (dayItems[0]) dayItems[0].classList.add('open');

  /* ── GALLERY LIGHTBOX ─────────────────────────────────── */
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-cell__img'));
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lbImg');
  const lbCounter   = document.getElementById('lbCounter');
  const lbClose     = document.getElementById('lbClose');
  const lbPrev      = document.getElementById('lbPrev');
  const lbNext      = document.getElementById('lbNext');
  let current = 0;

  function openLightbox(idx) {
    current = idx;
    lbImg.src = galleryImgs[idx].src.replace(/w=\d+/, 'w=1600');
    lbCounter.textContent = `${idx + 1} / ${galleryImgs.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navigate(dir) {
    current = (current + dir + galleryImgs.length) % galleryImgs.length;
    lbImg.src = galleryImgs[current].src.replace(/w=\d+/, 'w=1600');
    lbCounter.textContent = `${current + 1} / ${galleryImgs.length}`;
  }

  document.querySelectorAll('.gallery-cell').forEach((cell, idx) => {
    cell.addEventListener('click', () => openLightbox(idx));
  });
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lbPrev?.addEventListener('click', () => navigate(-1));
  lbNext?.addEventListener('click', () => navigate(1));
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  /* ── CURRENCY TOGGLE (pricing section) ───────────────── */
  const USD_RATE = 334;
  document.querySelectorAll('.currency-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const toggle = btn.closest('.currency-toggle');
      toggle.querySelectorAll('.currency-toggle__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const currency = btn.dataset.currency;

      document.querySelectorAll('[data-lkr]').forEach(el => {
        const lkr = parseInt(el.dataset.lkr, 10);
        if (currency === 'USD') {
          const usd = Math.ceil(lkr / USD_RATE / 50) * 50;
          el.textContent = 'USD ' + usd.toLocaleString();
        } else {
          el.textContent = 'LKR ' + lkr.toLocaleString();
        }
      });
      document.querySelectorAll('[data-from-label]').forEach(el => {
        el.textContent = currency === 'USD' ? 'From (approx.)' : 'From';
      });
    });
  });

  /* ── REVEAL ON SCROLL ─────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── SMOOTH ANCHOR LINKS ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (navbar?.offsetHeight || 80) + 16;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── ENQUIRY MODAL (reuse from main) ──────────────────── */
  const modalOverlay = document.getElementById('inquiryModal');
  const modalClose   = document.getElementById('modalClose');
  const inquiryForm  = document.getElementById('inquiryForm');
  const successMsg   = document.getElementById('successMsg');

  document.querySelectorAll('.js-inquire').forEach(btn => {
    btn.addEventListener('click', () => {
      if (inquiryForm) inquiryForm.style.display = '';
      if (successMsg) successMsg.classList.remove('show');
      modalOverlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeModal() {
    modalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) closeModal(); });
  inquiryForm?.addEventListener('submit', e => {
    e.preventDefault();
    inquiryForm.style.display = 'none';
    successMsg?.classList.add('show');
    setTimeout(closeModal, 3000);
  });

});
