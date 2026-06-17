import { html, qs, qsa, on } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { getUser, getStats, getNutritionLog, saveNutritionLog, getTodayNutrition, getSettings, unlockAchievement } from '../store.js';
import { formatDate, formatNumber, formatCalories, getTodayISO, generateId } from '../utils/formatters.js';
import { createNavbar } from '../components/navbar.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast, showSuccess } from '../components/toast.js';
import gsap from 'gsap';
import foods, { getFoodsByCategory, searchFoods, getFoodById, FOOD_CATEGORIES } from '../data/foods.js';
import mealPlans, { getMealPlansByCalories, getMealPlansByType, getMealPlanById } from '../data/mealPlans.js';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

// ── State ────────────────────────────────────────────────────────────────────
let activeTab = 'today';
let todayEntry = null; // current day's nutrition entry
let macroChart = null; // Chart.js instance

const MEAL_NAMES = ['Breakfast', 'Lunch', 'Pre-Workout', 'Dinner', 'Snacks'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadTodayEntry() {
  const today = getTodayISO();
  const log = getNutritionLog();
  todayEntry = log.find(e => e.date === today);
  if (!todayEntry) {
    todayEntry = {
      id: generateId(),
      date: today,
      meals: MEAL_NAMES.map(name => ({ name, foods: [] })),
      waterGlasses: 0
    };
  }
  // Ensure all meal sections exist
  MEAL_NAMES.forEach(name => {
    if (!todayEntry.meals.find(m => m.name === name)) {
      todayEntry.meals.push({ name, foods: [] });
    }
  });
}

function saveTodayEntry() {
  // Remove existing entry for today and re-add
  const log = getNutritionLog().filter(e => {
    const d = e.date || (e.createdAt && e.createdAt.split('T')[0]);
    return d !== getTodayISO();
  });
  log.push(todayEntry);
  saveNutritionLog(log);
}

function getTotals() {
  let calories = 0, protein = 0, carbs = 0, fats = 0;
  (todayEntry?.meals || []).forEach(meal => {
    (meal.foods || []).forEach(f => {
      calories += f.calories || 0;
      protein += f.protein || 0;
      carbs += f.carbs || 0;
      fats += f.fats || 0;
    });
  });
  return { calories: Math.round(calories), protein: Math.round(protein), carbs: Math.round(carbs), fats: Math.round(fats) };
}

function getMealCalories(meal) {
  return (meal.foods || []).reduce((sum, f) => sum + (f.calories || 0), 0);
}

// ── Tab Renderers ────────────────────────────────────────────────────────────

function renderTodayTab(container) {
  loadTodayEntry();
  const stats = getStats();
  const targetCals = stats.targetCalories || 2000;
  const targetProtein = stats.macros?.protein || 150;
  const targetCarbs = stats.macros?.carbs || 200;
  const targetFats = stats.macros?.fats || 60;
  const totals = getTotals();

  const calPercent = Math.min((totals.calories / targetCals) * 100, 100).toFixed(0);
  const proPercent = Math.min((totals.protein / targetProtein) * 100, 100).toFixed(0);

  container.innerHTML = `
    <div class="nutrition__summary">
      <div class="nutrition__summary-card">
        <div class="nutrition__summary-label">Calories</div>
        <div class="nutrition__summary-value">${formatNumber(totals.calories)}</div>
        <div class="nutrition__summary-target">/ ${formatNumber(targetCals)} kcal</div>
        <div class="progress-bar" style="height:4px;background:var(--bg-tertiary);border-radius:var(--radius-full);margin-top:0.5rem;overflow:hidden;">
          <div style="width:${calPercent}%;height:100%;background:var(--accent);border-radius:var(--radius-full);transition:width 0.4s ease;"></div>
        </div>
      </div>
      <div class="nutrition__summary-card">
        <div class="nutrition__summary-label">Protein</div>
        <div class="nutrition__summary-value">${formatNumber(totals.protein)}g</div>
        <div class="nutrition__summary-target">/ ${formatNumber(targetProtein)}g</div>
        <div class="progress-bar" style="height:4px;background:var(--bg-tertiary);border-radius:var(--radius-full);margin-top:0.5rem;overflow:hidden;">
          <div style="width:${proPercent}%;height:100%;background:#2979ff;border-radius:var(--radius-full);transition:width 0.4s ease;"></div>
        </div>
      </div>
      <div class="nutrition__summary-card">
        <div class="nutrition__summary-label">Carbs</div>
        <div class="nutrition__summary-value">${formatNumber(totals.carbs)}g</div>
        <div class="nutrition__summary-target">/ ${formatNumber(targetCarbs)}g</div>
      </div>
      <div class="nutrition__summary-card">
        <div class="nutrition__summary-label">Fats</div>
        <div class="nutrition__summary-value">${formatNumber(totals.fats)}g</div>
        <div class="nutrition__summary-target">/ ${formatNumber(targetFats)}g</div>
      </div>
    </div>

    <div class="nutrition__chart-section">
      <div class="nutrition__chart-wrapper">
        <canvas id="macro-donut-chart"></canvas>
      </div>
      <div class="nutrition__chart-legend">
        <div class="nutrition__chart-legend-item">
          <span class="nutrition__chart-legend-dot" style="background:#2979ff;"></span>
          Protein · ${totals.protein}g
        </div>
        <div class="nutrition__chart-legend-item">
          <span class="nutrition__chart-legend-dot" style="background:#00e676;"></span>
          Carbs · ${totals.carbs}g
        </div>
        <div class="nutrition__chart-legend-item">
          <span class="nutrition__chart-legend-dot" style="background:#ffab00;"></span>
          Fats · ${totals.fats}g
        </div>
      </div>
    </div>

    <div id="meal-sections-container"></div>
  `;

  // Render macro donut — deferred because canvas may not be in DOM yet
  requestAnimationFrame(() => {
    try {
      const canvas = container.querySelector('#macro-donut-chart');
      if (canvas) renderMacroChart(canvas, totals);
    } catch (e) { console.warn('Chart init deferred:', e); }
  });

  // Render meal sections
  const mealContainer = container.querySelector('#meal-sections-container');
  renderMealSections(mealContainer, container);
}

function renderMacroChart(canvas, totals) {
  if (macroChart) { try { macroChart.destroy(); } catch(e) {} macroChart = null; }
  if (!canvas) return;
  // Ensure canvas has dimensions
  if (!canvas.clientWidth) {
    canvas.style.width = '200px';
    canvas.style.height = '200px';
  }

  const hasData = totals.protein + totals.carbs + totals.fats > 0;
  const data = hasData ? [totals.protein * 4, totals.carbs * 4, totals.fats * 9] : [1, 1, 1];
  const bgColors = hasData
    ? ['#2979ff', '#00e676', '#ffab00']
    : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)'];

  macroChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fats'],
      datasets: [{
        data,
        backgroundColor: bgColors,
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: hasData,
          callbacks: {
            label: ctx => {
              const label = ctx.label;
              const cal = ctx.raw;
              let grams = 0;
              if (label === 'Protein') grams = totals.protein;
              else if (label === 'Carbs') grams = totals.carbs;
              else if (label === 'Fats') grams = totals.fats;
              return `${label}: ${Math.round(cal)} kcal (${Math.round(grams)}g)`;
            }
          }
        }
      }
    }
  });
}

