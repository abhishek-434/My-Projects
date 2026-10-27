/**
 * ATELIER — Architecture & Interiors
 * Primary Application Logic & Interactive State Management
 * 
 * Features:
 * - Header scroll detection & dynamic styling.
 * - Accessible mobile navigation drawer with focus management.
 * - Custom cinematic cursor with smooth damping and contextual states.
 * - Interactive Project Case Study Modal with complete architectural specifications.
 * - Tactile Material Study switcher.
 * - Contact Form validation with client inquiry generator & email clipboard utility.
 * - Smooth anchor scrolling & back-to-top utility.
 */

// Architectural Project Monograph Database
const ATELIER_PROJECTS = {
  'stillwater': {
    number: '01 / 04',
    category: 'RESIDENTIAL MONOGRAPH',
    title: 'The Stillwater Residence',
    location: 'Lake Tahoe, California',
    year: '2024',
    image: 'assets/images/project-1-stillwater.jpg',
    lead: 'A low-slung composition of charred cedar volumes and massive granite slabs, cantilevered directly over the alpine shoreline to mirror the stillness of the lake.',
    description: `Designed for a couple immersed in contemporary art and conservation, The Stillwater Residence occupies a steep granite slope surrounded by century-old fir trees. Rather than imposing a single monolithic mass, the program is fragmented into four interconnected pavilions that step down the topography, preserving every existing tree.
    
    The exterior envelope features Shou Sugi Ban (charred Japanese cedar) paired with local Sierra granite quarried within forty miles of the site. Massive motorized triple-glazed glass panels slide entirely into concealed pockets, dissolving all separation between the radiant-heated limestone living terrace and the alpine waters below.`,
    specs: [
      { label: 'Enclosed Area', value: '9,400 sq. ft (873 m²)' },
      { label: 'Site Area', value: '3.2 Acres Alpine Frontage' },
      { label: 'Structural System', value: 'Post-Tensioned Concrete & Glulam' },
      { label: 'Primary Materials', value: 'Charred Cedar, Sierra Granite, Bronze' },
      { label: 'Energy Performance', value: 'Net-Zero Ready & Geothermal Loop' },
      { label: 'Design Principal', value: 'Marcus Vane & Elena Rostova' }
    ]
  },
  'house-of-light': {
    number: '02 / 04',
    category: 'URBAN SANCTUARY',
    title: 'House of Light',
    location: 'Kyoto, Japan',
    year: '2023',
    image: 'assets/images/project-2-house-of-light.jpg',
    lead: 'An introverted concrete residence organized around dual light courtyards, reinterpreting traditional Kyoto machiya spatial sequences through contemporary minimalism.',
    description: `Located on a quiet residential lane in historical Kyoto, House of Light is conceived as an architectural acoustic refuge from the urban sphere. From the street, the residence presents a monolithic facade of fine-textured board-marked concrete punctuated only by a solitary recessed entry gate made of aged Hinoki cypress.
    
    Internally, the home unfolds as a series of cascading levels surrounding two contemplative courtyards. Filtered light cascades through slatted cedar screens (koshi), animating the polished lime-plaster walls throughout the changing hours of the day. A tearoom featuring centuries-old tatami mats anchors the lower ground floor.`,
    specs: [
      { label: 'Enclosed Area', value: '5,200 sq. ft (483 m²)' },
      { label: 'Site Footprint', value: '380 m² Urban Lot' },
      { label: 'Structural System', value: 'Exposed Architectural Concrete' },
      { label: 'Primary Materials', value: 'Board-Formed Concrete, Hinoki, Shoji' },
      { label: 'Accreditation', value: 'AIA International Honor Award 2023' },
      { label: 'Design Principal', value: 'Kenzo Takahashi & ATELIER Zurich' }
    ]
  },
  'courtyard-retreat': {
    number: '03 / 04',
    category: 'COASTAL ESTATE',
    title: 'The Courtyard Retreat',
    location: 'Mallorca, Spain',
    year: '2024',
    image: 'assets/images/project-3-courtyard.jpg',
    lead: 'Hand-cut Marés limestone walls encircling an ancient olive grove, punctuated by deep shaded porticos and natural cistern pools.',
    description: `Perched on a tranquil hillside above the Mediterranean coast, The Courtyard Retreat draws direct inspiration from the vernacular stone fincas of the Balearic archipelago. The house is built using Marés sandstone excavated during the site’s foundation leveling, ensuring that the architecture literally emerges from the earth.
    
    The layout wraps around a central courtyard anchored by a three-hundred-year-old olive tree. Deep porticos and slatted timber pergolas provide critical solar shading during warm summers, while allowing the cool sea breeze to naturally ventilate all living areas without mechanical cooling.`,
    specs: [
      { label: 'Enclosed Area', value: '11,800 sq. ft (1,096 m²)' },
      { label: 'Site Area', value: '7.5 Hectares Olive Grove' },
      { label: 'Water Systems', value: '100% Rainwater Cistern Collection' },
      { label: 'Primary Materials', value: 'Marés Sandstone, Lime Plaster, Teak' },
      { label: 'Landscape Design', value: 'Endemic Mediterranean Dry Garden' },
      { label: 'Design Principal', value: 'Elena Rostova & Gabriel Soler' }
    ]
  },
  'horizon-villa': {
    number: '04 / 04',
    category: 'CLIFFSIDE MODERNISM',
    title: 'The Horizon Villa',
    location: 'Cape Town, South Africa',
    year: '2025',
    image: 'assets/images/project-4-horizon.jpg',
    lead: 'A dramatic 14-meter post-tensioned cantilever thrusting over the Atlantic surf, framing limitless oceanic horizons.',
    description: `Anchored directly into a sheer granite cliffside beneath the Twelve Apostles mountain range, The Horizon Villa is an exploration of structural daring and spatial weightlessness. The residence is anchored by a massive vertical core of bush-hammered concrete from which two horizontal living trays dramatically cantilever into the sea air.
    
    The lower living tray terminates in an infinity-edge pool that visually merges into the ocean below. Ultra-slim structural glass envelopes wrap the perimeter with zero corner columns, affording uninterrupted panoramic views of oceanic sunsets and marine wildlife.`,
    specs: [
      { label: 'Enclosed Area', value: '14,600 sq. ft (1,356 m²)' },
      { label: 'Cantilever Reach', value: '14.2 Meters Over Ocean Slope' },
      { label: 'Structural Engineering', value: 'Post-Tensioned Carbon Concrete' },
      { label: 'Primary Materials', value: 'White Concrete, Gunmetal Bronze, Glass' },
      { label: 'Sustainability', value: 'Off-Grid Solar & Seawater Desalination' },
      { label: 'Design Principal', value: 'Marcus Vane & Pieter Van Zyl' }
    ]
  }
};

