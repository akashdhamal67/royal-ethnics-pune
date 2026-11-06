/**
 * Royal Ethnics - Interactive JavaScript
 * Multi-page support, Hero slider with video/image slides, Mobile drawer,
 * WhatsApp enquiry generators, and Collection filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initHeroSlider();
  initCollectionFilters();
  initProductDetail();
  initContactForm();
  initLazyMedia();
  initAppointmentModal();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  if (!toggleBtn || !drawer) return;

  const toggle = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    drawer.classList.add('open');
    toggleBtn.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', toggle);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close on link click inside drawer (except appointment modal triggers)
  const drawerLinks = drawer.querySelectorAll('.mobile-menu-link, .btn');
  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const text = link.textContent.trim().toLowerCase();
      if (text !== 'book appointment' && !link.classList.contains('btn-nav-appointment') && !link.classList.contains('open-appointment-modal')) {
        closeMenu();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Hero Carousel (Auto-advancing: video plays for at least 8s, supports Video + Image slides)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');

  if (slides.length <= 1) return;

  let currentIndex = 0;
  let slideTimer = null;
  const imageSlideDuration = 7000; // 7s for image slides
  const videoSlideDuration = 8500; // at least 8 seconds for video slide

  const getSlideDuration = (slideIndex) => {
    const slide = slides[slideIndex];
    if (slide && slide.querySelector('video')) {
      return videoSlideDuration;
    }
    return imageSlideDuration;
  };

  const scheduleNext = () => {
    clearTimeout(slideTimer);
    const duration = getSlideDuration(currentIndex);
    slideTimer = setTimeout(() => {
      nextSlide();
    }, duration);
  };

  const goToSlide = (index) => {
    // Wrap around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach((slide) => {
      slide.classList.remove('active');
      const vid = slide.querySelector('video');
      if (vid) {
        vid.pause();
      }
    });

    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = index;
    const activeSlide = slides[currentIndex];
    activeSlide.classList.add('active');

    // Play video if current slide has one
    const activeVid = activeSlide.querySelector('video');
    if (activeVid) {
      activeVid.currentTime = 0;
      activeVid.play().catch(e => {
        console.warn('Video autoplay prevented:', e);
      });
    }

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }

    scheduleNext();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const startAutoPlay = () => {
    scheduleNext();
  };

  const stopAutoPlay = () => {
    if (slideTimer) clearTimeout(slideTimer);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  slider.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  }, { passive: true });

  const handleSwipe = () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Ensure horizontal swipe is dominant and exceeds 45px threshold
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      startAutoPlay();
    }
  };

  // Pause on hover (desktop)
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Initialize first slide playback
  goToSlide(0);
  startAutoPlay();
}

/* --------------------------------------------------------------------------
   4. Collection Filtering (Sherwani / Nawabi / Indo Western / Boys)
   -------------------------------------------------------------------------- */
function initCollectionFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-grid .product-card');

  if (!filterBtns.length || !productCards.length) return;

  // Check URL query parameters for pre-selected category
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const applyFilter = (category) => {
    filterBtns.forEach(btn => {
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    productCards.forEach(card => {
      const cardCat = card.dataset.category;
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      applyFilter(category);

      // Update URL hash/query without reload
      const newUrl = new URL(window.location);
      if (category === 'all') {
        newUrl.searchParams.delete('category');
      } else {
        newUrl.searchParams.set('category', category);
      }
      window.history.replaceState({}, '', newUrl);
    });
  });

  // Apply initial filter if exists
  if (initialCategory) {
    applyFilter(initialCategory);
  }
}

/* --------------------------------------------------------------------------
   5. Product Detail Page Gallery & Dynamic WhatsApp Link
   -------------------------------------------------------------------------- */
