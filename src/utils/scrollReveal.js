export function initScrollReveal(container) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.revealDelay || 0;
        setTimeout(() => {
          el.classList.add('revealed');
        }, parseInt(delay));
        // One-shot by default
        if (!el.dataset.revealRepeat) {
          observer.unobserve(el);
        }
      } else if (entry.target.dataset.revealRepeat) {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const elements = container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  elements.forEach(el => observer.observe(el));

  return () => observer.disconnect();
}

export function addRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - btn.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${e.clientY - btn.getBoundingClientRect().top - radius}px`;
  circle.classList.add('ripple');
  const existingRipple = btn.querySelector('.ripple');
  if (existingRipple) existingRipple.remove();
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

export function staggerReveal(elements, baseDelay = 0, increment = 80) {
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = String(baseDelay + i * increment);
  });
}
