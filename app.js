/* =============================================
   BUZBO APP.JS
   - Nav scroll behaviour
   - Mobile menu toggle
   - Feathery form initialisation
   - Scroll-reveal animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── MOBILE MENU ──────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  window.closeMobile = function () {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  };

  // ── FEATHERY FORM ────────────────────────────
  function initFeathery() {
    if (typeof Feathery === 'undefined') {
      // SDK not loaded yet — retry in 500ms
      setTimeout(initFeathery, 500);
      return;
    }
    try {
      Feathery.init('a75c1b3a-d3f4-47d7-8de7-6d5789dfa10a');
      const loginEnabled = false;
      Feathery.renderAt('feathery-container', { formId: '5XeBA5' }, loginEnabled);
    } catch (err) {
      console.warn('Feathery init error:', err);
      // Render a friendly fallback
      renderFallbackForm();
    }
  }

  initFeathery();

  // Fallback form if Feathery fails to load
  function renderFallbackForm() {
    const container = document.getElementById('feathery-container');
    if (!container) return;
    container.innerHTML = `
      <form id="buzbo-fallback-form" style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label style="font-size:13px;font-weight:600;color:#5a3a2a;letter-spacing:0.02em;">Naam</label>
          <input type="text" placeholder="Je volledige naam" required
            style="padding:14px 16px;border:1px solid rgba(139,26,26,0.2);border-radius:10px;font-size:15px;font-family:inherit;background:#fafafa;color:#1a0a0a;outline:none;transition:border-color 0.2s;"
            onfocus="this.style.borderColor='#8B1A1A'" onblur="this.style.borderColor='rgba(139,26,26,0.2)'" />
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label style="font-size:13px;font-weight:600;color:#5a3a2a;letter-spacing:0.02em;">E-mailadres</label>
          <input type="email" placeholder="jouw@email.com" required
            style="padding:14px 16px;border:1px solid rgba(139,26,26,0.2);border-radius:10px;font-size:15px;font-family:inherit;background:#fafafa;color:#1a0a0a;outline:none;transition:border-color 0.2s;"
            onfocus="this.style.borderColor='#8B1A1A'" onblur="this.style.borderColor='rgba(139,26,26,0.2)'" />
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label style="font-size:13px;font-weight:600;color:#5a3a2a;letter-spacing:0.02em;">Ik ben een…</label>
          <select style="padding:14px 16px;border:1px solid rgba(139,26,26,0.2);border-radius:10px;font-size:15px;font-family:inherit;background:#fafafa;color:#1a0a0a;outline:none;appearance:none;cursor:pointer;"
            onfocus="this.style.borderColor='#8B1A1A'" onblur="this.style.borderColor='rgba(139,26,26,0.2)'">
            <option value="" disabled selected>Selecteer je rol</option>
            <option value="professional">Professional op zoek naar een baan</option>
            <option value="manager">Manager / Hiring Manager</option>
            <option value="both">Allebei</option>
          </select>
        </div>
        <button type="submit"
          style="background:#8B1A1A;color:#fff;padding:16px 32px;border:none;border-radius:100px;font-size:15px;font-weight:600;font-family:inherit;letter-spacing:0.02em;cursor:pointer;transition:background 0.2s,transform 0.2s;margin-top:8px;"
          onmouseover="this.style.background='#B02020';this.style.transform='translateY(-1px)'"
          onmouseout="this.style.background='#8B1A1A';this.style.transform=''">
          Claim je plek →
        </button>
      </form>
    `;

    document.getElementById('buzbo-fallback-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.textContent = '✓ Je staat op de lijst!';
      btn.style.background = '#2d6a4f';
      btn.disabled = true;
    });
  }

  // ── SCROLL REVEAL ─────────────────────────────
  // Manifesto lines
  const manifestoLines = document.querySelectorAll('.manifesto-line');
  const manifestoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.3 });

  manifestoLines.forEach(line => manifestoObserver.observe(line));

  // General fade-up elements
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ── STEP ANIMATIONS ───────────────────────────
  const steps = document.querySelectorAll('.step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 120);
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  steps.forEach((step, i) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(24px)';
    step.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
    stepObserver.observe(step);
  });

  // ── STAT COUNTER ANIMATION ────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    statObserver.observe(el);
  });

  // ── SMOOTH SCROLL for all anchor links ─────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── WAITLIST COUNTER (simulated) ───────────────
  // Random number up to create social proof feeling
  const startNum = 2381;
  const counterEls = document.querySelectorAll('.hero-social-proof span:last-child');
  counterEls.forEach(el => {
    const orig = el.textContent;
    // Already set in HTML, just animate the join count on hover of hero actions
  });

});