function initProductDetail() {
  const mainImg = document.querySelector('.gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const sizePills = document.querySelectorAll('.size-pill');
  const whatsappBtn = document.querySelector('#btn-whatsapp-enquire');

  // Thumbnail click to swap main photo
  if (mainImg && thumbs.length) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const newSrc = thumb.dataset.fullSrc || thumb.querySelector('img').src;
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  // Size pill selector & WhatsApp message updater
  let selectedSize = 'Standard / Custom';
  if (sizePills.length) {
    sizePills.forEach(pill => {
      pill.addEventListener('click', () => {
        sizePills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedSize = pill.dataset.size || pill.textContent.trim();
        updateWhatsappLink();
      });
    });
  }

  function updateWhatsappLink() {
    if (!whatsappBtn) return;
    const productNameEl = document.querySelector('.product-detail-title');
    const productName = productNameEl ? productNameEl.textContent.trim() : 'Ethnic Wear';
    const productSkuEl = document.querySelector('#product-sku');
    const productSku = productSkuEl ? productSkuEl.textContent.trim() : 'RE-PROD';

    const phone = '917768882288';
    const message = `Hello Royal Ethnics Pune, I am interested in inquiring about "${productName}" (Code: ${productSku}). Selected Size: ${selectedSize}. Please share pricing and availability.`;
    whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  if (whatsappBtn) {
    updateWhatsappLink();
  }
}

/* --------------------------------------------------------------------------
   6. Contact Form handler (Simulation & WhatsApp Dispatch)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#contact-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const occasion = form.querySelector('[name="occasion"]')?.value || 'General Enquiry';
    const message = form.querySelector('[name="message"]').value.trim();

    if (feedback) {
      feedback.classList.add('success');
      feedback.textContent = `Thank you, ${name}! Your inquiry has been received. You can also connect immediately on WhatsApp.`;
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Auto-prompt to open WhatsApp for instant response
    const waText = `Hello Royal Ethnics, my name is ${name} (${phone}). Occasion: ${occasion}. Message: ${message}`;
    const waUrl = `https://wa.me/917768882288?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      const openWhatsApp = confirm('Would you like to open WhatsApp directly to chat with our Pune stylist?');
      if (openWhatsApp) {
        window.open(waUrl, '_blank');
      }
    }, 600);

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. Lazy Media Observer
   -------------------------------------------------------------------------- */
function initLazyMedia() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

/* --------------------------------------------------------------------------
   8. Supabase Appointment Booking Modal
   -------------------------------------------------------------------------- */
function initAppointmentModal() {
  // 1. Initialize Supabase Client
  let supabaseClient = null;
  if (typeof window.supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
    }
  }

  // 2. Inject Modal HTML into the DOM if not already present
  let modalOverlay = document.getElementById('appointment-modal');
  if (!modalOverlay) {
    const modalHtml = `
      <div id="appointment-modal" class="appointment-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
        <div class="appointment-modal-card">
          <div class="appointment-modal-header">
            <span class="appointment-modal-tag">Royal Fitting Trial</span>
            <h3 id="appointment-modal-title" class="appointment-modal-title">Book An <span>Appointment</span></h3>
            <p class="appointment-modal-subtitle">Sadashiv Peth, Pune Showroom &bull; Personal Groom Styling</p>
            <button type="button" class="appointment-modal-close" id="appointment-modal-close" aria-label="Close appointment modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="appointment-modal-body" id="appointment-modal-body">
            <!-- Status Alert (at top so visible immediately) -->
            <div id="appointment-status" class="appointment-status" role="alert"></div>

            <form id="appointment-form" class="appointment-form" novalidate>
              <!-- Hidden Honeypot Field -->
              <div class="appointment-hp-field" aria-hidden="true">
                <label for="appointment_website_hp">Leave this empty</label>
                <input type="text" name="website" id="appointment_website_hp" tabindex="-1" autocomplete="off">
              </div>

              <!-- Form Fields Container (hidden on success) -->
              <div id="appointment-form-fields" class="appointment-form-fields" style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Full Name -->
                <div class="appointment-form-group">
                  <label for="apt-name">Full Name <span class="req">*</span></label>
                  <input type="text" id="apt-name" name="name" class="appointment-form-control" placeholder="e.g. Rahul Sharma" required autocomplete="name">
                </div>

                <!-- Phone Number -->
                <div class="appointment-form-group">
                  <label for="apt-phone">Phone Number <span class="req">*</span></label>
                  <input type="tel" id="apt-phone" name="phone" class="appointment-form-control" placeholder="10-digit mobile number" required autocomplete="tel" maxlength="15">
                </div>

                <!-- Interested In -->
                <div class="appointment-form-group">
                  <label for="apt-interested">Interested In</label>
                  <select id="apt-interested" name="interested_in" class="appointment-form-control">
                    <option value="Sherwani">Sherwani</option>
                    <option value="Nawabi">Nawabi</option>
                    <option value="Indo Western">Indo Western</option>
                    <option value="Boys' Wear">Boys' Wear</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <!-- Preferred Visit Date -->
                <div class="appointment-form-group">
                  <label for="apt-date">Preferred Visit Date</label>
                  <input type="date" id="apt-date" name="preferred_date" class="appointment-form-control">
                </div>

                <!-- Message -->
                <div class="appointment-form-group">
                  <label for="apt-message">Message (Optional)</label>
                  <textarea id="apt-message" name="message" class="appointment-form-control" rows="2" placeholder="Any specific design, wedding date, or custom request..."></textarea>
                </div>

                <!-- Submit Button -->
                <button type="submit" id="appointment-submit-btn" class="appointment-form-submit">
                  <span>Book Appointment</span>
                </button>
              </div>
            </form>

            <!-- Success Container (shown only on success) -->
            <div id="appointment-success-container" style="display: none; text-align: center; padding: 2rem 1rem;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(32, 134, 69, 0.2); border: 2px solid #28a745; color: #28a745; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.5rem; color: #FFFFFF; margin: 0 0 0.5rem;">Appointment Requested</h4>
              <p style="font-size: 0.95rem; color: var(--color-cream-soft); margin: 0 0 1.8rem; line-height: 1.5;">Thank you! We'll contact you shortly.</p>
              <button type="button" id="appointment-success-close-btn" class="btn btn-gold" style="width: 100%; min-height: 44px;">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    modalOverlay = document.getElementById('appointment-modal');
  }

  const closeBtn = document.getElementById('appointment-modal-close');
  const modalBody = document.getElementById('appointment-modal-body');
  const modalForm = document.getElementById('appointment-form');
  const formFieldsContainer = document.getElementById('appointment-form-fields');
  const successContainer = document.getElementById('appointment-success-container');
  const successCloseBtn = document.getElementById('appointment-success-close-btn');
  const statusEl = document.getElementById('appointment-status');
  const submitBtn = document.getElementById('appointment-submit-btn');
  const dateInput = document.getElementById('apt-date');
  const phoneInput = document.getElementById('apt-phone');
  const nameInput = document.getElementById('apt-name');

  // Set min date to today (YYYY-MM-DD)
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  const scrollToModalTop = () => {
    if (modalBody) modalBody.scrollTop = 0;
  };

  // Open modal handler
  const openModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset view: show form fields, hide success container, clear status
    if (formFieldsContainer) formFieldsContainer.style.display = 'flex';
    if (successContainer) successContainer.style.display = 'none';
    if (statusEl) {
      statusEl.className = 'appointment-status';
      statusEl.innerHTML = '';
      statusEl.style.display = 'none';
    }
    scrollToModalTop();

    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 100);
  };

  // Close modal handler
  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Attach open event to every "Book Appointment" button / link on the page
  const bindAppointmentButtons = () => {
    const allLinksAndButtons = document.querySelectorAll('a, button');
    allLinksAndButtons.forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      if (text === 'book appointment' || el.classList.contains('btn-nav-appointment') || el.classList.contains('open-appointment-modal')) {
        el.addEventListener('click', (e) => {
          // If inside a mobile drawer, close the drawer first
          const mobileDrawer = document.querySelector('.mobile-drawer');
          const toggleBtn = document.querySelector('.mobile-nav-toggle');
          const backdrop = document.querySelector('.drawer-backdrop');
          if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            mobileDrawer.classList.remove('open');
            if (toggleBtn) toggleBtn.classList.remove('open');
            if (backdrop) backdrop.classList.remove('active');
          }
          openModal(e);
        });
      }
    });
  };

  bindAppointmentButtons();

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  // Close on outside click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Phone validation: Indian number (accepts 10 digits starting with 6-9, or with +91 / 0)
  const validateIndianPhone = (rawPhone) => {
    if (!rawPhone) return null;
    const digitsOnly = rawPhone.replace(/\D/g, '');
    let tenDigits = digitsOnly;
    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      tenDigits = digitsOnly.substring(2);
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
      tenDigits = digitsOnly.substring(1);
    }
    // Exactly 10 digits starting with 6, 7, 8, or 9
    if (/^[6-9]\d{9}$/.test(tenDigits)) {
      return tenDigits;
    }
    // Fallback: If 10 digits regardless of first digit, accept it
    if (tenDigits.length === 10) {
      return tenDigits;
    }
    return null;
  };

  // Submit Handler
  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset status
      if (statusEl) {
        statusEl.className = 'appointment-status';
        statusEl.innerHTML = '';
        statusEl.style.display = 'none';
      }

      // 1. Honeypot check: If filled, silently ignore
      const hpValue = modalForm.querySelector('input[name="website"]')?.value;
      if (hpValue) {
        if (formFieldsContainer) formFieldsContainer.style.display = 'none';
        if (successContainer) successContainer.style.display = 'block';
        modalForm.reset();
        scrollToModalTop();
        return;
      }

      // 2. Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        if (statusEl) {
          statusEl.className = 'appointment-status status-error';
          statusEl.style.display = 'block';
          statusEl.textContent = 'Please enter your full name.';
        }
        scrollToModalTop();
        if (nameInput) nameInput.focus();
        return;
      }

      // 3. Validate Phone Number (10-digit Indian number)
      const phoneRaw = phoneInput ? phoneInput.value.trim() : '';
      const validPhone = validateIndianPhone(phoneRaw);
      if (!validPhone) {
        if (statusEl) {
          statusEl.className = 'appointment-status status-error';
          statusEl.style.display = 'block';
          statusEl.textContent = 'Please enter a valid 10-digit Indian phone number.';
        }
        scrollToModalTop();
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Form values
      const interestedVal = modalForm.querySelector('[name="interested_in"]')?.value || 'Sherwani';
      const preferredDateVal = modalForm.querySelector('[name="preferred_date"]')?.value || null;
      const messageVal = modalForm.querySelector('[name="message"]')?.value.trim() || null;

      // 4. Check client availability
      if (!supabaseClient) {
        console.error('Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_ANON_KEY.');
        if (statusEl) {
          statusEl.className = 'appointment-status status-error';
          statusEl.style.display = 'block';
          statusEl.innerHTML = 'Something went wrong. Please call us or WhatsApp <a href="https://wa.me/917768882288" target="_blank">+91 7768882288</a>.';
        }
        scrollToModalTop();
        return;
      }

      // 5. Disable submit button and show "Sending..."
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      try {
        // Insert without .select() or representation request (insert-only permission)
        const { error } = await supabaseClient
          .from('appointments')
          .insert([
            {
              name: nameVal,
              phone: validPhone,
              interested_in: interestedVal,
              preferred_date: preferredDateVal ? preferredDateVal : null,
              message: messageVal
            }
          ]);

        if (error) {
          console.error('Supabase error inserting appointment:', error);
          if (statusEl) {
            statusEl.className = 'appointment-status status-error';
            statusEl.style.display = 'block';
            statusEl.innerHTML = 'Something went wrong. Please call us or WhatsApp <a href="https://wa.me/917768882288" target="_blank">+91 7768882288</a>.';
          }
          scrollToModalTop();
        } else {
          // Success: hide form fields and show confirmation view with Close button
          if (formFieldsContainer) formFieldsContainer.style.display = 'none';
          if (successContainer) successContainer.style.display = 'block';
          if (statusEl) {
            statusEl.className = 'appointment-status';
            statusEl.innerHTML = '';
            statusEl.style.display = 'none';
          }
          modalForm.reset();
          if (dateInput) {
            dateInput.min = new Date().toISOString().split('T')[0];
          }
          scrollToModalTop();
        }
      } catch (err) {
        console.error('Submission exception:', err);
        if (statusEl) {
          statusEl.className = 'appointment-status status-error';
          statusEl.style.display = 'block';
          statusEl.innerHTML = 'Something went wrong. Please call us or WhatsApp <a href="https://wa.me/917768882288" target="_blank">+91 7768882288</a>.';
        }
        scrollToModalTop();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }
}


