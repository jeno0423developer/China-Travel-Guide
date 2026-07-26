(function () {
  'use strict';

  // ========== DOM Ready ==========
  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initCardToggle();
    initContactForm();
    initNewsletterForm();
    initScrollAnimations();
  });

  // ========== Navbar Scroll Effect ==========
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var onScroll = function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ========== Mobile Menu Toggle ==========
  function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      var isActive = navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      var icon = hamburger.querySelector('i');
      if (isActive) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        var icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }

  // ========== Smooth Scroll for Anchor Links ==========
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var navbarHeight = document.querySelector('.navbar') ? 70 : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ========== Card Details Toggle ==========
  function initCardToggle() {
    var toggles = document.querySelectorAll('.btn-toggle-attractions');
    if (!toggles.length) return;

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        var targetId = btn.getAttribute('aria-controls');
        var target = targetId ? document.getElementById(targetId) : null;

        if (!target) return;

        if (isExpanded) {
          target.setAttribute('hidden', '');
          btn.setAttribute('aria-expanded', 'false');
          var toggleText = btn.querySelector('.toggle-text');
          if (toggleText) toggleText.textContent = 'View Must-See Attractions & Getting Around';
        } else {
          target.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
          var toggleText = btn.querySelector('.toggle-text');
          if (toggleText) toggleText.textContent = 'Hide Attractions & Tips';
        }
      });
    });
  }

  // ========== Contact Form ==========
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var submitBtn = form.querySelector('button[type="submit"]');

      // Basic validation
      if (!name || !email) {
        showFormMessage(form, 'Please fill in your name and email address.', 'error');
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(function () {
        showFormMessage(form, 'Thank you! We will contact you within 24 hours.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Free Quote';
      }, 1200);
    });
  }

  function showFormMessage(form, message, type) {
    var existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    var msgDiv = document.createElement('div');
    msgDiv.className = 'form-message';
    msgDiv.style.padding = '12px 16px';
    msgDiv.style.borderRadius = '6px';
    msgDiv.style.marginTop = '15px';
    msgDiv.style.fontSize = '0.9rem';

    if (type === 'success') {
      msgDiv.style.backgroundColor = '#d4edda';
      msgDiv.style.color = '#155724';
      msgDiv.style.border = '1px solid #c3e6cb';
    } else {
      msgDiv.style.backgroundColor = '#f8d7da';
      msgDiv.style.color = '#721c24';
      msgDiv.style.border = '1px solid #f5c6cb';
    }

    msgDiv.textContent = message;
    form.appendChild(msgDiv);

    setTimeout(function () {
      msgDiv.remove();
    }, 5000);
  }

  // ========== Newsletter Form ==========
  function initNewsletterForm() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]').value.trim();

      var existing = form.querySelector('.newsletter-msg');
      if (existing) existing.remove();

      if (!email) {
        showNewsletterMessage(form, 'Please enter your email.', 'error');
        return;
      }

      showNewsletterMessage(form, 'Thanks for subscribing!', 'success');
      form.reset();
    });
  }

  function showNewsletterMessage(form, message, type) {
    var msg = document.createElement('div');
    msg.className = 'newsletter-msg';
    msg.style.position = 'absolute';
    msg.style.bottom = '-30px';
    msg.style.left = '0';
    msg.style.fontSize = '0.8rem';
    msg.style.color = type === 'success' ? '#27ae60' : '#e74c3c';
    msg.textContent = message;
    form.style.position = 'relative';
    form.appendChild(msg);

    setTimeout(function () {
      msg.remove();
    }, 3000);
  }

  // ========== Scroll-triggered Animations ==========
  function initScrollAnimations() {
    var elements = document.querySelectorAll(
      '.service-card, .destination-card, .testimonial-card, .guide-card'
    );

    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease ' + (index * 0.05) + 's, transform 0.6s ease ' + (index * 0.05) + 's';
      observer.observe(el);
    });
  }
})();