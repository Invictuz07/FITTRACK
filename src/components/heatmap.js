import { html, on } from '../utils/dom.js';
import gsap from 'gsap';

/**
 * Create a GitHub-style heatmap calendar.
 * @param {Object} options
 * @param {Array<{date: string, intensity: number}>} options.data  — [{date: '2026-01-15', intensity: 0-3}]
 * @param {number} [options.weeks=52] — number of weeks to show
 * @param {Function} [options.onCellClick] — callback(date, intensity)
 * @returns {HTMLElement}
 */
export function createHeatmap({ data = [], weeks = 52, onCellClick = null } = {}) {
  const cellSize = 14;
  const cellGap = 3;
  const labelWidth = 28;

  // Build date → intensity lookup
  const lookup = {};
  data.forEach(d => { lookup[d.date] = d.intensity || 0; });

  // Generate dates: from (weeks) ago to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7) + 1);
  // Align to Monday
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const monthLabels = [];
  const cells = [];
  let lastMonth = -1;

  const current = new Date(startDate);
  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];
    const dayOfWeek = (current.getDay() + 6) % 7; // 0=Mon
    const weekIndex = Math.floor((current - startDate) / (7 * 24 * 60 * 60 * 1000));
    const intensity = lookup[dateStr] || 0;

    // Track month labels
    if (current.getMonth() !== lastMonth) {
      lastMonth = current.getMonth();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthLabels.push({ name: monthNames[lastMonth], weekIndex });
    }

    cells.push({ dateStr, dayOfWeek, weekIndex, intensity });
    current.setDate(current.getDate() + 1);
  }

  const totalWeeks = cells.length > 0 ? cells[cells.length - 1].weekIndex + 1 : weeks;
  const svgWidth = labelWidth + totalWeeks * (cellSize + cellGap) + 10;
  const svgHeight = 24 + 7 * (cellSize + cellGap);

  const intensityColors = [
    'var(--bg-tertiary)',           // 0 — no activity
    'rgba(41, 121, 255, 0.25)',    // 1 — light
    'rgba(41, 121, 255, 0.55)',    // 2 — medium
    'var(--accent)'                 // 3 — intense
  ];

  const cellsHtml = cells.map(c => {
    const x = labelWidth + c.weekIndex * (cellSize + cellGap);
    const y = 22 + c.dayOfWeek * (cellSize + cellGap);
    const color = intensityColors[Math.min(c.intensity, 3)];
    return `<rect 
      x="${x}" y="${y}" 
      width="${cellSize}" height="${cellSize}" 
      rx="3" ry="3" 
      fill="${color}" 
      data-date="${c.dateStr}" 
      data-intensity="${c.intensity}"
      style="cursor:pointer;transition:fill 0.2s ease;"
    ><title>${c.dateStr} — ${c.intensity === 0 ? 'No activity' : c.intensity === 1 ? 'Light' : c.intensity === 2 ? 'Moderate' : 'Intense'}</title></rect>`;
  }).join('');

  const monthLabelsHtml = monthLabels.map(m => {
    const x = labelWidth + m.weekIndex * (cellSize + cellGap);
    return `<text x="${x}" y="14" fill="var(--text-muted)" font-size="10" font-family="var(--font-main)" font-weight="600">${m.name}</text>`;
  }).join('');

  const dayLabelsHtml = dayLabels.map((label, i) => {
    if (!label) return '';
    const y = 22 + i * (cellSize + cellGap) + cellSize - 2;
    return `<text x="0" y="${y}" fill="var(--text-muted)" font-size="9" font-family="var(--font-main)" font-weight="600">${label}</text>`;
  }).join('');

  const container = html(`
    <div class="heatmap" style="overflow-x:auto;padding-bottom:0.5rem;">
      <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        ${monthLabelsHtml}
        ${dayLabelsHtml}
        ${cellsHtml}
      </svg>
    </div>
  `);

  // Click handler
  if (onCellClick) {
    container.querySelectorAll('rect[data-date]').forEach(rect => {
      on(rect, 'click', () => {
        onCellClick(rect.dataset.date, parseInt(rect.dataset.intensity));
      });
    });
  }

  // Animate cells appearing
  requestAnimationFrame(() => {
    const rects = container.querySelectorAll('rect[data-date]');
    gsap.fromTo(rects, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.003 });
  });

  return container;
}
