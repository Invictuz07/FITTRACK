import { html, on } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import {
  getUser, getStats, getWeightLog, addWeightEntry,
  getMeasurements, addMeasurement, getPRs, updatePR,
  getWorkouts, getNutritionLog, getSettings
} from '../store.js';
import { formatDate, formatNumber, getTodayISO, generateId } from '../utils/formatters.js';
import { createNavbar } from '../components/navbar.js';
import { openModal, closeModal } from '../components/modal.js';
import { showSuccess } from '../components/toast.js';
import { createHeatmap } from '../components/heatmap.js';
import { initScrollReveal, addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend, RadarController, RadialLinearScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend, RadarController, RadialLinearScale);

// ── State ────────────────────────────────────────────────────────────────────
let activeTab = 'weight';
let weightChart = null;
let measureChart = null;

// ── Tab Renderers ────────────────────────────────────────────────────────────

function renderWeightTab(container) {
  const weightLog = getWeightLog() || [];
  const user = getUser() || {};
  const startWeight = user.weight || (weightLog.length > 0 ? weightLog[0].weight : 0);
  const currentWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : startWeight;
  const change = currentWeight - startWeight;
  const changeColor = change < 0 ? 'var(--success)' : change > 0 ? 'var(--warning)' : 'var(--text-muted)';
  const changeSign = change > 0 ? '+' : '';

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
      <div>
        <h3 class="section-title" style="margin-bottom:0;">Weight Tracking</h3>
        <p class="text-muted" style="font-size:0.85rem;">Track your weight journey over time</p>
      </div>
      <button class="btn btn-primary" id="log-weight-btn">+ Log Weight</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:2rem;">
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">Current</div>
        <div class="stat-card__value" style="font-size:1.75rem;">${formatNumber(currentWeight, 1)}</div>
        <div class="stat-card__unit">kg</div>
      </div>
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">Starting</div>
        <div class="stat-card__value" style="font-size:1.75rem;">${formatNumber(startWeight, 1)}</div>
        <div class="stat-card__unit">kg</div>
      </div>
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">Change</div>
        <div class="stat-card__value" style="font-size:1.75rem;color:${changeColor};">${changeSign}${formatNumber(change, 1)}</div>
        <div class="stat-card__unit">kg</div>
      </div>
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">Entries</div>
        <div class="stat-card__value" style="font-size:1.75rem;">${weightLog.length}</div>
        <div class="stat-card__unit">logged</div>
      </div>
    </div>

    <div class="card" style="padding:1.5rem;margin-bottom:2rem;">
      <div style="position:relative;height:280px;">
        <canvas id="weight-line-chart"></canvas>
      </div>
    </div>

    ${weightLog.length > 0 ? `
      <h3 class="section-title">Recent Entries</h3>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        ${weightLog.slice().reverse().slice(0, 10).map(entry => `
          <div class="card" style="padding:0.75rem 1rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:600;font-size:0.9rem;">${formatDate(entry.date)}</div>
              ${entry.notes ? `<div class="text-muted" style="font-size:0.75rem;">${entry.notes}</div>` : ''}
            </div>
            <div style="font-weight:800;font-family:var(--font-mono);font-size:1.1rem;">${formatNumber(entry.weight, 1)} kg</div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="text-align:center;padding:2rem;">
        <div style="font-size:3rem;margin-bottom:0.75rem;">⚖️</div>
        <p class="text-muted">No weight entries yet. Start tracking to see your progress chart!</p>
      </div>
    `}
  `;

  // Render chart
  requestAnimationFrame(() => {
    const canvas = container.querySelector('#weight-line-chart');
    if (canvas) renderWeightChart(canvas, weightLog);
  });

  // Log weight button
  on(container.querySelector('#log-weight-btn'), 'click', () => {
    openLogWeightModal(container);
  });
}

function renderWeightChart(canvas, weightLog) {
  if (weightChart) { try { weightChart.destroy(); } catch(e) {} weightChart = null; }
  if (!canvas || weightLog.length === 0) return;

  const labels = weightLog.map(e => {
    const d = new Date(e.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const values = weightLog.map(e => e.weight);

  weightChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight (kg)',
        data: values,
        borderColor: '#2979ff',
        backgroundColor: 'rgba(41, 121, 255, 0.1)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#2979ff',
        pointBorderColor: '#0a0a0a',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'var(--text-muted)', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'var(--text-muted)', font: { size: 10 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17,17,17,0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleFont: { weight: '700' },
          bodyFont: { family: 'JetBrains Mono' },
          callbacks: {
            label: ctx => `${ctx.raw} kg`
          }
        }
      }
    }
  });
}

