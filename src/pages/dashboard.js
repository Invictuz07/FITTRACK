import { html } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { getUser, getStats, getStreak, getTodayNutrition } from '../store.js';
import { getGreeting, formatNumber } from '../utils/formatters.js';
import { getDailyQuote } from '../data/quotes.js';
import { createNavbar } from '../components/navbar.js';
import { createStatCard } from '../components/statCard.js';
import { createProgressRing } from '../components/progressRing.js';
import { initScrollReveal, addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';

export default async function dashboardPage() {
  const user = getUser();
  const stats = getStats();
  const streak = getStreak();
  const todayNutrition = getTodayNutrition() || { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 };
  const quote = getDailyQuote();

  const goalLabels = {
    lose: 'Fat Loss',
    muscle: 'Muscle Gain',
    recomp: 'Body Recomp',
    maintain: 'Maintenance'
  };

  const goalLabel = goalLabels[user.goal] || user.goal;
  const todayWorkoutDone = todayNutrition.workoutDone ? 1 : 0;

  const page = html(`
    <div class="dashboard">
      <div class="dashboard__nav-container"></div>

      <div class="page-content">
        <div class="ambient-orb ambient-orb--blue"></div>
        <div class="ambient-orb ambient-orb--purple"></div>
        
        <div class="dashboard__greeting reveal">
          ${getGreeting()}, <span class="dashboard__greeting-name">${user.name}</span>
          <span class="badge badge-success">${goalLabel}</span>
        </div>

        ${streak > 0 ? `
        <div class="dashboard__streak reveal-scale">
          <span class="dashboard__streak-fire">🔥</span>
          <span class="dashboard__streak-count">${streak}</span>
          <span class="dashboard__streak-label">day streak</span>
        </div>
        ` : ''}

        <h3 class="section-title reveal">Your Stats</h3>
        <div class="dashboard__stats-grid reveal" id="stats-grid"></div>

        <div class="divider"></div>

        <h3 class="section-title reveal">Today's Progress</h3>
        <div class="dashboard__progress-section reveal" id="progress-section"></div>

        <div class="divider"></div>

        <div class="dashboard__motivation reveal-scale">
          <p class="dashboard__motivation-text">"${quote.text}"</p>
          <p class="dashboard__motivation-source">— ${quote.author}</p>
        </div>

        <div class="divider"></div>

        <h3 class="section-title reveal">Quick Actions</h3>
        <div class="dashboard__actions reveal">
          <button class="dashboard__action-btn ripple-container" data-nav="/workouts">
            <span class="dashboard__action-icon">🏋️</span>
            <span class="dashboard__action-label">Log Workout</span>
          </button>
          <button class="dashboard__action-btn ripple-container" data-nav="/nutrition">
            <span class="dashboard__action-icon">🍽️</span>
            <span class="dashboard__action-label">Log Food</span>
          </button>
          <button class="dashboard__action-btn ripple-container" data-nav="/progress">
            <span class="dashboard__action-icon">⚖️</span>
            <span class="dashboard__action-label">Log Weight</span>
          </button>
          <button class="dashboard__action-btn ripple-container" data-nav="/settings">
            <span class="dashboard__action-icon">⚙️</span>
            <span class="dashboard__action-label">Settings</span>
          </button>
        </div>

        <div class="divider"></div>

        <h3 class="section-title">Explore</h3>
        <div class="dashboard__nav-cards">
          <div class="dashboard__nav-card" data-nav="/workouts">
            <span class="dashboard__nav-card-icon">🏋️</span>
            <span class="dashboard__nav-card-title">Training</span>
            <span class="dashboard__nav-card-desc">Plan and log workouts</span>
          </div>
          <div class="dashboard__nav-card" data-nav="/nutrition">
            <span class="dashboard__nav-card-icon">🥗</span>
            <span class="dashboard__nav-card-title">Nutrition</span>
            <span class="dashboard__nav-card-desc">Track meals and macros</span>
          </div>
          <div class="dashboard__nav-card" data-nav="/progress">
            <span class="dashboard__nav-card-icon">📈</span>
            <span class="dashboard__nav-card-title">Progress</span>
            <span class="dashboard__nav-card-desc">View charts and trends</span>
          </div>
          <div class="dashboard__nav-card" data-nav="/settings">
            <span class="dashboard__nav-card-icon">⚙️</span>
            <span class="dashboard__nav-card-title">Settings</span>
            <span class="dashboard__nav-card-desc">Customize your experience</span>
          </div>
        </div>
      </div>
    </div>
  `);

  // Insert navbar
  const navContainer = page.querySelector('.dashboard__nav-container');
  navContainer.appendChild(createNavbar());

  // Insert stat cards
  const statsGrid = page.querySelector('#stats-grid');
  const statItems = [
    { label: 'Target Calories', value: formatNumber(stats.targetCalories), unit: 'kcal/day', accent: true },
    { label: 'Protein', value: formatNumber(stats.macros?.protein ?? 0), unit: 'g' },
    { label: 'Carbs', value: formatNumber(stats.macros?.carbs ?? 0), unit: 'g' },
    { label: 'Fats', value: formatNumber(stats.macros?.fats ?? 0), unit: 'g' },
    { label: 'BMR', value: formatNumber(stats.bmr), unit: 'kcal' },
    { label: 'TDEE', value: formatNumber(stats.tdee), unit: 'kcal' },
    { label: 'BMI', value: (stats.bmi ?? 0).toFixed(1), unit: '' }
  ];
  statItems.forEach(item => {
    statsGrid.appendChild(createStatCard(item));
  });

  // Insert progress rings
  const progressSection = page.querySelector('#progress-section');
  const targetCals = stats.targetCalories || 2000;

  progressSection.appendChild(createProgressRing({
    value: todayNutrition.calories || 0,
    max: targetCals,
    label: 'Calories',
    color: 'var(--accent)'
  }));
  progressSection.appendChild(createProgressRing({
    value: todayNutrition.water || 0,
    max: 8,
    label: 'Water',
    color: 'var(--accent)'
  }));
  progressSection.appendChild(createProgressRing({
    value: todayWorkoutDone,
    max: 1,
    label: 'Workout',
    color: 'var(--accent)'
  }));

  // Bind navigation with ripples
  page.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      addRipple(e);
      setTimeout(() => {
        navigateTo(el.getAttribute('data-nav'));
      }, 300);
    });
  });

  // GSAP animations
  const statCards = statsGrid.querySelectorAll('.stat-card');
  gsap.fromTo(
    statCards,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'power2.out' }
  );

  // Count-up animation for stat values
  statCards.forEach(card => {
    const valueEl = card.querySelector('.stat-card__value');
    const target = parseFloat(valueEl.getAttribute('data-target'));
    if (!isNaN(target) && target > 0) {
      const obj = { val: 0 };
      const isDecimal = String(target).includes('.');
      gsap.to(obj, {
        val: target,
        duration: 1.2,
        delay: 0.4,
        ease: 'power1.out',
        onUpdate() {
          valueEl.textContent = isDecimal ? obj.val.toFixed(1) : formatNumber(Math.round(obj.val));
        }
      });
    }
  });

  // Animate progress rings
  const progressCards = progressSection.querySelectorAll('.dashboard__progress-card');
  gsap.fromTo(
    progressCards,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, delay: 0.4, ease: 'back.out(1.4)' }
  );

  const cleanupReveal = initScrollReveal(page);
  page.cleanup = () => {
    cleanupReveal();
  };

  return page;
}