function renderMealSections(mealContainer, parentContainer) {
  mealContainer.innerHTML = MEAL_NAMES.map(mealName => {
    const meal = todayEntry.meals.find(m => m.name === mealName) || { name: mealName, foods: [] };
    const mealCals = getMealCalories(meal);
    const foodItems = (meal.foods || []).map((f, fi) => `
      <div class="nutrition__food-item">
        <div>
          <div class="nutrition__food-name">${f.name}</div>
          <div class="nutrition__food-macros">
            ${f.amount || 100}g · ${Math.round(f.calories)} kcal · P:${Math.round(f.protein)}g C:${Math.round(f.carbs)}g F:${Math.round(f.fats)}g
          </div>
        </div>
        <button class="nutrition__food-delete" data-meal="${mealName}" data-food-index="${fi}">×</button>
      </div>
    `).join('');

    return `
      <div class="nutrition__meal-section">
        <div class="nutrition__meal-header">
          <span class="nutrition__meal-name">${mealName}</span>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span class="nutrition__meal-calories">${Math.round(mealCals)} kcal</span>
            <button class="nutrition__add-btn" data-meal="${mealName}" style="width:auto;">Add Food +</button>
          </div>
        </div>
        ${foodItems}
      </div>
    `;
  }).join('');

  // Add food buttons
  mealContainer.querySelectorAll('.nutrition__add-btn').forEach(btn => {
    on(btn, 'click', () => {
      openFoodSearchModal(btn.dataset.meal, parentContainer);
    });
  });

  // Delete food buttons
  mealContainer.querySelectorAll('.nutrition__food-delete').forEach(btn => {
    on(btn, 'click', (e) => {
      e.stopPropagation();
      const mealName = btn.dataset.meal;
      const foodIndex = parseInt(btn.dataset.foodIndex);
      const meal = todayEntry.meals.find(m => m.name === mealName);
      if (meal) {
        meal.foods.splice(foodIndex, 1);
        saveTodayEntry();
        renderTodayTab(parentContainer);
        animateTabContent(parentContainer);
      }
    });
  });
}