function openLogWeightModal(parentContainer) {
  try {
    openModal({
      title: '⚖️ Log Weight',
      content: `
        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input type="number" class="input" id="weight-modal-input" step="0.1" min="20" max="300" placeholder="e.g. 75.5" autofocus />
        </div>
        <div class="form-group">
          <label class="form-label">Note (optional)</label>
          <input type="text" class="input" id="weight-modal-note" placeholder="e.g. morning, post-workout" />
        </div>
        <button class="btn btn-primary" id="weight-modal-save" style="width:100%;margin-top:0.5rem;">Save Entry</button>
      `
    });
    setTimeout(() => {
      const saveBtn = document.querySelector('#weight-modal-save');
      if (saveBtn) {
        on(saveBtn, 'click', () => {
          const weight = parseFloat(document.querySelector('#weight-modal-input')?.value);
          const notes = document.querySelector('#weight-modal-note')?.value || '';
          if (!weight || weight < 20 || weight > 300) return;
          addWeightEntry({ date: getTodayISO(), weight, notes });
          closeModal();
          showSuccess('Weight logged!');
          renderWeightTab(parentContainer);
          animateTabContent(parentContainer);
        });
      }
    }, 150);
  } catch(e) {}
}

// ── Measurements Tab ────────────────────────────────────────────────────────

