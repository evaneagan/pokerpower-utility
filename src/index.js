
function initMobileNavToggle() {
  const trigger = document.querySelector('.navigation_mobile_trigger');
  const triggerOpen = document.querySelector('.mobile_trigger_open');
  const triggerClose = document.querySelector('.mobile_trigger_close');
  const menu = document.querySelector('.navigation_menu');

  if (!trigger || !menu || !triggerOpen || !triggerClose) return;

  let isMenuOpen = false;
  let menuAnimating = false;

  const toggleMenu = () => {
    if (menuAnimating) return;
    menuAnimating = true;

    if (!isMenuOpen) {
      // OPEN MENU
      gsap.set(menu, { display: "flex" });
      const targetHeight = menu.scrollHeight;

      gsap.timeline({
        onComplete: () => {
          isMenuOpen = true;
          menuAnimating = false;
        }
      })
      .fromTo(menu,
        { height: 0, overflow: "hidden" },
        {
          height: targetHeight,
          duration: 0.4,
          ease: "power2.inOut",
          clearProps: "height"
        }
      )
      .to(triggerOpen, { autoAlpha: 0, duration: 0.3 }, 0)
      .to(triggerClose, { autoAlpha: 1, duration: 0.3 }, 0);

    } else {
      // CLOSE MENU
      const currentHeight = menu.offsetHeight;

      gsap.set(menu, {
        height: currentHeight,
        overflow: "hidden"
      });

      gsap.timeline({
        onComplete: () => {
          gsap.set(menu, {
            clearProps: "all",
            display: "none"
          });
          isMenuOpen = false;
          menuAnimating = false;
        }
      })
      .to(menu, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut"
      })
      .to(triggerClose, { autoAlpha: 0, duration: 0.3 }, 0)
      .to(triggerOpen, { autoAlpha: 1, duration: 0.3 }, 0);
    }
  };

  // Trigger button click
  trigger.addEventListener("click", () => {
    const isVisible = window.getComputedStyle(trigger).display !== "none";
    if (isVisible) toggleMenu();
  });

  // Reset state on resize (desktop breakpoint)
  const observer = new ResizeObserver(() => {
    const isVisible = window.getComputedStyle(trigger).display !== "none";
    if (!isVisible) {
      gsap.set(menu, { display: "none" });
      gsap.set(triggerOpen, { autoAlpha: 1 });
      gsap.set(triggerClose, { autoAlpha: 0 });
      isMenuOpen = false;
      menuAnimating = false;
    }
  });

  observer.observe(trigger);
}

function initModalBasic() {

  const modalGroup = document.querySelector('[data-modal-group-status]');
  const modals = document.querySelectorAll('[data-modal-name]');
  const modalTargets = document.querySelectorAll('[data-modal-target]');

  // Open modal
  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener('click', function () {
      const modalTargetName = this.getAttribute('data-modal-target');

      // Close all modals
      modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
      modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

      // Activate clicked modal
      document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
      document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');

      // Set group to active
      if (modalGroup) {
        modalGroup.setAttribute('data-modal-group-status', 'active');
      }
    });
  });

  // Close modal
  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', closeAllModals);
  });

  // Close modal on `Escape` key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });

function closeAllModals() {
  // Close modals visually
  modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
  if (modalGroup) {
    modalGroup.setAttribute('data-modal-group-status', 'not-active');
  }

  // Reset all YouTube wrappers
  document.querySelectorAll('[data-modal-name] .youtube-wrapper').forEach((wrapper) => {
    const thumbnail = wrapper.querySelector('.youtube-thumbnail');
    const iframeWrapper = wrapper.querySelector('.youtube-iframe');

    if (thumbnail && iframeWrapper) {
      // Stop the video
      const iframe = iframeWrapper.querySelector('iframe');
      if (iframe) {
        iframe.remove(); // ✅ This *must* remove the iframe to stop playback
      }

      // Reset visibility
      thumbnail.style.display = 'block';
      iframeWrapper.style.display = 'none';
    }
  });
}
}

function initButtonCharacterStagger() {
  const offsetIncrement = 0.01;
  const buttons = document.querySelectorAll('[data-button-label]');

  buttons.forEach(button => {
    const text = button.textContent;
    button.innerHTML = '';

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      if (char === ' ') {
        span.style.whiteSpace = 'pre';
      }

      button.appendChild(span);
    });
  });
}

