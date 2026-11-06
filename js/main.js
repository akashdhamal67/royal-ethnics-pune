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

  // Close on link click inside drawer
  const drawerLinks = drawer.querySelectorAll('.mobile-menu-link, .btn');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
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

