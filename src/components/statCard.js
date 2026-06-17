import { html } from '../utils/dom.js';

export function createStatCard({ label, value, unit, accent = false }) {
  const accentClass = accent ? ' text-accent' : '';
  const cleanValue = String(value).replace(/,/g, '');
  const numericValue = parseFloat(cleanValue) || 0;

  const card = html(`
    <div class="stat-card">
      <div class="stat-card__label">${label}</div>
      <div class="stat-card__value text-mono${accentClass}" data-target="${numericValue}">${value}</div>
      ${unit ? `<div class="stat-card__unit">${unit}</div>` : ''}
    </div>
  `);

  return card;
}