function openFoodSearchModal(mealName, parentContainer) {
  try {
    openModal({
      title: `Add Food to ${mealName}`,
      content: `
        <input type="text" class="nutrition__search-input" id="food-search-input" placeholder="Search foods..." autofocus />
        <div class="nutrition__search-results" id="food-search-results"></div>
        <div id="food-amount-section" style="display:none;margin-top:1rem;">
          <div id="food-selected-name" style="font-weight:700;margin-bottom:0.5rem;"></div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <input type="number" class="input" id="food-amount-input" value="100" min="1" style="max-width:100px;" />
            <span class="text-muted">grams</span>
            <button class="btn btn-primary btn-sm" id="food-add-confirm-btn">Add</button>
          </div>
        </div>
      `
    });

    let selectedFood = null;

    setTimeout(() => {
      const searchInput = document.querySelector('#food-search-input');
      const resultsContainer = document.querySelector('#food-search-results');
      const amountSection = document.querySelector('#food-amount-section');

      if (!searchInput) return;

      function doSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) { resultsContainer.innerHTML = ''; return; }
        const results = searchFoods(query).slice(0, 20);

        resultsContainer.innerHTML = results.map((f, i) => `
          <div class="nutrition__search-item" data-food-index="${i}">
            <div>
              <div class="nutrition__search-item-name">${f.name}</div>
              <div class="nutrition__search-item-macros">${f.calories} kcal · P:${f.protein}g per 100g</div>
            </div>
          </div>
        `).join('') || '<p class="text-muted" style="padding:1rem;">No results found.</p>';

        resultsContainer.querySelectorAll('.nutrition__search-item').forEach(item => {
          on(item, 'click', () => {
            const idx = parseInt(item.dataset.foodIndex);
            selectedFood = results[idx];
            document.querySelector('#food-selected-name').textContent = selectedFood.name;
            amountSection.style.display = 'block';
            document.querySelector('#food-amount-input').focus();
          });
        });
      }

      on(searchInput, 'input', doSearch);

      // Confirm add
      const addConfirmBtn = document.querySelector('#food-add-confirm-btn');
      if (addConfirmBtn) {
        on(addConfirmBtn, 'click', () => {
          if (!selectedFood) return;
          const amount = parseFloat(document.querySelector('#food-amount-input').value) || 100;
          const ratio = amount / 100;

          const meal = todayEntry.meals.find(m => m.name === mealName);
          if (meal) {
            meal.foods.push({
              name: selectedFood.name,
              protein: selectedFood.protein * ratio,
              carbs: selectedFood.carbs * ratio,
              fats: selectedFood.fats * ratio,
              calories: selectedFood.calories * ratio,
              amount
            });
            saveTodayEntry();
            unlockAchievement('plate_tracker');
            closeModal();
            renderTodayTab(parentContainer);
            animateTabContent(parentContainer);
          }
        });
      }
    }, 150);
  } catch (e) {
    showToast('Could not open food search');
  }
}

