/* ============================================================
   NAVIGATION — scroll state + mobile toggle + active links
============================================================ */
const header    = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

// Sticky header style on scroll
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   ACTIVE NAV LINK — highlight based on scroll position
============================================================ */
const sections    = document.querySelectorAll('main section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* ============================================================
   CONTACT FORM — Formspree AJAX submission
============================================================ */
const form       = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent! I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      formStatus.textContent = 'Something went wrong. Please email me directly.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* ============================================================
   FOOTER YEAR — keep copyright current automatically
============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SCROLL REVEAL — fade-in cards as they enter the viewport
============================================================ */
const revealTargets = document.querySelectorAll(
  '.case-card, .project-card, .skill-item, .stat'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`;
    observer.observe(el);
  });
}
