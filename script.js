/**
 * ==============================================================================
 * RAJVEER ROSE — PERSONAL PORTFOLIO
 * Vanilla JavaScript Animations & Interactions
 * No frameworks, no external libraries. Beginner-friendly and well-commented.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------------
   * 1. PRELOADER: COUNTER 0 TO 100 AND SLIDE-UP ANIMATION
   * ---------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloader-counter');
  const preloaderBar = document.getElementById('preloader-bar');

  let currentCount = 0;
  const targetCount = 100;
  const duration = 1200; // 1.2 seconds total duration
  const incrementTime = duration / targetCount;

  // Check if reduced motion is requested by user
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Skip counting animation if reduced motion is preferred
    if (preloader) {
      preloader.classList.add('loaded');
      document.body.classList.add('ready');
    }
  } else {
    // Animate counter from 0 to 100
    const counterInterval = setInterval(() => {
      currentCount++;
      if (preloaderCounter) preloaderCounter.textContent = currentCount;
      if (preloaderBar) preloaderBar.style.width = `${currentCount}%`;

      if (currentCount >= targetCount) {
        clearInterval(counterInterval);
        setTimeout(() => {
          // Slide up preloader
          if (preloader) preloader.classList.add('loaded');
          // Trigger hero line reveals
          document.body.classList.add('ready');

          // Hide preloader from layout completely after slide-up finishes
          setTimeout(() => {
            if (preloader) preloader.style.display = 'none';
          }, 850);
        }, 150);
      }
    }, incrementTime);
  }

  /* ----------------------------------------------------------------------------
   * 2. MOBILE NAVIGATION DRAWER
   * ---------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileNavDrawer.classList.add('open');
        mobileMenuBtn.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile drawer when clicking any link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------------------------
   * 3. ABOUT PARAGRAPH: WORD-BY-WORD LIGHT-UP ON SCROLL
   * ---------------------------------------------------------------------------- */
  const aboutTextElement = document.getElementById('about-lightup-text');
  let aboutWords = [];

  if (aboutTextElement) {
    // Split text into words and wrap each in a span.word
    const rawText = aboutTextElement.textContent.trim();
    const wordArray = rawText.split(/\s+/);
    aboutTextElement.innerHTML = '';

    wordArray.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word + ' ';
      aboutTextElement.appendChild(span);
    });

    aboutWords = Array.from(aboutTextElement.querySelectorAll('.word'));
  }

  function updateAboutLightUp() {
    if (!aboutTextElement || aboutWords.length === 0 || prefersReducedMotion) return;

    const rect = aboutTextElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start lighting up when top of paragraph enters lower half of screen
    // Fully lit when bottom of paragraph is comfortably past center
    const startOffset = windowHeight * 0.85;
    const endOffset = windowHeight * 0.25;

    let progress = (startOffset - rect.top) / (rect.height + (startOffset - endOffset));
    progress = Math.max(0, Math.min(1, progress));

    const wordsToLight = Math.floor(progress * aboutWords.length);

    aboutWords.forEach((wordSpan, index) => {
      if (index <= wordsToLight) {
        wordSpan.classList.add('lit');
      } else {
        wordSpan.classList.remove('lit');
      }
    });
  }

  /* ----------------------------------------------------------------------------
   * 4. TICKER STRIP: SPEEDS UP WITH SCROLL SPEED
   * ---------------------------------------------------------------------------- */
  const tickerTrack = document.getElementById('ticker-track');
  let tickerOffset = 0;
  let baseTickerSpeed = 1.2; // default idle speed
  let currentTickerSpeed = baseTickerSpeed;
  let lastScrollYForTicker = window.scrollY;

  function animateTicker() {
    if (tickerTrack) {
      tickerOffset += currentTickerSpeed;
      // Half width of track for seamless infinite marquee loop
      const halfWidth = tickerTrack.scrollWidth / 2;
      if (tickerOffset >= halfWidth) {
        tickerOffset = 0;
      }
      tickerTrack.style.transform = `translateX(-${tickerOffset}px)`;

      // Smoothly ease speed back down to baseTickerSpeed
      currentTickerSpeed += (baseTickerSpeed - currentTickerSpeed) * 0.05;
    }
    requestAnimationFrame(animateTicker);
  }

  // Start ticker animation loop
  requestAnimationFrame(animateTicker);

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollYForTicker);
    lastScrollYForTicker = currentScrollY;

    // Add scroll velocity to ticker speed
    currentTickerSpeed = Math.min(baseTickerSpeed + scrollDelta * 0.12, 14);
  }, { passive: true });

  /* ----------------------------------------------------------------------------
   * 5. PROJECTS PINNED HORIZONTAL-SCROLL (DESKTOP) & ROW (MOBILE)
   * ---------------------------------------------------------------------------- */
  const projectsPinWrap = document.getElementById('projects-pin-wrap');
  const projectsTrack = document.getElementById('projects-track');

  function updateProjectsHorizontalScroll() {
    if (!projectsPinWrap || !projectsTrack) return;

    // Desktop mode: horizontal scroll translation
    if (window.innerWidth > 820 && !prefersReducedMotion) {
      const pinRect = projectsPinWrap.getBoundingClientRect();
      const scrollableDistance = projectsPinWrap.offsetHeight - window.innerHeight;

      if (scrollableDistance > 0) {
        const scrolled = -pinRect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        // Calculate maximum horizontal travel distance
        const maxTranslate = projectsTrack.scrollWidth - window.innerWidth + 80;
        const currentTranslate = progress * maxTranslate;

        projectsTrack.style.transform = `translateX(-${currentTranslate}px)`;
      }
    } else {
      // Mobile / tablet: native swipeable row, clear transform
      projectsTrack.style.transform = '';
    }
  }

  /* ----------------------------------------------------------------------------
   * 6. PROJECT VISUALS UNMASK ON SCROLL
   * ---------------------------------------------------------------------------- */
  const visualContainers = document.querySelectorAll('.visual-unmask-container');

  if ('IntersectionObserver' in window) {
    const visualObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.clipPath = 'inset(0 0 0 0)';
        }
      });
    }, { threshold: 0.2 });

    visualContainers.forEach(container => {
      container.style.clipPath = 'inset(10% 0 10% 0)';
      visualObserver.observe(container);
    });
  }

  /* ----------------------------------------------------------------------------
   * 7. CUSTOM CURSOR DOT & LABELED BUBBLE (DESKTOP ONLY)
   * ---------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorBubble = document.getElementById('cursor-bubble');
  const cursorText = document.getElementById('cursor-text');

  let mouseX = -100;
  let mouseY = -100;
  let bubbleX = -100;
  let bubbleY = -100;

  if (cursorDot && cursorBubble && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Instant dot update
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.opacity = '1';
      cursorBubble.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorBubble.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorBubble.style.opacity = '1';
    });

    // Smooth bubble trailing animation loop
    function animateCursorBubble() {
      bubbleX += (mouseX - bubbleX) * 0.18;
      bubbleY += (mouseY - bubbleY) * 0.18;

      cursorBubble.style.left = `${bubbleX}px`;
      cursorBubble.style.top = `${bubbleY}px`;

      requestAnimationFrame(animateCursorBubble);
    }
    requestAnimationFrame(animateCursorBubble);

    // Interactive element hover handlers for bubble expansion & label
    const interactiveElements = document.querySelectorAll(
      'a, button, .project-card, .skill-row, .achievement-card, .stat-card, .meta-card, .channel-card'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorBubble.classList.add('active');
        const customLabel = el.getAttribute('data-cursor') || 'VIEW';
        if (cursorText) cursorText.textContent = customLabel;
      });

      el.addEventListener('mouseleave', () => {
        cursorBubble.classList.remove('active');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  /* ----------------------------------------------------------------------------
   * 8. MAGNETIC BUTTONS (LEAN TOWARD MOUSE)
   * ---------------------------------------------------------------------------- */
  const magneticButtons = document.querySelectorAll('.btn-magnetic');

  magneticButtons.forEach((btn) => {
    if (prefersReducedMotion) return;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from button center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Subtle displacement
      btn.style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  /* ----------------------------------------------------------------------------
   * 9. 3D SPINNING SHOEBOX (INTERACTIVE MOUSE TILT)
   * ---------------------------------------------------------------------------- */
  const shoeboxScene = document.getElementById('shoebox-scene');
  const shoeboxTilt = document.getElementById('shoebox-tilt');

  let baseRotX = -20;
  let baseRotY = 25;

  if (shoeboxScene && shoeboxTilt && !prefersReducedMotion) {
    shoeboxScene.addEventListener('mousemove', (e) => {
      const rect = shoeboxScene.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = baseRotX - relY * 26; // vertical tilt toward mouse
      const tiltY = baseRotY + relX * 36; // horizontal tilt toward mouse

      shoeboxTilt.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    shoeboxScene.addEventListener('mouseleave', () => {
      shoeboxTilt.style.transform = `rotateX(${baseRotX}deg) rotateY(${baseRotY}deg)`;
    });
  }

  /* ----------------------------------------------------------------------------
   * 10. JOURNEY TIMELINE: DRAWING LINE ON SCROLL
   * ---------------------------------------------------------------------------- */
  const timelineContainer = document.getElementById('timeline-container');
  const timelineLineFill = document.getElementById('timeline-line-fill');
  const timelineSteps = document.querySelectorAll('.timeline-step');

  function updateTimelineProgress() {
    if (!timelineContainer || !timelineLineFill) return;

    const rect = timelineContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Compute progress as the timeline scrolls past mid-viewport
    const triggerOffset = windowHeight * 0.65;
    const scrollPosition = triggerOffset - rect.top;
    let progress = scrollPosition / rect.height;
    progress = Math.max(0, Math.min(1, progress));

    timelineLineFill.style.height = `${progress * 100}%`;

    // Highlight active checkpoints along the timeline
    timelineSteps.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      if (stepRect.top < triggerOffset) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  /* ----------------------------------------------------------------------------
   * 11. NAV SCROLL BEHAVIOR, SCROLL PROGRESS BAR & ACTIVE SECTION HIGHLIGHT
   * ---------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  let lastScrollY = window.scrollY;

  function handleScrollNavigation() {
    const currentScrollY = window.scrollY;

    // Nav hide on scroll down, show on scroll up
    if (siteHeader) {
      const drawerOpen = mobileNavDrawer && mobileNavDrawer.classList.contains('open');
      if (currentScrollY > lastScrollY && currentScrollY > 120 && !drawerOpen) {
        // Scrolling down
        siteHeader.classList.add('nav-hidden');
      } else {
        // Scrolling up
        siteHeader.classList.remove('nav-hidden');
      }
    }
    lastScrollY = currentScrollY;

    // Thin scroll progress bar
    if (scrollProgressBar) {
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = totalDocHeight > 0 ? (currentScrollY / totalDocHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Highlight current section in nav
    let activeId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        activeId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (activeId && link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------------------------
   * 11 (CONT). COUNT-UP STATS (2 Projects, 3 Languages, 5 Tools, 1 Year)
   * ---------------------------------------------------------------------------- */
  const statsGrid = document.getElementById('stats-grid');
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  function runCountUp(element, target, duration = 1200) {
    let startTimestamp = null;
    const startValue = 0;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic function
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if (statsGrid && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          statNumbers.forEach(statEl => {
            const target = parseInt(statEl.getAttribute('data-target'), 10) || 0;
            runCountUp(statEl, target);
          });
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsGrid);
  }

  /* ----------------------------------------------------------------------------
   * 12. CONTACT: COPY EMAIL BUTTON WITH INSTANT CONFIRMATION
   * ---------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const copyFeedback = document.getElementById('copy-feedback');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'roserajveer2008@gmail.com';

      // Clipboard API with document.execCommand fallback
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(() => showCopySuccess(email))
          .catch(() => fallbackCopyText(email));
      } else {
        fallbackCopyText(email);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showCopySuccess(text);
    } catch (err) {
      if (copyFeedback) {
        copyFeedback.textContent = `Email: ${text}`;
        copyFeedback.classList.add('active');
      }
    }
    document.body.removeChild(textArea);
  }

  function showCopySuccess(email) {
    if (copyBtnText) copyBtnText.textContent = 'Copied! ✓';
    if (copyEmailBtn) {
      const r = copyEmailBtn.getBoundingClientRect();
      launchConfetti(r.left + r.width / 2, r.top + r.height / 2, 36);
    }
    if (copyFeedback) {
      copyFeedback.textContent = `✓ Copied to clipboard: ${email}`;
      copyFeedback.classList.add('active');
    }

    setTimeout(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copy email';
      if (copyFeedback) copyFeedback.classList.remove('active');
    }, 3200);
  }


  /* ----------------------------------------------------------------------------
   * 13. CONFETTI BURST (used by the shoebox, the copy-email button and colorways)
   * ---------------------------------------------------------------------------- */
  function launchConfetti(x, y, count = 32) {
    if (prefersReducedMotion) return;
    const styles = getComputedStyle(document.documentElement);
    const colors = ['--orange', '--mustard', '--teal', '--text'].map(v => styles.getPropertyValue(v).trim());

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;
      piece.style.background = colors[i % colors.length];

      document.body.appendChild(piece);

      const dx = (Math.random() - 0.5) * 460;
      const dy = -80 - Math.random() * 280;
      const rotation = (Math.random() - 0.5) * 900;

      const animation = piece.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.1}px, ${dy + 360}px) rotate(${rotation * 1.4}deg)`, opacity: 0 }
      ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' });

      animation.onfinish = () => piece.remove();
    }
  }

  // Click the 3D shoebox for confetti
  const shoeboxClickTarget = document.getElementById('shoebox-scene');
  if (shoeboxClickTarget) {
    shoeboxClickTarget.addEventListener('click', (e) => {
      launchConfetti(e.clientX, e.clientY, 40);
    });
  }

  /* ----------------------------------------------------------------------------
   * 14. HERO: ROTATING "I BUILD ..." TYPEWRITER LINE
   * ---------------------------------------------------------------------------- */
  const typedText = document.getElementById('typed-text');
  const typedPhrases = [
    'interactive web experiences',
    '3D visualizations',
    'AgriTech ideas',
    'projects with AI tools',
    'things worth shipping'
  ];

  if (typedText && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const phrase = typedPhrases[phraseIndex];
      typedText.textContent = phrase.slice(0, charIndex);

      let delay = deleting ? 35 : 70;

      if (!deleting && charIndex === phrase.length) {
        delay = 1600;            // pause when the phrase is complete
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % typedPhrases.length;
        delay = 350;
      } else {
        charIndex += deleting ? -1 : 1;
      }
      setTimeout(typeLoop, delay);
    }
    typedText.textContent = '';
    setTimeout(typeLoop, 1800);   // start after the hero reveal finishes
  }

  /* ----------------------------------------------------------------------------
   * 15. COLORWAY PICKER (saved in localStorage)
   * ---------------------------------------------------------------------------- */
  const colorwayButtons = document.querySelectorAll('.colorway-swatch');

  function applyColorway(name) {
    if (name === 'classic') {
      document.documentElement.removeAttribute('data-colorway');
    } else {
      document.documentElement.setAttribute('data-colorway', name);
    }
    colorwayButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.colorway === name ? 'true' : 'false');
    });
    try { localStorage.setItem('rr-colorway', name); } catch (err) { /* storage can be blocked */ }
  }

  colorwayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyColorway(btn.dataset.colorway);
      const rect = btn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 18);
    });
  });

  try {
    const savedColorway = localStorage.getItem('rr-colorway');
    if (savedColorway) applyColorway(savedColorway);
  } catch (err) { /* ignore */ }

  /* ----------------------------------------------------------------------------
   * GLOBAL SCROLL LISTENER (OPTIMIZED)
   * ---------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    handleScrollNavigation();
    updateAboutLightUp();
    updateTimelineProgress();
    updateProjectsHorizontalScroll();
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateProjectsHorizontalScroll();
  }, { passive: true });

  // Initial calculation
  updateAboutLightUp();
  updateTimelineProgress();
  updateProjectsHorizontalScroll();

});