function renderMealPlansTab(container) {
  const calorieOptions = [1500, 1800, 2000, 2200, 2500, 3000];
  let selectedCalories = 2000;
  let selectedType = 'all'; // 'all', 'non-veg', 'vegetarian'

  function render() {
    let filtered = mealPlans || [];
    if (selectedCalories) {
      const byCalories = getMealPlansByCalories?.(selectedCalories) || filtered.filter(p => Math.abs((p.targetCalories || p.calories || 0) - selectedCalories) <= 300);
      if (byCalories.length) filtered = byCalories;
    }
    if (selectedType === 'veg') {
      const byType = getMealPlansByType?.('veg') || filtered.filter(p => p.type === 'veg');
      if (byType.length) filtered = byType;
    } else if (selectedType === 'non-veg') {
      const byType = getMealPlansByType?.('non-veg') || filtered.filter(p => p.type !== 'veg');
      if (byType.length) filtered = byType;
    }

    container.innerHTML = `
      <h3 class="section-title">Meal Plans</h3>
      <div class="nutrition__calorie-chips">
        ${calorieOptions.map(c => `
          <button class="nutrition__calorie-chip ${selectedCalories === c ? 'active' : ''}" data-cal="${c}">${formatNumber(c)} kcal</button>
        `).join('')}
      </div>
      <div class="nutrition__type-toggle">
        <button class="workouts__filter-chip ${selectedType === 'all' ? 'active' : ''}" data-type="all">All</button>
        <button class="workouts__filter-chip ${selectedType === 'non-veg' ? 'active' : ''}" data-type="non-veg">Non-Veg</button>
        <button class="workouts__filter-chip ${selectedType === 'veg' ? 'active' : ''}" data-type="veg">Vegetarian</button>
      </div>
      <div class="nutrition__meal-plan-grid">
        ${filtered.map(plan => {
          const planMeals = (plan.meals || []).map(m => `
            <div style="margin-bottom:0.5rem;">
              <div style="font-weight:600;font-size:0.85rem;">${m.name}</div>
              ${(m.foods || []).map(f => {
                const foodData = getFoodById(f.foodId);
                const displayName = foodData ? foodData.name : (f.name || f.foodId);
                return `<div style="font-size:0.75rem;color:var(--text-muted);padding-left:0.5rem;">${displayName} · ${f.amount || 100}${f.unit || 'g'}</div>`;
              }).join('')}
            </div>
          `).join('');

          return `
            <div class="nutrition__meal-plan-card">
              <div class="nutrition__meal-plan-title">${plan.name}</div>
              <div class="nutrition__meal-plan-meta">
                <span class="badge badge-primary">${formatNumber(plan.targetCalories || plan.calories || 0)} kcal</span>
                <span class="badge ${plan.type === 'vegetarian' ? 'badge-success' : 'badge-info'}">${plan.type || 'Mixed'}</span>
              </div>
              ${planMeals}
              <button class="btn btn-secondary btn-sm" data-plan-id="${plan.id}" style="width:100%;margin-top:1rem;">Apply to Today</button>
            </div>
          `;
        }).join('') || '<p class="text-muted">No meal plans match your filters.</p>'}
      </div>
    `;

    // Calorie chips
    container.querySelectorAll('.nutrition__calorie-chip').forEach(chip => {
      on(chip, 'click', () => {
        selectedCalories = parseInt(chip.dataset.cal);
        render();
        animateTabContent(container);
      });
    });

    // Type toggle
    container.querySelectorAll('[data-type]').forEach(btn => {
      on(btn, 'click', () => {
        selectedType = btn.dataset.type;
        render();
        animateTabContent(container);
      });
    });

    // Apply to today
    container.querySelectorAll('[data-plan-id]').forEach(btn => {
      on(btn, 'click', () => {
        const plan = getMealPlanById?.(btn.dataset.planId) || (mealPlans || []).find(p => p.id === btn.dataset.planId);
        if (plan && plan.meals) {
          loadTodayEntry();
          todayEntry.meals = plan.meals.map(m => ({
            name: m.name,
            foods: (m.foods || []).map(f => {
              const foodData = getFoodById(f.foodId);
              const amount = f.amount || 100;
              const ratio = amount / 100;
              return {
                name: foodData ? foodData.name : (f.name || f.foodId),
                protein: foodData ? foodData.protein * ratio : 0,
                carbs: foodData ? foodData.carbs * ratio : 0,
                fats: foodData ? foodData.fats * ratio : 0,
                calories: foodData ? foodData.calories * ratio : 0,
                amount
              };
            })
          }));
          saveTodayEntry();
          unlockAchievement('plate_tracker');
          showSuccess('Meal plan applied!');

          activeTab = 'today';
          // Re-render the page
          const tabContent = document.querySelector('.nutrition__tab-content') || document.querySelector('#nutrition-tab-content');
          if (tabContent) {
            renderTodayTab(tabContent);
          }
          // Update tab buttons
          document.querySelectorAll('.nutrition__tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === 'today');
          });
        }
      });
    });
  }

  render();
}