function initTestimonials() {
  const root = document.querySelector('.testimonial_wrap');
  if (!root) return;

  const content = root.querySelector('.testimonial_contain');
  const originalCards = root.querySelectorAll('.testimonial_card');

  // Clone original cards
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    content.appendChild(clone);
  });

  const cards = root.querySelectorAll('.testimonial_card');
  const cardsLength = cards.length / 2;

  let total = 0;
  let xTo;
  let itemValues = [];

  let half = content.clientWidth / 2;
  let wrap = gsap.utils.wrap(-half, 0);

  xTo = gsap.quickTo(content, "x", {
    duration: 0.5,
    modifiers: {
      x: gsap.utils.unitize(wrap),
    },
    ease: 'power3',
  });

  for (let i = 0; i < cardsLength; i++) {
    itemValues.push((Math.random() - 0.5) * 20);
  }

  const tl = gsap.timeline({ paused: true });
  tl.to(cards, {
    rotate: (index) => itemValues[index % cardsLength],
    xPercent: (index) => itemValues[index % cardsLength],
    yPercent: (index) => itemValues[index % cardsLength],
    scale: 0.95,
    duration: 0.5,
    ease: 'back.inOut(3)',
  });

  const gsapObs = Observer.create({
    target: content,
    type: "pointer,touch",
    onPress: () => tl.play(),
    onDrag: (self) => {
      total += self.deltaX;
      xTo(total);
    },
    onRelease: () => tl.reverse(),
    onStop: () => tl.reverse(),
  });

  gsap.ticker.add(tick);

  function tick(time, deltaTime) {
    total -= deltaTime / 25;
    xTo(total);
  }

  // Debounced resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentX = gsap.getProperty(content, "x");
      half = content.clientWidth / 2;
      wrap = gsap.utils.wrap(-half, 0);
      total = currentX;

      xTo = gsap.quickTo(content, "x", {
        duration: 0.5,
        modifiers: {
          x: gsap.utils.unitize(wrap),
        },
        ease: 'power3',
      });

      xTo(total);
    }, 200);
  });
}

function initPinnedSkills() {
  const navOffset = document.querySelector('.navigation_wrap')?.offsetHeight || 0;
  const slides = document.querySelectorAll('.section_skill .skill_wrap');

  if (!slides.length) return;

  slides.forEach(slide => {
    const contentWrapper = slide.querySelector('.skill_contain');
    const content = slide.querySelector('.skill_layout');
    if (!contentWrapper || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        pin: contentWrapper,
        trigger: slide,
        start: `top-=${navOffset} top`,
        end: () => `+=${slide.offsetHeight + window.innerHeight * 0.5}`,
        scrub: true,
      }
    });

    // Buffer (dummy) tween
    tl.to({}, { duration: 0.5 });

    tl.to(content, {
      rotationZ: (Math.random() - 0.5) * 10,
      scale: 0.7,
      rotationX: 40,
      ease: 'power1.in'
    });

    tl.to(content, {
      autoAlpha: 0,
      ease: 'power1.in'
    });
  });
}

function initNavDesktop() {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const trigger = document.querySelector('[data-nav-trigger="for-individuals"]');
    const panel = document.querySelector('[data-nav-panel="for-individuals"]');
    if (!trigger || !panel) return;

    const sectionToggles = panel.querySelectorAll('[data-nav-section-toggle]');
    let isOpen = false;

    // Only on desktop: remove from tab order
    sectionToggles.forEach(btn => btn.setAttribute('tabindex', '-1'));

    // 👇🏽 Only now do we create the timeline (so mobile won't see the `autoAlpha: 0`)
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.3, ease: "power2.out" }
    }).fromTo(panel, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0 });

    // Rest of your logic (hover, focus, etc.)...
    const openMenu = () => {
      if (!isOpen) {
        isOpen = true;
        tl.play();
        trigger.setAttribute("aria-expanded", "true");
        trigger.classList.add("is-active");
      }
    };

    const closeMenu = () => {
      if (isOpen) {
        isOpen = false;
        tl.reverse();
        trigger.setAttribute("aria-expanded", "false");
        trigger.classList.remove("is-active");
      }
    };

    const isFocusOutside = () =>
      !panel.contains(document.activeElement) && !trigger.contains(document.activeElement);

    trigger.addEventListener("mouseenter", openMenu);
    panel.addEventListener("mouseenter", openMenu);
    trigger.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!panel.matches(":hover") && !trigger.matches(":hover")) {
          closeMenu();
        }
      }, 100);
    });
    panel.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!panel.matches(":hover") && !trigger.matches(":hover")) {
          closeMenu();
        }
      }, 100);
    });

    trigger.addEventListener("focusin", openMenu);
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        isOpen ? closeMenu() : openMenu();
      } else if (e.key === "Escape") {
        closeMenu();
        trigger.focus();
      }
    });

    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
        trigger.focus();
      }
    });

    document.addEventListener("focusin", () => {
      if (isOpen) {
        setTimeout(() => {
          if (isFocusOutside()) closeMenu();
        }, 0);
      }
    });

    // Cleanup
    return () => {
      sectionToggles.forEach(btn => btn.removeAttribute('tabindex'));
    };
  });
}