class AtelierApp {
  constructor() {
    this.header = document.getElementById('siteHeader');
    this.mobileToggle = document.getElementById('mobileToggle');
    this.mobileDrawer = document.getElementById('mobileDrawer');
    this.drawerBackdrop = document.getElementById('drawerBackdrop');
    this.drawerClose = document.getElementById('drawerClose');
    this.drawerLinks = document.querySelectorAll('.drawer-link');
    this.cursor = document.getElementById('customCursor');
    this.modal = document.getElementById('projectModal');
    this.modalBackdrop = document.getElementById('modalBackdrop');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
    this.modalContent = document.getElementById('modalContent');
    this.contactForm = document.getElementById('contactForm');
    this.btnCopyEmail = document.getElementById('btnCopyEmail');
    this.copyAlert = document.getElementById('copyAlert');

    this.init();
  }

  init() {
    this.initHeaderScroll();
    this.initMobileNav();
    this.initCustomCursor();
    this.initProjectModals();
    this.initMaterialStudy();
    this.initContactForm();
    this.initClipboard();
    this.initSmoothScroll();
  }

  /* --------------------------------------------------------------------------
     1. HEADER SCROLL DETECTION
     -------------------------------------------------------------------------- */
  initHeaderScroll() {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  initMobileNav() {
    if (!this.mobileToggle || !this.mobileDrawer) return;

    const openMenu = () => {
      this.mobileDrawer.classList.add('open');
      this.mobileDrawer.setAttribute('aria-hidden', 'false');
      this.mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      this.mobileDrawer.classList.remove('open');
      this.mobileDrawer.setAttribute('aria-hidden', 'true');
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    this.mobileToggle.addEventListener('click', () => {
      const isOpen = this.mobileDrawer.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    if (this.drawerClose) this.drawerClose.addEventListener('click', closeMenu);
    if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', closeMenu);

    this.drawerLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Keyboard Accessibility (ESC key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. CINEMATIC CURSOR INTERACTION
     -------------------------------------------------------------------------- */
  initCustomCursor() {
    if (!this.cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Smooth lerp animation loop
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      this.cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Hover indicators over interactive elements
    const interactiveSelectors = 'a, button, input, select, textarea, .project-slide, .material-card';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* --------------------------------------------------------------------------
     4. PROJECT MODALS & CASE STUDIES
     -------------------------------------------------------------------------- */
  initProjectModals() {
    const exploreButtons = document.querySelectorAll('.project-explore-btn');

    exploreButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const projectId = btn.getAttribute('data-project');
        if (ATELIER_PROJECTS[projectId]) {
          this.openProjectModal(ATELIER_PROJECTS[projectId]);
        }
      });
    });

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeProjectModal());
    }

    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', () => this.closeProjectModal());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeProjectModal();
      }
    });
  }

  openProjectModal(project) {
    if (!this.modal || !this.modalContent) return;

    // Render specs list HTML
    const specsHTML = project.specs.map(spec => `
      <div class="spec-item">
        <span class="spec-label">${spec.label}</span>
        <span class="spec-value">${spec.value}</span>
      </div>
    `).join('');

    this.modalContent.innerHTML = `
      <div class="modal-header-meta">
        <span class="modal-num">${project.number}</span>
        <span class="modal-cat">${project.category} &bull; ${project.year}</span>
      </div>
      <h2 class="modal-title" id="modalTitle">${project.title}</h2>
      <p class="modal-location">${project.location}</p>

      <div class="modal-image-stage">
        <img src="${project.image}" alt="${project.title} architectural photography">
      </div>

      <div class="modal-grid">
        <div class="modal-narrative">
          <h4>Architectural Concept & Tectonics</h4>
          <p class="modal-lead" style="font-size: 1.1rem; line-height: 1.6; color: var(--color-ivory); margin-bottom: 1.5rem;">${project.lead}</p>
          <p>${project.description.replace(/\n\n/g, '</p><p>')}</p>
        </div>
        <div class="modal-specs-wrap">
          <div class="modal-specs-list">
            <h5 style="font-size: 0.85rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-gold); margin-bottom: 0.5rem;">Project Specifications</h5>
            ${specsHTML}
          </div>
        </div>
      </div>
    `;

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus close button for accessibility
    setTimeout(() => {
      if (this.modalCloseBtn) this.modalCloseBtn.focus();
    }, 100);
  }

  closeProjectModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  /* --------------------------------------------------------------------------
     5. MATERIAL PALETTE STUDY
     -------------------------------------------------------------------------- */
  initMaterialStudy() {
    const materialCards = document.querySelectorAll('.material-card');

    materialCards.forEach((card) => {
      card.addEventListener('click', () => {
        materialCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. CONTACT FORM & CLIENT CONSULTATION
     -------------------------------------------------------------------------- */
  initContactForm() {
    if (!this.contactForm) return;

    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const messageInput = document.getElementById('projectMessage');
    const typeInput = document.getElementById('projectType');
    const locationInput = document.getElementById('projectLocation');
    const feedback = document.getElementById('formFeedback');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (hasError) {
        if (feedback) feedback.textContent = 'Please complete the highlighted fields.';
        return;
      }

      // Construct verified mailto link with structured brief
      const subject = encodeURIComponent(`Architectural Commission Inquiry: ${typeInput.value} — ${nameInput.value}`);
      const body = encodeURIComponent(
        `Dear ATELIER Principals,\n\n` +
        `Name: ${nameInput.value}\n` +
        `Email: ${emailInput.value}\n` +
        `Commission Type: ${typeInput.value}\n` +
        `Site Location: ${locationInput.value || 'Not specified'}\n\n` +
        `Project Vision & Details:\n${messageInput.value}\n\n` +
        `Submitted via atelier-architects.com consultation portal.`
      );

      const mailtoLink = `mailto:inquiries@atelier-architects.com?subject=${subject}&body=${body}`;

      if (feedback) {
        feedback.innerHTML = `
          <span style="color: var(--color-gold);">Opening your email client to send your inquiry...</span>
          <a href="${mailtoLink}" style="display: inline-block; margin-left: 0.5rem; text-decoration: underline; color: #fff;">Click here if your client does not open automatically</a>
        `;
      }

      // Trigger user's email client with pre-filled formal brief
      window.location.href = mailtoLink;
    });

    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.closest('.form-group').classList.remove('has-error');
          if (feedback) feedback.textContent = '';
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. CLIPBOARD UTILITY FOR STUDIO EMAIL
     -------------------------------------------------------------------------- */
  initClipboard() {
    if (!this.btnCopyEmail || !this.copyAlert) return;

    this.btnCopyEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'inquiries@atelier-architects.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          this.copyAlert.classList.add('visible');
          setTimeout(() => {
            this.copyAlert.classList.remove('visible');
          }, 2400);
        });
      } else {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        this.copyAlert.classList.add('visible');
        setTimeout(() => {
          this.copyAlert.classList.remove('visible');
        }, 2400);
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. SMOOTH SCROLL FOR INTERNAL LINKS
     -------------------------------------------------------------------------- */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.atelierApp = new AtelierApp();
});