function renderMeasurementsTab(container) {
  const measurements = getMeasurements() || [];
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const first = measurements.length > 0 ? measurements[0] : null;

  const fields = [
    { key: 'chest', label: 'Chest', icon: '📏' },
    { key: 'arms', label: 'Arms', icon: '💪' },
    { key: 'waist', label: 'Waist', icon: '📐' },
    { key: 'thighs', label: 'Thighs', icon: '🦵' }
  ];

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
      <div>
        <h3 class="section-title" style="margin-bottom:0;">Body Measurements</h3>
        <p class="text-muted" style="font-size:0.85rem;">Track your body composition changes</p>
      </div>
      <button class="btn btn-primary" id="log-measure-btn">+ Log Measurements</button>
    </div>

    ${latest ? `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:2rem;">
        ${fields.map(f => {
          const currentVal = latest[f.key] || 0;
          const firstVal = first?.[f.key] || currentVal;
          const diff = currentVal - firstVal;
          const diffColor = diff < 0 ? 'var(--success)' : diff > 0 ? 'var(--warning)' : 'var(--text-muted)';
          return `
            <div class="stat-card" style="padding:1.25rem;">
              <div class="stat-card__label">${f.icon} ${f.label}</div>
              <div class="stat-card__value" style="font-size:1.5rem;">${formatNumber(currentVal, 1)}</div>
              <div class="stat-card__unit" style="color:${diffColor};">${diff > 0 ? '+' : ''}${formatNumber(diff, 1)} cm</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="card" style="padding:1.5rem;margin-bottom:2rem;">
        <h4 style="margin:0 0 1rem 0;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);">Progress Comparison</h4>
        <div style="max-width:350px;margin:0 auto;">
          <canvas id="measure-radar-chart"></canvas>
        </div>
      </div>
    ` : ''}

    ${measurements.length > 0 ? `
      <h3 class="section-title">History</h3>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border);">
              <th style="text-align:left;padding:0.5rem;color:var(--text-muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;">Date</th>
              ${fields.map(f => `<th style="text-align:center;padding:0.5rem;color:var(--text-muted);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;">${f.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${measurements.slice().reverse().slice(0, 10).map(m => `
              <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:0.5rem;font-weight:600;">${formatDate(m.date)}</td>
                ${fields.map(f => `<td style="text-align:center;padding:0.5rem;font-family:var(--font-mono);">${m[f.key] || '—'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : `
      <div style="text-align:center;padding:2rem;">
        <div style="font-size:3rem;margin-bottom:0.75rem;">📏</div>
        <p class="text-muted">No measurements logged yet. Start tracking to see your body composition radar chart!</p>
      </div>
    `}
  `;

  // Render radar chart
  if (latest && first) {
    requestAnimationFrame(() => {
      const canvas = container.querySelector('#measure-radar-chart');
      if (canvas) renderMeasureChart(canvas, first, latest, fields);
    });
  }

  // Log button
  on(container.querySelector('#log-measure-btn'), 'click', () => {
    openMeasureModal(container, fields);
  });
}

function renderMeasureChart(canvas, first, latest, fields) {
  if (measureChart) { try { measureChart.destroy(); } catch(e) {} measureChart = null; }
  if (!canvas) return;

  measureChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: fields.map(f => f.label),
      datasets: [
        {
          label: 'First',
          data: fields.map(f => first[f.key] || 0),
          borderColor: 'rgba(255,255,255,0.3)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(255,255,255,0.3)'
        },
        {
          label: 'Latest',
          data: fields.map(f => latest[f.key] || 0),
          borderColor: '#2979ff',
          backgroundColor: 'rgba(41, 121, 255, 0.15)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#2979ff'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          grid: { color: 'rgba(255,255,255,0.08)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          ticks: { display: false },
          pointLabels: { color: 'var(--text-secondary)', font: { size: 11, weight: '600' } }
        }
      },
      plugins: {
        legend: {
          labels: { color: 'var(--text-muted)', font: { size: 11 } }
        }
      }
    }
  });
}

function openMeasureModal(parentContainer, fields) {
  try {
    openModal({
      title: '📏 Log Measurements',
      content: `
        ${fields.map(f => `
          <div class="form-group">
            <label class="form-label">${f.icon} ${f.label} (cm)</label>
            <input type="number" class="input" id="measure-${f.key}" step="0.1" min="0" placeholder="cm" />
          </div>
        `).join('')}
        <button class="btn btn-primary" id="measure-save-btn" style="width:100%;margin-top:0.5rem;">Save Measurements</button>
      `
    });
    setTimeout(() => {
      const saveBtn = document.querySelector('#measure-save-btn');
      if (saveBtn) {
        on(saveBtn, 'click', () => {
          const entry = { date: getTodayISO() };
          let hasData = false;
          fields.forEach(f => {
            const val = parseFloat(document.querySelector(`#measure-${f.key}`)?.value);
            if (val > 0) { entry[f.key] = val; hasData = true; }
          });
          if (!hasData) return;
          addMeasurement(entry);
          closeModal();
          showSuccess('Measurements saved!');
          renderMeasurementsTab(parentContainer);
          animateTabContent(parentContainer);
        });
      }
    }, 150);
  } catch(e) {}
}

// ── Personal Records Tab ────────────────────────────────────────────────────

function renderPRsTab(container) {
  const prs = getPRs() || {};

  const lifts = [
    { key: 'benchPress', name: 'Bench Press', icon: '🏋️' },
    { key: 'squat', name: 'Squat', icon: '🦵' },
    { key: 'deadlift', name: 'Deadlift', icon: '💀' },
    { key: 'overheadPress', name: 'Overhead Press', icon: '🙌' }
  ];

  container.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <h3 class="section-title" style="margin-bottom:0;">Personal Records</h3>
      <p class="text-muted" style="font-size:0.85rem;">Track your all-time best lifts</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin-bottom:2rem;">
      ${lifts.map(lift => {
        const pr = prs[lift.key];
        const weight = pr?.weight || pr || 0;
        const date = pr?.date || '';
        return `
          <div class="card" style="padding:1.5rem;text-align:center;position:relative;overflow:hidden;">
            <div style="font-size:2.5rem;margin-bottom:0.75rem;">${lift.icon}</div>
            <div style="font-weight:700;font-size:1rem;margin-bottom:0.5rem;">${lift.name}</div>
            <div style="font-size:2rem;font-weight:800;font-family:var(--font-mono);color:${weight > 0 ? 'var(--accent)' : 'var(--text-muted)'};">
              ${weight > 0 ? `${formatNumber(weight, 1)} kg` : '—'}
            </div>
            ${date ? `<div class="text-muted" style="font-size:0.75rem;margin-top:0.25rem;">${formatDate(date)}</div>` : ''}
            <button class="btn btn-secondary btn-sm" data-lift="${lift.key}" data-lift-name="${lift.name}" style="width:100%;margin-top:1rem;">
              ${weight > 0 ? 'Update PR' : 'Set PR'}
            </button>
            ${weight > 0 ? '<div style="position:absolute;top:0;right:0;width:60px;height:60px;background:linear-gradient(135deg,transparent 50%,var(--accent-soft) 50%);"><span style="position:absolute;top:8px;right:8px;font-size:0.8rem;">🏆</span></div>' : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div class="card" style="padding:1.5rem;">
      <h4 style="margin:0 0 1rem 0;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);">Custom Lifts</h4>
      <div id="custom-prs" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:1rem;">
        ${Object.entries(prs).filter(([key]) => !lifts.find(l => l.key === key)).map(([key, val]) => {
          const weight = val?.weight || val || 0;
          return `
            <div class="stat-card" style="padding:1rem;">
              <div class="stat-card__label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div class="stat-card__value" style="font-size:1.25rem;">${formatNumber(weight, 1)}</div>
              <div class="stat-card__unit">kg</div>
            </div>
          `;
        }).join('') || '<p class="text-muted" style="font-size:0.85rem;">No custom lifts yet.</p>'}
      </div>
      <button class="btn btn-secondary" id="add-custom-pr-btn" style="width:100%;">+ Add Custom Lift PR</button>
    </div>
  `;

  // PR buttons
  container.querySelectorAll('[data-lift]').forEach(btn => {
    on(btn, 'click', () => {
      openPRModal(btn.dataset.lift, btn.dataset.liftName, container);
    });
  });

  // Custom PR button
  on(container.querySelector('#add-custom-pr-btn'), 'click', () => {
    openCustomPRModal(container);
  });
}

function openPRModal(liftKey, liftName, parentContainer) {
  try {
    openModal({
      title: `🏆 Update ${liftName} PR`,
      content: `
        <div class="form-group">
          <label class="form-label">New PR Weight (kg)</label>
          <input type="number" class="input" id="pr-weight-input" step="0.5" min="0" placeholder="e.g. 100" autofocus />
        </div>
        <button class="btn btn-primary" id="pr-save-btn" style="width:100%;">Save PR 🏆</button>
      `
    });
    setTimeout(() => {
      const saveBtn = document.querySelector('#pr-save-btn');
      if (saveBtn) {
        on(saveBtn, 'click', () => {
          const weight = parseFloat(document.querySelector('#pr-weight-input')?.value);
          if (!weight || weight <= 0) return;
          updatePR(liftKey, weight);
          closeModal();
          showSuccess(`New ${liftName} PR: ${weight} kg! 🏆`);

          // Celebration animation
          gsap.fromTo(parentContainer, { scale: 1.02 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });

          renderPRsTab(parentContainer);
          animateTabContent(parentContainer);
        });
      }
    }, 150);
  } catch(e) {}
}

function openCustomPRModal(parentContainer) {
  try {
    openModal({
      title: '+ Custom Lift PR',
      content: `
        <div class="form-group">
          <label class="form-label">Lift Name</label>
          <input type="text" class="input" id="custom-pr-name" placeholder="e.g. Barbell Curl" autofocus />
        </div>
        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input type="number" class="input" id="custom-pr-weight" step="0.5" min="0" placeholder="e.g. 40" />
        </div>
        <button class="btn btn-primary" id="custom-pr-save" style="width:100%;">Save</button>
      `
    });
    setTimeout(() => {
      const saveBtn = document.querySelector('#custom-pr-save');
      if (saveBtn) {
        on(saveBtn, 'click', () => {
          const name = document.querySelector('#custom-pr-name')?.value?.trim();
          const weight = parseFloat(document.querySelector('#custom-pr-weight')?.value);
          if (!name || !weight || weight <= 0) return;
          const key = name.replace(/\s+/g, '').replace(/^./, c => c.toLowerCase());
          updatePR(key, weight);
          closeModal();
          showSuccess(`${name} PR set: ${weight} kg!`);
          renderPRsTab(parentContainer);
          animateTabContent(parentContainer);
        });
      }
    }, 150);
  } catch(e) {}
}

// ── Consistency Tab ─────────────────────────────────────────────────────────

function renderConsistencyTab(container) {
  const workouts = getWorkouts() || [];
  const nutritionLog = getNutritionLog() || [];

  // Build activity data for heatmap
  const activityMap = {};
  workouts.forEach(w => {
    const d = w.date;
    if (!d) return;
    activityMap[d] = Math.min((activityMap[d] || 0) + 2, 3); // workouts = high intensity
  });
  nutritionLog.forEach(n => {
    const d = n.date;
    if (!d) return;
    activityMap[d] = Math.min((activityMap[d] || 0) + 1, 3); // nutrition = medium intensity
  });

  const heatmapData = Object.entries(activityMap).map(([date, intensity]) => ({ date, intensity }));

  // Calculate streaks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDates = new Set(Object.keys(activityMap));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const checkDate = new Date(today);

  // Current streak (backwards from today)
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (activityDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Longest streak (scan all dates)
  const sortedDates = [...activityDates].sort();
  tempStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr - prev) / (24 * 60 * 60 * 1000);
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  const totalActiveDays = activityDates.size;
  const totalWorkouts = workouts.length;

  container.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <h3 class="section-title" style="margin-bottom:0;">Consistency Calendar</h3>
      <p class="text-muted" style="font-size:0.85rem;">Your activity over the past year</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:2rem;">
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">🔥 Current Streak</div>
        <div class="stat-card__value" style="font-size:1.75rem;color:var(--accent);">${currentStreak}</div>
        <div class="stat-card__unit">days</div>
      </div>
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">🏆 Longest Streak</div>
        <div class="stat-card__value" style="font-size:1.75rem;">${longestStreak}</div>
        <div class="stat-card__unit">days</div>
      </div>
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">📅 Active Days</div>
        <div class="stat-card__value" style="font-size:1.75rem;">${totalActiveDays}</div>
        <div class="stat-card__unit">total</div>
      </div>
      <div class="stat-card" style="padding:1.25rem;">
        <div class="stat-card__label">🏋️ Workouts</div>
        <div class="stat-card__value" style="font-size:1.75rem;">${totalWorkouts}</div>
        <div class="stat-card__unit">completed</div>
      </div>
    </div>

    <div class="card" style="padding:1.5rem;margin-bottom:2rem;">
      <div id="heatmap-container"></div>
      <div style="display:flex;align-items:center;gap:0.5rem;margin-top:1rem;font-size:0.75rem;color:var(--text-muted);">
        <span>Less</span>
        <div style="width:12px;height:12px;background:var(--bg-tertiary);border-radius:3px;"></div>
        <div style="width:12px;height:12px;background:rgba(41,121,255,0.25);border-radius:3px;"></div>
        <div style="width:12px;height:12px;background:rgba(41,121,255,0.55);border-radius:3px;"></div>
        <div style="width:12px;height:12px;background:var(--accent);border-radius:3px;"></div>
        <span>More</span>
      </div>
    </div>
  `;

  // Render heatmap
  const heatmapContainer = container.querySelector('#heatmap-container');
  if (heatmapContainer) {
    const heatmap = createHeatmap({
      data: heatmapData,
      weeks: 52,
      onCellClick: (date, intensity) => {
        const label = intensity === 0 ? 'No activity' : intensity === 1 ? 'Light activity' : intensity === 2 ? 'Moderate' : 'Intense';
        showSuccess(`${formatDate(date)}: ${label}`);
      }
    });
    heatmapContainer.appendChild(heatmap);
  }
}

// ── GSAP animation ───────────────────────────────────────────────────────────

function animateTabContent(container) {
  gsap.fromTo(
    container.children,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
  );

  // Auto-apply ripples to buttons
  container.querySelectorAll('.btn-primary, .btn-secondary, .btn, .workouts__tab').forEach(btn => {
    btn.classList.add('ripple-container');
    on(btn, 'click', addRipple);
  });
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default async function progressPage() {
  const TABS = ['weight', 'measurements', 'prs', 'consistency'];
  const TAB_LABELS = { 'weight': '⚖️ Weight', 'measurements': '📏 Body', 'prs': '🏆 PRs', 'consistency': '🔥 Streak' };

  const page = html(`
    <div class="page">
      <div id="progress-nav-container"></div>
      <div class="page-content">
        <div class="ambient-orb ambient-orb--blue"></div>
        <div class="ambient-orb ambient-orb--purple"></div>
        
        <div class="workouts__tabs reveal" id="progress-tabs">
          ${TABS.map(t => `
            <button class="workouts__tab ${t === activeTab ? 'active' : ''}" data-tab="${t}">
              ${TAB_LABELS[t]}
            </button>
          `).join('')}
        </div>
        <div class="workouts__tab-content" id="progress-tab-content"></div>
      </div>
    </div>
  `);

  page.querySelector('#progress-nav-container').appendChild(createNavbar());

  const tabContent = page.querySelector('#progress-tab-content');
  const tabButtons = page.querySelectorAll('.workouts__tab');

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Destroy charts if switching away
    if (weightChart && tabName !== 'weight') { try { weightChart.destroy(); } catch(e) {} weightChart = null; }
    if (measureChart && tabName !== 'measurements') { try { measureChart.destroy(); } catch(e) {} measureChart = null; }

    tabContent.innerHTML = '';

    switch (tabName) {
      case 'weight': renderWeightTab(tabContent); break;
      case 'measurements': renderMeasurementsTab(tabContent); break;
      case 'prs': renderPRsTab(tabContent); break;
      case 'consistency': renderConsistencyTab(tabContent); break;
    }

    animateTabContent(tabContent);
  }

  tabButtons.forEach(btn => {
    on(btn, 'click', () => switchTab(btn.dataset.tab));
  });

  // Deferred render
  setTimeout(() => switchTab(activeTab), 0);

  const cleanupReveal = initScrollReveal(page);
  page.cleanup = () => {
    cleanupReveal();
    if (weightChart) { try { weightChart.destroy(); } catch(e) {} }
    if (measureChart) { try { measureChart.destroy(); } catch(e) {} }
  };

  return page;
}