function renderFoodDatabaseTab(container) {
  const categories = FOOD_CATEGORIES || [];
  let activeCategory = 'all';
  let searchQuery = '';

  function render() {
    let filtered = foods || [];
    if (searchQuery.length >= 2) {
      filtered = searchFoods(searchQuery);
    } else if (activeCategory !== 'all') {
      filtered = getFoodsByCategory(activeCategory) || filtered.filter(f => f.category === activeCategory);
    }

    container.innerHTML = `
      <h3 class="section-title">Food Database</h3>
      <input type="text" class="nutrition__search-input" id="food-db-search" placeholder="Search foods..." value="${searchQuery}" />
      <div class="workouts__filter-chips" style="margin-bottom:1.5rem;">
        <button class="workouts__filter-chip ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">All</button>
        ${categories.map(c => `
          <button class="workouts__filter-chip ${activeCategory === c ? 'active' : ''}" data-cat="${c}">
            ${c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        `).join('')}
      </div>
      <div class="nutrition__food-grid">
        ${filtered.slice(0, 50).map(f => `
          <div class="nutrition__food-card" data-food-name="${f.name}">
            <div class="nutrition__food-card-name">${f.name}</div>
            ${f.category ? `<span class="badge badge-info" style="margin-bottom:0.5rem;font-size:0.65rem;">${f.category}</span>` : ''}
            <div class="nutrition__food-card-macros">
              <span>🔥 ${f.calories} kcal</span>
              <span>💪 ${f.protein}g P</span>
              <span>🌾 ${f.carbs}g C</span>
              <span>🫒 ${f.fats}g F</span>
            </div>
          </div>
        `).join('') || '<p class="text-muted">No foods found.</p>'}
      </div>
    `;

    // Search
    on(container.querySelector('#food-db-search'), 'input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchQuery.length >= 2) {
        activeCategory = 'all';
      }
      render();
    });

    // Category chips
    container.querySelectorAll('[data-cat]').forEach(chip => {
      on(chip, 'click', () => {
        activeCategory = chip.dataset.cat;
        searchQuery = '';
        render();
        animateTabContent(container);
      });
    });

    // Food card click → detail modal
    container.querySelectorAll('.nutrition__food-card').forEach(card => {
      on(card, 'click', () => {
        const foodName = card.dataset.foodName;
        const food = (foods || []).find(f => f.name === foodName);
        if (!food) return;
        try {
          openModal({
            title: food.name,
            content: `
              <div style="padding:1rem 0;">
                ${food.category ? `<span class="badge badge-info" style="margin-bottom:1rem;">${food.category}</span>` : ''}
                <div class="nutrition__summary" style="margin-top:1rem;">
                  <div class="nutrition__summary-card">
                    <div class="nutrition__summary-label">Calories</div>
                    <div class="nutrition__summary-value">${food.calories}</div>
                    <div class="nutrition__summary-target">per 100g</div>
                  </div>
                  <div class="nutrition__summary-card">
                    <div class="nutrition__summary-label">Protein</div>
                    <div class="nutrition__summary-value">${food.protein}g</div>
                  </div>
                  <div class="nutrition__summary-card">
                    <div class="nutrition__summary-label">Carbs</div>
                    <div class="nutrition__summary-value">${food.carbs}g</div>
                  </div>
                  <div class="nutrition__summary-card">
                    <div class="nutrition__summary-label">Fats</div>
                    <div class="nutrition__summary-value">${food.fats}g</div>
                  </div>
                </div>
              </div>
            `
          });
        } catch (e) { /* modal optional */ }
      });
    });
  }

  render();
}

