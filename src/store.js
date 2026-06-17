import { getTodayISO } from './utils/formatters.js';

// ── Private helpers ──────────────────────────────────────────────────────────

const PREFIX = 'fittrack_';

function _get(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function _set(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// ── User ─────────────────────────────────────────────────────────────────────

export function getUser() {
  return _get('user') || null;
}

export function saveUser(data) {
  _set('user', data);
}

export function hasUser() {
  return _get('user') !== null;
}

// ── Stats ────────────────────────────────────────────────────────────────────

export function getStats() {
  return _get('stats') || {};
}

export function saveStats(data) {
  _set('stats', data);
}

// ── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  theme: 'dark',
  units: 'metric',
  soundEnabled: true
};

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(_get('settings') || {}) };
}

export function saveSettings(data) {
  _set('settings', data);
}

// ── Workouts ─────────────────────────────────────────────────────────────────

export function getWorkouts() {
  return _get('workouts') || [];
}

export function addWorkout(workout) {
  const workouts = getWorkouts();
  workouts.push(workout);
  _set('workouts', workouts);
}

export function getWorkoutsByDate(date) {
  let target;
  if (typeof date === 'string') {
    target = date;
  } else {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    target = `${year}-${month}-${day}`;
  }
  return getWorkouts().filter(w => {
    const d = w.date || (w.createdAt && w.createdAt.split('T')[0]);
    return d === target;
  });
}

// ── Nutrition ────────────────────────────────────────────────────────────────

export function getNutritionLog() {
  return _get('nutrition') || [];
}

export function addNutritionEntry(entry) {
  const log = getNutritionLog();
  log.push(entry);
  _set('nutrition', log);
}

export function getTodayNutrition() {
  const today = getTodayISO();
  const log = getNutritionLog();
  const entry = log.find(e => e.date === today);
  if (!entry) return null;
  
  let calories = 0, protein = 0, carbs = 0, fats = 0;
  (entry.meals || []).forEach(meal => {
    (meal.foods || []).forEach(food => {
      calories += food.calories || 0;
      protein += food.protein || 0;
      carbs += food.carbs || 0;
      fats += food.fats || 0;
    });
  });
  
  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    water: entry.waterGlasses || entry.water || 0,
    workoutDone: entry.workoutDone || false
  };
}

export function saveNutritionLog(log) {
  _set('nutrition', log);
}

// ── Weight Log ───────────────────────────────────────────────────────────────

export function getWeightLog() {
  return _get('weightLog') || [];
}

export function addWeightEntry(entry) {
  const log = getWeightLog();
  log.push(entry);
  _set('weightLog', log);
}

// ── Measurements ─────────────────────────────────────────────────────────────

export function getMeasurements() {
  return _get('measurements') || [];
}

export function addMeasurement(entry) {
  const measurements = getMeasurements();
  measurements.push(entry);
  _set('measurements', measurements);
}

// ── Personal Records ─────────────────────────────────────────────────────────

export function getPRs() {
  return _get('prs') || {};
}

export function updatePR(lift, weight) {
  const prs = getPRs();
  if (!prs[lift] || weight > prs[lift]) {
    prs[lift] = weight;
    _set('prs', prs);
    unlockAchievement('pr_crusher');
  }
}

// ── Achievements ─────────────────────────────────────────────────────────────

export function getAchievements() {
  return _get('achievements') || [];
}

export function unlockAchievement(id) {
  const achievements = getAchievements();
  if (!achievements.includes(id)) {
    achievements.push(id);
    _set('achievements', achievements);
    
    // Auto show toast notification when achievement is unlocked
    try {
      import('./data/achievements.js').then(m => {
        const ach = m.ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
          import('./components/toast.js').then(t => {
            t.showToast({
              message: `Achievement Unlocked: ${ach.name}! ${ach.icon}`,
              type: 'achievement',
              duration: 5000
            });
          });
        }
      });
    } catch (err) {
      console.warn('Toast import delayed:', err);
    }
  }
}

// ── Streak ───────────────────────────────────────────────────────────────────

export function getStreak() {
  const workouts = getWorkouts();
  if (workouts.length === 0) return 0;

  // Collect unique workout dates as YYYY-MM-DD strings
  const dateSet = new Set(
    workouts.map(w => {
      const d = w.date || (w.createdAt && w.createdAt.split('T')[0]);
      return d;
    }).filter(Boolean)
  );

  // Build sorted array of dates descending
  const sortedDates = [...dateSet].sort().reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  // Streak must include today or yesterday to be active
  if (sortedDates[0] !== todayISO && sortedDates[0] !== yesterdayISO) {
    return 0;
  }

  let streak = 1;
  let checkDate = new Date(sortedDates[0]);

  for (let i = 1; i < sortedDates.length; i++) {
    const expected = new Date(checkDate);
    expected.setDate(expected.getDate() - 1);
    const expectedISO = expected.toISOString().split('T')[0];

    if (sortedDates[i] === expectedISO) {
      streak++;
      checkDate = expected;
    } else {
      break;
    }
  }

  return streak;
}

// ── Utility ──────────────────────────────────────────────────────────────────

const ALL_KEYS = [
  'user', 'stats', 'settings', 'workouts', 'nutrition',
  'weightLog', 'measurements', 'prs', 'achievements',
  'ai_settings', 'chat_history'
];

export function exportAllData() {
  const data = {};
  for (const key of ALL_KEYS) {
    const val = _get(key);
    if (val !== null) {
      data[key] = val;
    }
  }
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid data format: expected an object');
    }
    for (const key of ALL_KEYS) {
      if (key in data) {
        _set(key, data[key]);
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function clearAllData() {
  for (const key of ALL_KEYS) {
    localStorage.removeItem(PREFIX + key);
  }
}

// ── AI Settings ─────────────────────────────────────────────────
export function getAISettings() {
  return _get('ai_settings') || { apiKey: '', model: 'gemini-2.0-flash', provider: 'gemini' };
}

export function saveAISettings(settings) {
  _set('ai_settings', settings);
}

export function getChatHistory() {
  return _get('chat_history') || [];
}

export function saveChatHistory(history) {
  // Keep last 50 messages to avoid localStorage bloat
  const trimmed = history.slice(-50);
  _set('chat_history', trimmed);
}
