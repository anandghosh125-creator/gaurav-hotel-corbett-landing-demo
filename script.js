document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  // 1. Sticky Navbar on Scroll
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a, button').forEach((item) => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Default Dates for Quick Booking Bar
  const checkinInput = document.getElementById('qb-checkin');
  const checkoutInput = document.getElementById('qb-checkout');
  if (checkinInput && checkoutInput) {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 2);

    const formatDate = (date) => date.toISOString().split('T')[0];
    checkinInput.min = formatDate(today);
    checkinInput.value = formatDate(today);
    checkoutInput.min = formatDate(today);
    checkoutInput.value = formatDate(nextDay);

    checkinInput.addEventListener('change', () => {
      if (checkoutInput.value <= checkinInput.value) {
        const updated = new Date(checkinInput.value);
        updated.setDate(updated.getDate() + 1);
        checkoutInput.value = formatDate(updated);
      }
      checkoutInput.min = checkinInput.value;
    });
  }

  // 4. Experience Tabs
  const expTabs = document.querySelectorAll('.exp-tab');
  const expPanels = document.querySelectorAll('.exp-panel');

  if (expTabs.length && expPanels.length) {
    expTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        expTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        expPanels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const targetPanel = document.getElementById(`panel-${target}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  // 5. Gallery Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !match);
        });
      });
    });
  }

  // 6. Gallery Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  if (lightbox && lightboxImg && lightboxCaption && galleryItems.length) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('figcaption');
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 7. Testimonial Slider
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  if (testimonials.length && dots.length) {
    let currentSlide = 0;

    const showSlide = (index) => {
      testimonials.forEach((t) => t.classList.remove('active'));
      dots.forEach((d) => d.classList.remove('active'));
      testimonials[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.slide));
      });
    });

    setInterval(() => {
      const next = (currentSlide + 1) % testimonials.length;
      showSlide(next);
    }, 6000);
  }

  // 8. Booking Modal Logic
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const quickBookingForm = document.getElementById('quickBookingForm');
  const modalBookingForm = document.getElementById('modalBookingForm');
  const modalFeedback = document.getElementById('modalFeedback');

  const closeModal = () => {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    bookingModal.setAttribute('aria-hidden', 'true');
  };

  if (bookingModal) {
    const openModal = ({ stay, checkin, checkout, guests }) => {
      const stayField = document.getElementById('mb-stay');
      const checkinField = document.getElementById('mb-checkin');
      const checkoutField = document.getElementById('mb-checkout');
      const guestsField = document.getElementById('mb-guests');

      if (stayField) stayField.value = stay || 'Canopy Mud Cottage';
      if (checkinField) checkinField.value = checkin || (checkinInput ? checkinInput.value : '');
      if (checkoutField) checkoutField.value = checkout || (checkoutInput ? checkoutInput.value : '');
      if (guestsField) guestsField.value = guests || '2 Adults';
      if (modalFeedback) modalFeedback.textContent = '';

      bookingModal.classList.add('open');
      bookingModal.setAttribute('aria-hidden', 'false');
    };

    openBookingBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        openModal({ stay: btn.dataset.stay || 'Canopy Mud Cottage' });
      });
    });

    if (quickBookingForm) {
      quickBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openModal({
          stay: document.getElementById('qb-stay')?.value,
          checkin: checkinInput?.value,
          checkout: checkoutInput?.value,
          guests: document.getElementById('qb-guests')?.value,
        });
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });

    if (modalBookingForm) {
      modalBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (modalFeedback) {
          modalFeedback.textContent = 'Confirming your request...';
        }
        window.location.href = 'thank-you.html';
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // 9. Contact Form Submission -> Redirect to thank-you.html
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (contactFeedback) {
        contactFeedback.textContent = 'Sending your enquiry...';
      }
      window.location.href = 'thank-you.html';
    });
  }

  // 10. Scroll Reveal Animation
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }
});
