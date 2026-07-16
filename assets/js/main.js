/**
* Mayi Pty Ltd — Main JS
*/
(function () {
  "use strict";

  /* -------------------------------------------------------
   * Helpers
   * ----------------------------------------------------- */
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const target = select(el, all);
    if (!target) return;
    if (all) {
      target.forEach(e => e.addEventListener(type, listener));
    } else {
      target.addEventListener(type, listener);
    }
  };

  const onscroll = (el, listener) => el.addEventListener('scroll', listener);

  /* -------------------------------------------------------
   * Navbar active state on scroll
   * ----------------------------------------------------- */
  const navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach(link => {
      if (!link.hash) return;
      const section = select(link.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /* -------------------------------------------------------
   * Scroll with header offset
   * ----------------------------------------------------- */
  const scrollto = (el) => {
    const header = select('#header');
    const offset = header ? header.offsetHeight : 0;
    const target = select(el);
    if (!target) return;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  };

  /* -------------------------------------------------------
   * Header: add background on scroll
   * ----------------------------------------------------- */
  const selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      selectHeader.classList.toggle('header-scrolled', window.scrollY > 80);
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /* -------------------------------------------------------
   * Back to top
   * ----------------------------------------------------- */
  const backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      backtotop.classList.toggle('active', window.scrollY > 100);
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /* -------------------------------------------------------
   * Mobile nav toggle
   * ----------------------------------------------------- */
  on('click', '.mobile-nav-toggle', function () {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /* -------------------------------------------------------
   * Smooth scroll on .scrollto links
   * ----------------------------------------------------- */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      const navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        const toggle = select('.mobile-nav-toggle');
        toggle.classList.add('bi-list');
        toggle.classList.remove('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /* -------------------------------------------------------
   * Scroll on page load when URL has hash
   * ----------------------------------------------------- */
  window.addEventListener('load', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /* -------------------------------------------------------
   * Preloader
   * ----------------------------------------------------- */
  const preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  /* -------------------------------------------------------
   * AOS (scroll animations)
   * ----------------------------------------------------- */
  window.addEventListener('load', () => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, mirror: false });
  });

  /* -------------------------------------------------------
   * PureCounter (stats)
   * ----------------------------------------------------- */
  new PureCounter();

  /* -------------------------------------------------------
   * Footer year
   * ----------------------------------------------------- */
  const yearEl = select('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
   * Email obfuscation — assemble address at runtime
   * to prevent naive email harvesting bots
   * ----------------------------------------------------- */
  window.addEventListener('load', () => {
    const link = select('#email-link');
    if (!link) return;
    const parts = ['contact', String.fromCharCode(64), 'mayi', '.', 'com', '.', 'au'];
    const email = parts.join('');
    link.textContent = email;
    link.href = 'mailto:' + email;
  });

  /* -------------------------------------------------------
   * Hero particles canvas animation
   * ----------------------------------------------------- */
  (function initParticles() {
    const canvas = select('#particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COUNT = 55;
    const MAX_DIST = 130;
    let particles = [];
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function Particle() {
      this.reset = function () {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r  = Math.random() * 1.8 + 0.8;
      };
      this.reset();
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.fill();
    };

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / MAX_DIST) * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        particles.forEach(p => p.reset());
      }, 200);
    });

    // Pause particles when tab is hidden (save battery/CPU)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animate();
      }
    });

    init();
    animate();
  }());

}());
