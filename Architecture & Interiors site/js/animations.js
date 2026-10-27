/**
 * ATELIER — Architecture & Interiors
 * GSAP & ScrollTrigger Animation Orchestration
 * 
 * Includes:
 * 1. Hero entrance timeline (Header, eyebrow, overflow line reveals, CTAs, index).
 * 2. Scroll Effect A: Cinematic Hero Zoom & Parallax Fade.
 * 3. Scroll Effect B: Multi-layered architectural image parallax.
 * 4. Scroll Effect C: Pinned Story Chapters narrative with crossfading visual stage.
 * 5. Scroll Effect D: Horizontal project gallery scrubbed by vertical scroll on desktop.
 * 6. Studio Counter numerical animations.
 * 7. Prefers-reduced-motion graceful fallback.
 */

class AtelierAnimations {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ctx = null;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded. Animations gracefully bypassed.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    // Wrap animations in gsap.context for easy cleanup & scoping
    this.ctx = gsap.context(() => {
      if (this.isReducedMotion) {
        this.initReducedMotion();
      } else {
        this.initHeroEntrance();
        this.initHeroScrollTransition();
        this.initPinnedStorySection();
        this.initImageParallax();
        this.initHorizontalGallery();
        this.initStatsCounter();
      }
    });

    // Listen to media query changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      if (this.ctx) this.ctx.revert();
      this.init();
    });
  }

  /* --------------------------------------------------------------------------
     1. HERO ENTRANCE TIMELINE
     -------------------------------------------------------------------------- */
  initHeroEntrance() {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 0.15
    });

    // 1. Reveal Header
    tl.from('#siteHeader', {
      y: -40,
      opacity: 0,
      duration: 1.2
    }, 0);

    // 2. Reveal Eyebrow & Studio Tag
    tl.from(['#heroEyebrow', '#heroStudioTag'], {
      y: 30,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12
    }, 0.2);

    // 3. Overflow line reveals on Hero Title
    const titleLines = document.querySelectorAll('#heroTitle .line-inner');
    if (titleLines.length) {
      tl.from(titleLines, {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out'
      }, 0.35);
    }

    // 4. Slide & Fade Description
    tl.from('#heroDesc', {
      y: 35,
      opacity: 0,
      duration: 1.1
    }, 0.85);

    // 5. Staggered Action Links
    const heroButtons = document.querySelectorAll('#heroActions .btn');
    if (heroButtons.length) {
      tl.from(heroButtons, {
        y: 25,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12
      }, 1.0);
    }

    // 6. Project index & Circular 3D Badge
    tl.from('#heroMetaCol', {
      x: 30,
      opacity: 0,
      duration: 1.1
    }, 1.1);

    // 7. Scroll indicator
    tl.from('#heroScrollIndicator', {
      opacity: 0,
      y: 15,
      duration: 0.8
    }, 1.3);
  }

  /* --------------------------------------------------------------------------
     2. SCROLL EFFECT A: HERO ZOOM & PARALLAX TRANSITION
     -------------------------------------------------------------------------- */
  initHeroScrollTransition() {
    const heroImg = document.getElementById('heroBgImg');
    const heroContent = document.querySelector('.hero-content');

    if (!heroImg) return;

    // Background Image Scale & Slight Descent
    gsap.to(heroImg, {
      scale: 1.22,
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Fade and elevate Hero Content out of focus
    if (heroContent) {
      gsap.to(heroContent, {
        y: -90,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: '20% top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. SCROLL EFFECT C: PINNED STORY NARRATIVE SECTION
     -------------------------------------------------------------------------- */
  initPinnedStorySection() {
    const pinnedSection = document.getElementById('storyPinned');
    const visualCards = document.querySelectorAll('.visual-card');
    const storySteps = document.querySelectorAll('.story-step');

    if (!pinnedSection || !visualCards.length || !storySteps.length) return;

    storySteps.forEach((step, index) => {
      const stepIndex = index + 1;

      ScrollTrigger.create({
        trigger: step,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => this.switchStoryVisual(stepIndex, visualCards),
        onEnterBack: () => this.switchStoryVisual(stepIndex, visualCards)
      });
    });
  }

  switchStoryVisual(stepIndex, visualCards) {
    visualCards.forEach((card) => {
      const cardStep = parseInt(card.getAttribute('data-step'), 10);
      if (cardStep === stepIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. SCROLL EFFECT B: IMAGE PARALLAX
     -------------------------------------------------------------------------- */
  initImageParallax() {
    const parallaxBoxes = document.querySelectorAll('.parallax-box');

    parallaxBoxes.forEach((box) => {
      const img = box.querySelector('.parallax-img');
      if (!img) return;

      const speed = parseFloat(img.getAttribute('data-speed')) || 0.15;
      const moveDistance = speed * 120;

      gsap.fromTo(img, 
        { yPercent: -moveDistance },
        {
          yPercent: moveDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: box,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  }

  /* --------------------------------------------------------------------------
     5. SCROLL EFFECT D: HORIZONTAL PROJECT GALLERY
     -------------------------------------------------------------------------- */
  initHorizontalGallery() {
    const container = document.getElementById('horizontalGalleryContainer');
    const track = document.getElementById('horizontalTrack');
    const thumb = document.getElementById('galleryProgressThumb');
    const currentIndicator = document.getElementById('galleryCurrent');
    const slides = document.querySelectorAll('.project-slide');

    if (!container || !track || !slides.length) return;

    // Use GSAP matchMedia to only enable pinning on desktop (>= 1024px)
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': function() {
        const totalScrollWidth = track.scrollWidth - container.clientWidth;

        const galleryTween = gsap.to(track, {
          x: () => -totalScrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top top',
            end: () => `+=${totalScrollWidth + 300}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Update progress bar
              if (thumb) {
                const progress = self.progress;
                thumb.style.transform = `translateX(${progress * 300}%)`;
              }
              // Update counter
              if (currentIndicator) {
                const activeIndex = Math.min(
                  slides.length,
                  Math.floor(self.progress * slides.length) + 1
                );
                currentIndicator.textContent = String(activeIndex).padStart(2, '0');
              }
            }
          }
        });

        // Parallax image shift inside project cards
        slides.forEach((slide) => {
          const img = slide.querySelector('.project-img');
          if (img) {
            gsap.fromTo(img,
              { xPercent: 6 },
              {
                xPercent: -6,
                ease: 'none',
                scrollTrigger: {
                  trigger: slide,
                  containerAnimation: galleryTween,
                  start: 'left right',
                  end: 'right left',
                  scrub: true
                }
              }
            );
          }
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. STUDIO NUMERICAL COUNTER ANIMATION
     -------------------------------------------------------------------------- */
  initStatsCounter() {
    const statsStrip = document.getElementById('statsStrip');
    const statNums = document.querySelectorAll('.stat-num');

    if (!statsStrip || !statNums.length) return;

    ScrollTrigger.create({
      trigger: statsStrip,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        statNums.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          gsap.to(el, {
            innerText: target,
            duration: 2.2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function() {
              el.innerText = Math.round(this.targets()[0].innerText);
            }
          });
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. PREFERS-REDUCED-MOTION FALLBACK
     -------------------------------------------------------------------------- */
  initReducedMotion() {
    // Show static visible states
    const titleLines = document.querySelectorAll('#heroTitle .line-inner');
    titleLines.forEach((line) => {
      line.style.transform = 'none';
      line.style.opacity = '1';
    });

    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach((el) => {
      el.textContent = el.getAttribute('data-target') || '0';
    });

    // Ensure visual cards in chapter section are visible
    const firstVisual = document.querySelector('.visual-card[data-step="1"]');
    if (firstVisual) firstVisual.classList.add('active');
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.atelierAnimations = new AtelierAnimations();
});