function renderWaterTab(container) {
  loadTodayEntry();
  const glasses = todayEntry.waterGlasses || 0;
  const target = 8;
  const percent = Math.min((glasses / target) * 100, 100).toFixed(0);

  // SVG progress ring
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  container.innerHTML = `
    <div class="nutrition__water">
      <div class="nutrition__water-count">${glasses}</div>
      <div class="nutrition__water-label">of ${target} glasses</div>

      <div class="nutrition__water-glasses">
        ${Array.from({ length: target }, (_, i) => `
          <div class="nutrition__water-glass ${i < glasses ? 'filled' : ''}" data-glass-index="${i}">
            💧
          </div>
        `).join('')}
      </div>

      <svg width="180" height="180" viewBox="0 0 180 180" style="transform:rotate(-90deg);">
        <circle cx="90" cy="90" r="${radius}" fill="none" stroke="var(--bg-tertiary)" stroke-width="8" />
        <circle cx="90" cy="90" r="${radius}"
          fill="none"
          stroke="var(--accent)"
          stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          style="transition: stroke-dashoffset 0.6s ease;"
        />
      </svg>
      <div style="margin-top:-2rem;font-size:1.2rem;font-weight:700;font-family:var(--font-mono);color:var(--accent);">
        ${percent}%
      </div>
    </div>
  `;

  // Glass click handlers
  container.querySelectorAll('.nutrition__water-glass').forEach(glass => {
    on(glass, 'click', () => {
      const index = parseInt(glass.dataset.glassIndex);
      // Toggle: if clicking a filled glass, unfill from it; if unfilled, fill up to it
      if (index < todayEntry.waterGlasses) {
        todayEntry.waterGlasses = index;
      } else {
        todayEntry.waterGlasses = index + 1;
      }
      saveTodayEntry();
      if (todayEntry.waterGlasses >= 8) {
        unlockAchievement('hydration_hero');
      }
      renderWaterTab(container);

      // Animate the clicked glass
      gsap.fromTo(glass, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    });
  });
}

// ── GSAP animation ───────────────────────────────────────────────────────────

function animateTabContent(container) {
  gsap.fromTo(
    container.children,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default async function nutritionPage() {
  const TABS = ['today', 'meal-plans', 'food-database', 'water'];
  const TAB_LABELS = { 'today': 'Today', 'meal-plans': 'Meal Plans', 'food-database': 'Food Database', 'water': 'Water' };

  const page = html(`
    <div class="page">
      <div id="nutrition-nav-container"></div>
      <div class="page-content">
        <div class="nutrition__tabs" id="nutrition-tabs">
          ${TABS.map(t => `
            <button class="nutrition__tab ${t === activeTab ? 'active' : ''}" data-tab="${t}">
              ${TAB_LABELS[t]}
            </button>
          `).join('')}
        </div>
        <div class="workouts__tab-content" id="nutrition-tab-content"></div>
      </div>
    </div>
  `);

  // Insert navbar
  page.querySelector('#nutrition-nav-container').appendChild(createNavbar());

  const tabContent = page.querySelector('#nutrition-tab-content');
  const tabButtons = page.querySelectorAll('.nutrition__tab');

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Destroy chart if switching away
    if (macroChart && tabName !== 'today') {
      macroChart.destroy();
      macroChart = null;
    }

    tabContent.innerHTML = '';

    switch (tabName) {
      case 'today':         renderTodayTab(tabContent); break;
      case 'meal-plans':    renderMealPlansTab(tabContent); break;
      case 'food-database': renderFoodDatabaseTab(tabContent); break;
      case 'water':         renderWaterTab(tabContent); break;
    }

    animateTabContent(tabContent);
  }

  tabButtons.forEach(btn => {
    on(btn, 'click', () => switchTab(btn.dataset.tab));
  });

  // Initial render — deferred to avoid Chart.js issues on detached DOM
  setTimeout(() => switchTab(activeTab), 0);

  return page;
}
