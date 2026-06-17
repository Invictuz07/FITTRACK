import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/animations.css';
import { initRouter, addRoute } from './router.js';
import { getSettings } from './store.js';

// Landing page
addRoute('/', async () => {
  const m = await import('./pages/landing.js');
  return m.default();
});

// Onboarding wizard
addRoute('/onboarding', async () => {
  const m = await import('./pages/onboarding.js');
  return m.default();
});

// Main dashboard
addRoute('/dashboard', async () => {
  const m = await import('./pages/dashboard.js');
  return m.default();
});

// Workouts page
addRoute('/workouts', async () => {
  const m = await import('./pages/workouts.js');
  return m.default();
});

// Nutrition page
addRoute('/nutrition', async () => {
  const m = await import('./pages/nutrition.js');
  return m.default();
});

// Progress page
addRoute('/progress', async () => {
  const m = await import('./pages/progress.js');
  return m.default();
});

// Settings page
addRoute('/settings', async () => {
  const m = await import('./pages/settings.js');
  return m.default();
});




// Initialize on DOM ready or immediately if already loaded
function init() {
  const settings = getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme);
  initRouter(document.getElementById('app'));
  console.log('FitTrack 2.0 initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

