// src/components/badges.js
// Renders badges/achievements in locked/unlocked state

import { html } from '../utils/dom.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

/**
 * Creates the HTML element for a single badge.
 * @param {Object} achievement 
 * @param {boolean} isUnlocked 
 * @returns {string}
 */
export function createBadgeCardHTML(achievement, isUnlocked) {
  const statusClass = isUnlocked ? 'badge-card--unlocked' : 'badge-card--locked';
  const statusLabel = isUnlocked ? 'Unlocked' : 'Locked';
  const iconMarkup = isUnlocked 
    ? `<div class="badge-card__icon">${achievement.icon}</div>`
    : `<div class="badge-card__icon badge-card__icon--locked">🔒</div>`;

  return `
    <div class="badge-card ${statusClass}" data-achievement-id="${achievement.id}">
      <div class="badge-card__glow"></div>
      ${iconMarkup}
      <div class="badge-card__content">
        <h4 class="badge-card__name">${achievement.name}</h4>
        <p class="badge-card__desc">${achievement.description}</p>
        <span class="badge-card__status">${statusLabel}</span>
      </div>
    </div>
  `;
}

/**
 * Renders a full grid of achievements.
 * @param {string[]} unlockedIds - List of unlocked achievement IDs
 * @returns {HTMLElement}
 */
export function createBadgeGrid(unlockedIds = []) {
  const cardsHTML = ACHIEVEMENTS.map(ach => {
    const isUnlocked = unlockedIds.includes(ach.id);
    return createBadgeCardHTML(ach, isUnlocked);
  }).join('');

  const grid = html(`
    <div class="badge-grid">
      ${cardsHTML}
    </div>
  `);

  return grid;
}
