import { html } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { getSettings, saveSettings } from '../store.js';

export function createNavbar() {
  const settings = getSettings();
  const currentTheme = settings.theme || 'dark';
  const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';

  const currentHash = window.location.hash.replace('#', '') || '/dashboard';

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Training', path: '/workouts' },
    { label: 'Nutrition', path: '/nutrition' },
    { label: 'Progress', path: '/progress' }
  ];

  const linksHTML = navLinks.map(link => {
    const isActive = currentHash === link.path ? ' active' : '';
    return `<a class="nav__link${isActive}" data-nav="${link.path}">${link.label}</a>`;
  }).join('');

  const nav = html(`
    <nav class="nav">
      <div class="nav__logo" data-nav="/dashboard">Fit<span class="text-accent">Track</span></div>
      <div class="nav__links">
        ${linksHTML}
      </div>
      <div class="nav__actions">
        <button class="btn-icon" id="theme-toggle">${themeIcon}</button>
        <button class="btn-icon" data-nav="/settings">⚙️</button>
      </div>
    </nav>
  `);

  // Navigation handlers
  nav.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.getAttribute('data-nav'));
    });
  });

  // Theme toggle
  const themeToggle = nav.querySelector('#theme-toggle');
  themeToggle.addEventListener('click', () => {
    const currentSettings = getSettings();
    const newTheme = currentSettings.theme === 'dark' ? 'light' : 'dark';
    currentSettings.theme = newTheme;
    saveSettings(currentSettings);
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  return nav;
}
