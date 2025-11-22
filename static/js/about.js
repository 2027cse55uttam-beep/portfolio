// about.js — staggered reveal + card tilt microinteraction + keyboard focus support

document.addEventListener('DOMContentLoaded', () => {

  // 1) IntersectionObserver for animate-on-scroll with stagger support
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // If element or children have data-delay attributes, set CSS variable
        const delayAttr = el.dataset.delay;
        if (delayAttr) el.style.setProperty('--delay', delayAttr);

        // for child staggered items (e.g., skill cards inside container)
        const children = el.querySelectorAll('[data-delay]');
        if (children.length) {
          children.forEach(child => {
            const d = child.getAttribute('data-delay') || '0s';
            child.style.transitionDelay = d;
          });
        }

        // reveal the element
        el.classList.add('visible');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });


  // 2) Skill-card hover tilt (pointer only)
  const supportsPointer = window.matchMedia('(pointer: fine)').matches;
  if (supportsPointer) {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
      // make focusable for keyboard users
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

      // pointer move tilt
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / (rect.width/2);
        const dy = (e.clientY - cy) / (rect.height/2);
        const tiltX = (dy * 6).toFixed(2);
        const tiltY = (-dx * 8).toFixed(2);
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        card.style.transition = 'transform 120ms linear';
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 320ms cubic-bezier(.16,.84,.28,1)';
      });

      // keyboard: press enter/space to trigger a small bounce for discoverability
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          card.animate([
            { transform: getComputedStyle(card).transform || 'none' },
            { transform: 'translateY(-6px) scale(1.02)' },
            { transform: 'translateY(0)' }
          ], { duration: 320, easing: 'cubic-bezier(.16,.84,.28,1)' });
        }
      });
    });
  } // end supportsPointer

  // 3) Accessibility: if user has reduce-motion, skip js animations already respected via CSS

});
