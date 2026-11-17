document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  // 1. Sticky Navbar on Scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
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

  // 3. Default Dates for Quick Booking Bar
  const checkinInput = document.getElementById('qb-checkin');
  const checkoutInput = document.getElementById('qb-checkout');
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

  // 4. Experience Tabs
  const expTabs = document.querySelectorAll('.exp-tab');
  const expPanels = document.querySelectorAll('.exp-panel');

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
      document.getElementById(`panel-${target}`).classList.add('active');
    });
  });

  // 5. Gallery Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

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

  // 6. Gallery Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('figcaption').textContent;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // 7. Testimonial Slider
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
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

  // 8. Booking Modal Logic
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const quickBookingForm = document.getElementById('quickBookingForm');
  const modalBookingForm = document.getElementById('modalBookingForm');
  const modalFeedback = document.getElementById('modalFeedback');

  const openModal = ({ stay, checkin, checkout, guests }) => {
    document.getElementById('mb-stay').value = stay || 'Canopy Mud Cottage';
    document.getElementById('mb-checkin').value = checkin || checkinInput.value;
    document.getElementById('mb-checkout').value = checkout || checkoutInput.value;
    document.getElementById('mb-guests').value = guests || '2 Adults';
    modalFeedback.textContent = '';
    bookingModal.classList.add('open');
    bookingModal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    bookingModal.classList.remove('open');
    bookingModal.setAttribute('aria-hidden', 'true');
  };

  openBookingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({ stay: btn.dataset.stay || 'Canopy Mud Cottage' });
    });
  });

  quickBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    openModal({
      stay: document.getElementById('qb-stay').value,
      checkin: checkinInput.value,
      checkout: checkoutInput.value,
      guests: document.getElementById('qb-guests').value,
    });
  });

  closeModalBtn.addEventListener('click', closeModal);
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  modalBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('mb-name').value.trim();
    const stayName = document.getElementById('mb-stay').value;
    modalFeedback.textContent = `Thank you, ${guestName}! Your request for ${stayName} has been received. Our Corbett concierge will reach out shortly.`;
    modalBookingForm.reset();
    setTimeout(closeModal, 2600);
  });

  // 9. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    contactFeedback.textContent = `Namaste ${name}! We have received your inquiry and will reply within 2 hours.`;
    contactForm.reset();
  });

  // 10. Scroll Reveal Animation
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

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
});