function initLazyYouTube() {
  document.querySelectorAll('.youtube-wrapper').forEach((wrapper) => {
    const thumbnail = wrapper.querySelector('.youtube-thumbnail');
    const iframeWrapper = wrapper.querySelector('.youtube-iframe');

    if (!thumbnail || !iframeWrapper) return;

    thumbnail.addEventListener('click', () => {
      // Only create iframe if it doesn't exist yet
      if (!iframeWrapper.querySelector('iframe')) {
        const match = thumbnail.style.backgroundImage.match(/vi\/([^/]+)\//);
        const videoId = match ? match[1] : null;
        if (!videoId) return;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        iframeWrapper.appendChild(iframe);
      }

      // Show iframe, hide thumbnail
      thumbnail.style.display = 'none';
      iframeWrapper.style.display = 'block';
    });
  });
}

function initNavMobile() {
  const mm = gsap.matchMedia();

  mm.add("(max-width: 991px)", () => {
    const sectionToggles = document.querySelectorAll('[data-nav-section-toggle]');

    sectionToggles.forEach((btn) => {
      const panel = btn.nextElementSibling;

      if (!panel || !panel.classList.contains('nav_submenu_panel')) return;

      let isOpen = false;
      let isAnimating = false;

      // Initial state
      gsap.set(panel, { height: 0, display: 'none', overflow: 'hidden' });
      btn.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        if (isAnimating) return;
        isAnimating = true;

        if (!isOpen) {
          gsap.set(panel, { display: 'block' });

          gsap.to(panel, {
            height: panel.scrollHeight,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(panel, { clearProps: 'height' });
              isOpen = true;
              isAnimating = false;
            },
          });

          btn.setAttribute('aria-expanded', 'true');
        } else {
          gsap.to(panel, {
            height: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(panel, { clearProps: 'all', display: 'none' });
              isOpen = false;
              isAnimating = false;
            },
          });

          btn.setAttribute('aria-expanded', 'false');
        }
      };

      btn.addEventListener('click', toggle);

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });

    // ✅ Cleanup
    return () => {
      sectionToggles.forEach((btn) => {
        const panel = btn.nextElementSibling;
        if (!panel || !panel.classList.contains('nav_submenu_panel')) return;
        gsap.set(panel, { clearProps: 'all' });
        btn.setAttribute('aria-expanded', 'false');
      });
    };
  });
}

function initMobileSubmenuToggle() {
  const mm = gsap.matchMedia();

  mm.add("(max-width: 991px)", () => {
    const submenuTriggers = document.querySelectorAll('[data-nav-section-toggle]');
    const toggleData = [];

    submenuTriggers.forEach(trigger => {
      const submenu = trigger.nextElementSibling;
      if (!submenu || !submenu.classList.contains('submenu_link_contain')) return;

      // Set initial state
      gsap.set(submenu, { height: 0, overflow: "hidden", display: "flex" });

      let isOpen = false;
      let isAnimating = false;

      const onClick = () => {
        console.log("trigger has been clicked")
        if (isAnimating) return;
        isAnimating = true;

        const targetHeight = submenu.scrollHeight;

        const tl = gsap.timeline({
          onComplete: () => {
            isOpen = !isOpen;
            isAnimating = false;

            if (!isOpen) {
              gsap.set(submenu, { height: 0 });
            }
          }
        });

        if (!isOpen) {
          tl.to(submenu, {
            height: targetHeight,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => gsap.set(submenu, { height: "auto" })
          });
        } else {
          tl.to(submenu, {
            height: 0,
            duration: 0.4,
            ease: "power2.inOut"
          });
        }

        trigger.classList.toggle('is-open');
      };

      trigger.addEventListener('click', onClick);

      // Store to undo later
      toggleData.push({ trigger, submenu, onClick });
    });

    // === Teardown: clean state on viewport change
return () => {
  toggleData.forEach(({ trigger, submenu, onClick }) => {
    trigger.removeEventListener('click', onClick);
    trigger.classList.remove('is-open');
    // Remove the inline styles we added on mobile
    gsap.set(submenu, { clearProps: 'height,overflow,display' }); // -> back to CSS (height:auto)
    console.log("reset submenu")
  });
};
  });
}

function autoInit() {
  initMobileNavToggle();
  initButtonCharacterStagger();
  initNavDesktop();
  initNavMobile();
  initMobileSubmenuToggle();
}

window.PokerPower = {
  initMobileNavToggle,
  initModalBasic,
  initButtonCharacterStagger,
  initTestimonialsDelayed: () => gsap.delayedCall(0.2, initTestimonials),
  initPinnedSkills,
  initNavDesktop,
  initNavMobile,
  initMobileSubmenuToggle,
  initLazyYouTube,
  autoInit
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.PokerPower?.autoInit) {
    window.PokerPower.autoInit();
  }
});
