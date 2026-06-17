import { html } from '../utils/dom.js';

export function createProgressRing({ value, max, label, size = 100, color = 'var(--accent)' }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(value, max);
  const percentage = max > 0 ? clampedValue / max : 0;
  const offset = circumference - (percentage * circumference);

  const card = html(`
    <div class="dashboard__progress-card">
      <svg width="${size}" height="${size}" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="${radius}"
          stroke="var(--border)"
          stroke-width="8"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="${radius}"
          stroke="${color}"
          stroke-width="8"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference}"
          style="transform: rotate(-90deg); transform-origin: 60px 60px; transition: stroke-dashoffset 1s ease;"
        />
        <text
          x="60"
          y="56"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="var(--text-primary)"
          font-family="monospace"
          font-weight="700"
          font-size="16"
        >${clampedValue}</text>
        <text
          x="60"
          y="74"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="var(--text-secondary)"
          font-family="monospace"
          font-size="11"
        >/ ${max}</text>
      </svg>
      <div class="dashboard__progress-label">${label}</div>
    </div>
  `);

  // Trigger the animation after a small delay so the browser registers the initial offset
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const progressCircle = card.querySelectorAll('circle')[1];
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
      }
    });
  });

  return card;
}
