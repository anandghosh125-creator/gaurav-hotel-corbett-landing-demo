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

  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzzLXXOk_APGUNcNYJkQ2nKhUszvKJK6C7XOGsZC7Y-fxB_leuXqTll47zRwjtYopQ/exec';

  const sendToGoogleSheet = async (payload) => {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
  };

  // 8. Booking Modal Logic
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const quickBookingForm = document.getElementById('quickBookingForm');
  const modalBookingForm = document.getElementById('modalBookingForm');
  const modalFeedback = document.getElementById('modalFeedback');
  const mbSubmit = document.getElementById('mb-submit');

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
      modalBookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = mbSubmit ? mbSubmit.textContent : 'Request Confirmation';
        if (mbSubmit) {
          mbSubmit.disabled = true;
          mbSubmit.textContent = 'Sending...';
        }
        if (modalFeedback) modalFeedback.textContent = '';

        const payload = {
          name: document.getElementById('mb-name')?.value.trim() || '',
          phone: document.getElementById('mb-phone')?.value.trim() || '',
          email: document.getElementById('mb-email')?.value.trim() || '',
          checkin: document.getElementById('mb-checkin')?.value || '',
          checkout: document.getElementById('mb-checkout')?.value || '',
          guests: document.getElementById('mb-guests')?.value.trim() || '',
          message: `Stay Selected: ${document.getElementById('mb-stay')?.value || ''}`,
        };

        try {
          await sendToGoogleSheet(payload);
          window.location.href = 'thank-you.html';
        } catch (err) {
          if (mbSubmit) {
            mbSubmit.disabled = false;
            mbSubmit.textContent = originalText;
          }
          if (modalFeedback) {
            modalFeedback.textContent =
              'Unable to send right now. Please try again or message us on WhatsApp.';
          }
        }
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // 9. Contact Form Submission -> Send JSON to Google Apps Script & redirect to thank-you.html
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');
  const cfCheckin = document.getElementById('cf-checkin');
  const cfCheckout = document.getElementById('cf-checkout');
  const cfSubmit = document.getElementById('cf-submit');

  if (cfCheckin && cfCheckout) {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 2);
    const fmt = (d) => d.toISOString().split('T')[0];

    cfCheckin.min = fmt(today);
    cfCheckin.value = fmt(today);
    cfCheckout.min = fmt(today);
    cfCheckout.value = fmt(nextDay);

    cfCheckin.addEventListener('change', () => {
      if (cfCheckout.value <= cfCheckin.value) {
        const updated = new Date(cfCheckin.value);
        updated.setDate(updated.getDate() + 1);
        cfCheckout.value = fmt(updated);
      }
      cfCheckout.min = cfCheckin.value;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnText = cfSubmit ? cfSubmit.textContent : 'Send Inquiry';
      if (cfSubmit) {
        cfSubmit.disabled = true;
        cfSubmit.textContent = 'Sending...';
      }
      if (contactFeedback) {
        contactFeedback.textContent = '';
      }

      const payload = {
        name: document.getElementById('cf-name')?.value.trim() || '',
        phone: document.getElementById('cf-phone')?.value.trim() || '',
        email: document.getElementById('cf-email')?.value.trim() || '',
        checkin: cfCheckin?.value || '',
        checkout: cfCheckout?.value || '',
        guests: document.getElementById('cf-guests')?.value || '',
        message: document.getElementById('cf-message')?.value.trim() || '',
      };

      try {
        await sendToGoogleSheet(payload);
        window.location.href = 'thank-you.html';
      } catch (err) {
        if (cfSubmit) {
          cfSubmit.disabled = false;
          cfSubmit.textContent = originalBtnText;
        }
        if (contactFeedback) {
          contactFeedback.textContent =
            'Unable to send right now. Please try again or message us on WhatsApp.';
        }
      }
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
