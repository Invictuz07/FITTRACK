import { html, qs, qsa, on } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { getWorkouts, addWorkout, getSettings, getUser, getStats, unlockAchievement, getStreak } from '../store.js';
import { formatDate, getTodayISO, generateId } from '../utils/formatters.js';
import { createNavbar } from '../components/navbar.js';
import { openModal, closeModal } from '../components/modal.js';
import { createTimerModal } from '../components/timer.js';
import { showToast, showSuccess } from '../components/toast.js';
import { initScrollReveal, addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';
import workoutPlans, { getPlanById, PLAN_IDS } from '../data/workoutPlans.js';
import exercises, { getExercisesByMuscle, getExerciseById, MUSCLE_GROUPS } from '../data/exercises.js';

// ── State ────────────────────────────────────────────────────────────────────
let selectedPlanId = PLAN_IDS?.[0] || 'ppl';
let activeTab = 'recommend';
let activeWorkout = null;   // { plan, dayIndex, exercises, startTime, currentExerciseIndex, currentSetIndex, setsCompleted }
let timerInterval = null;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDayOfWeek() {
  return (new Date().getDay() + 6) % 7; // 0 = Mon … 6 = Sun
}

function formatDuration(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function getSelectedPlan() {
  return getPlanById(selectedPlanId) || Object.values(workoutPlans)[0];
}

function getTodayWorkout() {
  const plan = getSelectedPlan();
  if (!plan) return null;
  const dayIndex = getDayOfWeek();
  const daySchedule = plan.schedule?.[dayIndex];
  return daySchedule || null;
}

// ── Tab Renderers ────────────────────────────────────────────────────────────

function renderPlansTab(container) {
  const plan = getSelectedPlan();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = getDayOfWeek();

  container.innerHTML = `
    <h3 class="section-title">Choose Your Plan</h3>
    <div class="workouts__plans-grid">
      ${Object.values(workoutPlans).map(p => `
        <div class="workouts__plan-card ${p.id === selectedPlanId ? 'selected' : ''}" data-plan-id="${p.id}">
          <div class="workouts__plan-name">${p.name}</div>
          <div class="workouts__plan-days">${p.daysPerWeek} days/week</div>
          <p class="workouts__plan-desc">${p.description}</p>
          <button class="btn ${p.id === selectedPlanId ? 'btn-primary' : 'btn-secondary'} btn-sm" style="margin-top:1rem;width:100%">
            ${p.id === selectedPlanId ? '✓ Selected' : 'Select Plan'}
          </button>
        </div>
      `).join('')}
    </div>

    <h3 class="section-title">Weekly Schedule</h3>
    <div class="workouts__schedule">
      ${dayNames.map((name, i) => {
        const dayData = plan?.schedule?.[i];
        const isRest = !dayData || !dayData.exercises || dayData.exercises.length === 0;
        return `
          <div class="workouts__schedule-day ${i === todayIndex ? 'today' : ''} ${isRest ? 'rest' : ''}">
            <div class="workouts__schedule-day-name">${name}</div>
            <div class="workouts__schedule-day-label">${isRest ? 'Rest' : (dayData?.label || '')}</div>
            <div class="workouts__schedule-day-focus">${isRest ? '😴' : (dayData?.focus || '')}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Plan card click
  container.querySelectorAll('.workouts__plan-card').forEach(card => {
    on(card, 'click', () => {
      selectedPlanId = card.dataset.planId;
      renderPlansTab(container);
      animateTabContent(container);
    });
  });
}

function renderTodayTab(container, switchTab) {
  const dayData = getTodayWorkout();
  const plan = getSelectedPlan();

  if (!dayData || !dayData.exercises || dayData.exercises.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;">
        <div style="font-size:4rem;margin-bottom:1rem;">😴</div>
        <h3 class="section-title">Rest Day</h3>
        <p class="text-muted" style="max-width:400px;margin:0 auto;">
          Recovery is when your muscles grow. Stay hydrated, stretch, and come back stronger tomorrow!
        </p>
      </div>
    `;
    return;
  }

  const exList = (dayData.exercises || []).map(ex => {
    const exerciseData = getExerciseById?.(ex.exerciseId) || ex;
    return `
      <div class="workouts__exercise-item">
        <div>
          <div class="workouts__exercise-name">${exerciseData.name || ex.exerciseId}</div>
          <div class="workouts__exercise-detail">${ex.sets || 3}×${ex.reps || 10} · ${ex.rest || 60}s rest</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <h3 class="section-title">${dayData.label || 'Today\'s Workout'}</h3>
      <p class="text-muted">${dayData.focus || plan.name}</p>
    </div>
    <div class="workouts__exercise-list">
      ${exList || '<p class="text-muted">No exercises configured for today.</p>'}
    </div>
    ${dayData.exercises?.length ? `
      <button class="btn btn-primary btn-lg" id="start-workout-btn" style="width:100%;margin-top:1.5rem;">
        🏋️ Start Workout
      </button>
    ` : ''}
  `;

  const startBtn = container.querySelector('#start-workout-btn');
  if (startBtn) {
    on(startBtn, 'click', () => {
      initActiveWorkout(dayData, plan);
      switchTab('active');
    });
  }
}

function initActiveWorkout(dayData, plan) {
  activeWorkout = {
    plan: plan.name,
    planType: plan.id,
    dayLabel: dayData.label || '',
    exercises: (dayData.exercises || []).map(ex => ({
      name: getExerciseById?.(ex.exerciseId)?.name || ex.exerciseId,
      targetSets: ex.sets || 3,
      targetReps: ex.reps || '10',
      rest: ex.rest || 60,
      sets: []
    })),
    startTime: Date.now(),
    currentExerciseIndex: 0,
    currentSetIndex: 0
  };
}

function renderActiveTab(container, switchTab) {
  if (!activeWorkout) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;">
        <div style="font-size:3rem;margin-bottom:1rem;">🏋️</div>
        <h3 class="section-title">No Active Workout</h3>
        <p class="text-muted">Go to the <strong>Today</strong> tab to start a workout.</p>
      </div>
    `;
    return;
  }

  const { exercises: exList, currentExerciseIndex } = activeWorkout;
  const totalExercises = exList.length;
  const currentEx = exList[currentExerciseIndex];
  if (!currentEx) {
    finishWorkout(container, switchTab);
    return;
  }

  const completedSetsCount = currentEx.sets.length;
  const progressPercent = ((currentExerciseIndex / totalExercises) * 100).toFixed(0);

  // Previously completed sets badges
  const setBadges = currentEx.sets.map((s, i) =>
    `<span class="workouts__set-badge">${s.weight}kg × ${s.reps}</span>`
  ).join('');

  container.innerHTML = `
    <div class="progress-bar" style="height:6px;background:var(--bg-tertiary);border-radius:var(--radius-full);margin-bottom:1.5rem;overflow:hidden;">
      <div style="width:${progressPercent}%;height:100%;background:var(--accent);border-radius:var(--radius-full);transition:width 0.4s ease;"></div>
    </div>
    <div class="workouts__active-header">
      <div>
        <strong>${activeWorkout.dayLabel || activeWorkout.plan}</strong>
        <div class="text-muted" style="font-size:0.8rem;">Exercise ${currentExerciseIndex + 1} of ${totalExercises}</div>
      </div>
      <div class="workouts__active-timer" id="active-timer">00:00</div>
    </div>

    <div class="workouts__active-exercise">
      <div class="workouts__active-exercise-name">${currentEx.name}</div>
      <div class="workouts__active-set-info">
        Target: ${currentEx.targetSets} × ${currentEx.targetReps} · Set ${completedSetsCount + 1} of ${currentEx.targetSets}
      </div>
      <div class="workouts__active-inputs">
        <input type="number" class="input workouts__active-inputs" id="weight-input" placeholder="kg" min="0" step="0.5" />
        <input type="number" class="input workouts__active-inputs" id="reps-input" placeholder="reps" min="1" value="${currentEx.targetReps}" />
      </div>
      <button class="btn btn-primary" id="log-set-btn" style="min-width:160px;">Log Set ✓</button>
      ${setBadges ? `<div class="workouts__completed-sets">${setBadges}</div>` : ''}
    </div>

    <button class="btn btn-secondary" id="finish-workout-btn" style="width:100%;">Finish Workout</button>
  `;

  // Timer
  startElapsedTimer(container.querySelector('#active-timer'));

  // Log set
  on(container.querySelector('#log-set-btn'), 'click', () => {
    const weightInput = container.querySelector('#weight-input');
    const repsInput = container.querySelector('#reps-input');
    const weight = parseFloat(weightInput.value) || 0;
    const reps = parseInt(repsInput.value) || currentEx.targetReps;

    currentEx.sets.push({ weight, reps });

    // All sets done for this exercise?
    if (currentEx.sets.length >= currentEx.targetSets) {
      activeWorkout.currentExerciseIndex++;
      activeWorkout.currentSetIndex = 0;
      // Show rest timer between exercises
      try { createTimerModal(90); } catch (e) { /* timer optional */ }
    } else {
      activeWorkout.currentSetIndex++;
      try { createTimerModal(60); } catch (e) { /* timer optional */ }
    }

    renderActiveTab(container, switchTab);
    animateTabContent(container);
  });

  // Finish
  on(container.querySelector('#finish-workout-btn'), 'click', () => {
    finishWorkout(container, switchTab);
  });
}

function startElapsedTimer(timerEl) {
  if (timerInterval) clearInterval(timerInterval);
  if (!timerEl || !activeWorkout) return;

  function update() {
    const elapsed = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
    timerEl.textContent = formatDuration(elapsed);
  }
  update();
  timerInterval = setInterval(update, 1000);
}

function finishWorkout(container, switchTab) {
  if (!activeWorkout) return;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

  const duration = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
  const completedExercises = activeWorkout.exercises.filter(ex => ex.sets.length > 0);
  const totalSets = completedExercises.reduce((s, ex) => s + ex.sets.length, 0);
  const totalReps = completedExercises.reduce((s, ex) => s + ex.sets.reduce((r, set) => r + set.reps, 0), 0);

  // Save workout
  addWorkout({
    id: generateId(),
    date: getTodayISO(),
    planType: activeWorkout.planType,
    dayLabel: activeWorkout.dayLabel,
    exercises: completedExercises.map(ex => ({
      name: ex.name,
      sets: ex.sets,
      completed: ex.sets.length >= ex.targetSets
    })),
    duration,
    notes: ''
  });

  // Check and unlock achievements
  try {
    unlockAchievement('iron_will');
    const streak = getStreak();
    if (streak >= 3) unlockAchievement('streak_starter');
    if (streak >= 7) unlockAchievement('on_fire');
    if (streak >= 30) unlockAchievement('unstoppable');

    const totalWorkouts = getWorkouts().length;
    if (totalWorkouts >= 100) unlockAchievement('century_club');
  } catch (err) {
    console.warn('Achievements check failed:', err);
  }

  // Show summary modal
  try {
    openModal({
      title: '🎉 Workout Complete!',
      content: `
        <div style="text-align:center;padding:1rem 0;">
          <div style="font-size:3rem;margin-bottom:1rem;">💪</div>
          <div class="nutrition__summary" style="margin-bottom:1.5rem;">
            <div class="nutrition__summary-card">
              <div class="nutrition__summary-label">Duration</div>
              <div class="nutrition__summary-value">${formatDuration(duration)}</div>
            </div>
            <div class="nutrition__summary-card">
              <div class="nutrition__summary-label">Exercises</div>
              <div class="nutrition__summary-value">${completedExercises.length}</div>
            </div>
            <div class="nutrition__summary-card">
              <div class="nutrition__summary-label">Sets</div>
              <div class="nutrition__summary-value">${totalSets}</div>
            </div>
            <div class="nutrition__summary-card">
              <div class="nutrition__summary-label">Reps</div>
              <div class="nutrition__summary-value">${totalReps}</div>
            </div>
          </div>
          <button class="btn btn-primary" id="summary-close-btn" style="width:100%;">Done</button>
        </div>
      `
    });
    setTimeout(() => {
      const closeBtn = document.querySelector('#summary-close-btn');
      if (closeBtn) on(closeBtn, 'click', () => { closeModal(); });
    }, 100);
  } catch (e) {
    // Fallback if modal unavailable
  }

  showSuccess('Workout saved!');
  activeWorkout = null;
  switchTab('today');
}

function renderHistoryTab(container) {
  const workouts = getWorkouts().slice().sort((a, b) => {
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  if (workouts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;">
        <div style="font-size:3rem;margin-bottom:1rem;">📋</div>
        <h3 class="section-title">No Workouts Logged Yet</h3>
        <p class="text-muted">Complete a workout to see it here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <h3 class="section-title">Workout History</h3>
    <div class="workouts__history-list">
      ${workouts.map((w, i) => {
        const totalSets = (w.exercises || []).reduce((s, ex) => s + (ex.sets?.length || 0), 0);
        const exerciseDetails = (w.exercises || []).map(ex => `
          <div style="margin-bottom:0.75rem;">
            <div style="font-weight:600;font-size:0.85rem;">${ex.name}</div>
            ${(ex.sets || []).map((s, si) =>
              `<div style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);padding-left:0.5rem;">
                Set ${si + 1}: ${s.weight}kg × ${s.reps}
              </div>`
            ).join('')}
          </div>
        `).join('');

        return `
          <div class="workouts__history-item" data-index="${i}">
            <div class="workouts__history-header">
              <span class="workouts__history-date">${formatDate(w.date)}</span>
              <span class="workouts__history-duration">${w.duration ? formatDuration(w.duration) : ''}</span>
            </div>
            <div class="workouts__history-details">
              ${w.planType || ''} · ${w.dayLabel || ''} · ${(w.exercises || []).length} exercises · ${totalSets} sets
            </div>
            <div class="workouts__history-expanded">
              ${exerciseDetails}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Expandable
  container.querySelectorAll('.workouts__history-item').forEach(item => {
    on(item, 'click', () => {
      item.classList.toggle('expanded');
    });
  });
}

function renderVideosTab(container) {
  const muscleGroups = MUSCLE_GROUPS || ['chest', 'back', 'shoulders', 'arms', 'legs', 'abs'];
  let activeFilter = 'all';

  function render() {
    const filtered = activeFilter === 'all' ? muscleGroups : muscleGroups.filter(m => m === activeFilter);

    container.innerHTML = `
      <h3 class="section-title">Exercise Videos</h3>
      <div class="workouts__filter-chips">
        <button class="workouts__filter-chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
        ${muscleGroups.map(m => `
          <button class="workouts__filter-chip ${activeFilter === m ? 'active' : ''}" data-filter="${m}">
            ${m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        `).join('')}
      </div>
      <div class="workouts__video-grid">
        ${filtered.map(muscle => `
          <div class="workouts__video-card">
            <video poster="/videos/${muscle}-poster.jpg" controls preload="none">
              <source src="/videos/${muscle}.mp4" type="video/mp4" />
              Your browser does not support the video element.
            </video>
            <div class="workouts__video-label">${muscle}</div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.workouts__filter-chip').forEach(chip => {
      on(chip, 'click', () => {
        activeFilter = chip.dataset.filter;
        render();
        animateTabContent(container);
      });
    });
  }

  render();
}

// ── GSAP animation ───────────────────────────────────────────────────────────

function animateTabContent(container) {
  gsap.fromTo(
    container.children,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
  );

  // Auto-apply ripples to buttons
  container.querySelectorAll('.btn-primary, .btn-secondary, .btn, .workouts__add-btn, .workouts__action-btn').forEach(btn => {
    btn.classList.add('ripple-container');
    on(btn, 'click', addRipple);
  });
}

// ── AI Recommendation Engine ─────────────────────────────────────────────────

function generateSmartRecommendation() {
  const user = getUser() || {};
  const stats = getStats() || {};
  const history = getWorkouts() || [];
  const goal = user.goal || stats.goal || 'general';
  const experience = user.experience || 'beginner';
  const dayIndex = getDayOfWeek();

  // Analyze recent workout history (last 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentWorkouts = history.filter(w => new Date(w.date).getTime() > oneWeekAgo);
  const recentMuscles = new Set();
  recentWorkouts.forEach(w => {
    (w.exercises || []).forEach(ex => {
      const exData = getExerciseById(ex.exerciseId || ex.name?.toLowerCase().replace(/\s/g, '_'));
      if (exData) recentMuscles.add(exData.muscle);
    });
  });

  // Find underworked muscle groups
  const allMuscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core'];
  const neglectedMuscles = allMuscles.filter(m => !recentMuscles.has(m));
  const targetMuscles = neglectedMuscles.length > 0 ? neglectedMuscles.slice(0, 3) : ['chest', 'back', 'legs'];

  // Build recommendation based on goal
  const recommendations = [];

  // Recommendation 1: Goal-based workout
  const goalWorkouts = {
    'muscle-gain': {
      title: '💪 Hypertrophy Focus',
      subtitle: 'Optimized for muscle growth based on your goal',
      sets: '4-5', reps: '8-12', rest: 60,
      intensity: 'Moderate-High (70-80% 1RM)',
      tip: 'Focus on time under tension. Use 3-second negatives for maximum growth stimulus.'
    },
    'weight-loss': {
      title: '🔥 Fat-Burning Circuit',
      subtitle: 'High-intensity training for maximum calorie burn',
      sets: '3-4', reps: '15-20', rest: 30,
      intensity: 'Moderate (60-70% 1RM)',
      tip: 'Minimize rest between sets. Superset opposing muscle groups for efficiency.'
    },
    'strength': {
      title: '🏋️ Strength Builder',
      subtitle: 'Heavy compounds for raw strength gains',
      sets: '5', reps: '3-5', rest: 180,
      intensity: 'High (85-95% 1RM)',
      tip: 'Prioritize compound lifts. Full recovery between sets is crucial for strength.'
    },
    'endurance': {
      title: '⚡ Endurance & Conditioning',
      subtitle: 'Build stamina and cardiovascular fitness',
      sets: '3', reps: '20-25', rest: 30,
      intensity: 'Low-Moderate (50-60% 1RM)',
      tip: 'Keep heart rate elevated. Add cardio intervals between resistance sets.'
    },
    'general': {
      title: '🎯 Balanced Training',
      subtitle: 'Well-rounded fitness for overall health',
      sets: '3-4', reps: '10-15', rest: 60,
      intensity: 'Moderate (65-75% 1RM)',
      tip: 'Mix compound and isolation movements. Vary rep ranges weekly for optimal adaptation.'
    }
  };
  const goalRec = goalWorkouts[goal] || goalWorkouts['general'];

  // Build exercise list for target muscles
  const recExercises = [];
  targetMuscles.forEach(muscle => {
    const muscleExercises = getExercisesByMuscle(muscle);
    // Pick exercises based on experience
    const filtered = experience === 'beginner'
      ? muscleExercises.filter(e => e.difficulty === 'beginner')
      : experience === 'advanced'
        ? muscleExercises
        : muscleExercises.filter(e => e.difficulty !== 'advanced');
    const pool = filtered.length > 0 ? filtered : muscleExercises;
    // Pick 2 exercises per muscle group
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    recExercises.push(...shuffled.slice(0, 2));
  });

  recommendations.push({
    ...goalRec,
    exercises: recExercises,
    targetMuscles,
    reason: neglectedMuscles.length > 0
      ? `These muscle groups haven't been trained in the last 7 days: ${targetMuscles.join(', ')}`
      : 'Balanced selection across major muscle groups'
  });

  // Recommendation 2: Recovery-aware suggestion
  const daysSinceLastWorkout = recentWorkouts.length > 0
    ? Math.floor((Date.now() - Math.max(...recentWorkouts.map(w => new Date(w.date).getTime()))) / (24 * 60 * 60 * 1000))
    : 999;

  if (daysSinceLastWorkout >= 3) {
    recommendations.push({
      title: '🔄 Comeback Session',
      subtitle: `It\'s been ${daysSinceLastWorkout} days — ease back in with this full-body session`,
      exercises: [
        getExerciseById('squat'), getExerciseById('bench_press'),
        getExerciseById('bent_over_row'), getExerciseById('overhead_press'),
        getExerciseById('plank')
      ].filter(Boolean),
      sets: '3', reps: '8-10', rest: 90,
      intensity: 'Low-Moderate (60-65% 1RM)',
      tip: 'Don\'t go heavy on your first day back. Focus on form and muscle activation.',
      reason: 'A recovery-friendly session to reignite your training'
    });
  }

  // Recommendation 3: Cardio/HIIT
  if (goal === 'weight-loss' || goal === 'endurance' || dayIndex % 3 === 0) {
    const cardioExercises = getExercisesByMuscle('cardio');
    recommendations.push({
      title: '❤️ Cardio & HIIT Day',
      subtitle: 'Boost your cardiovascular fitness and burn extra calories',
      exercises: cardioExercises.slice(0, 4),
      sets: '3', reps: '30-60 sec intervals', rest: 30,
      intensity: 'Variable (Interval Training)',
      tip: '20 seconds all-out effort, 10 seconds rest. Repeat for 8 rounds (Tabata protocol).',
      reason: 'Cardiovascular health and calorie burn complement resistance training'
    });
  }

  return { recommendations, userGoal: goal, experience, workoutsThisWeek: recentWorkouts.length, neglectedMuscles };
}

function renderRecommendTab(container, switchTab) {
  const { recommendations, userGoal, experience, workoutsThisWeek, neglectedMuscles } = generateSmartRecommendation();

  const goalEmoji = { 'muscle-gain': '💪', 'weight-loss': '🔥', 'strength': '🏋️', 'endurance': '⚡', 'general': '🎯' };
  const goalLabel = { 'muscle-gain': 'Muscle Gain', 'weight-loss': 'Weight Loss', 'strength': 'Strength', 'endurance': 'Endurance', 'general': 'General Fitness' };

  container.innerHTML = `
    <div class="card" style="padding:1.5rem;margin-bottom:2rem;border-left:4px solid var(--accent);">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);font-weight:600;margin-bottom:0.25rem;">AI Recommendation Engine</div>
          <div style="font-size:1.1rem;font-weight:700;">🧠 Smart Workout Suggestions</div>
          <div class="text-muted" style="font-size:0.85rem;margin-top:0.25rem;">Based on your profile, goals, and recent activity</div>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <span class="badge">${goalEmoji[userGoal] || '🎯'} ${goalLabel[userGoal] || 'General'}</span>
          <span class="badge badge-success">${workoutsThisWeek} workouts this week</span>
          <span class="badge" style="background:var(--warning-soft);color:var(--warning);border-color:rgba(255,171,0,0.3);">${experience}</span>
        </div>
      </div>
      ${neglectedMuscles.length > 0 ? `
        <div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--warning-soft);border-radius:var(--radius-sm);font-size:0.85rem;">
          ⚠️ <strong>Muscle imbalance detected:</strong> ${neglectedMuscles.join(', ')} haven't been trained recently
        </div>
      ` : ''}
    </div>

    ${recommendations.map((rec, i) => `
      <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;" id="rec-card-${i}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
          <div>
            <h3 style="margin:0 0 0.25rem 0;font-size:1.2rem;">${rec.title}</h3>
            <p class="text-muted" style="margin:0;font-size:0.9rem;">${rec.subtitle}</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:0.75rem;margin-bottom:1.25rem;">
          <div class="stat-card" style="padding:0.75rem;">
            <div class="stat-card__label">Sets</div>
            <div class="stat-card__value" style="font-size:1.25rem;">${rec.sets}</div>
          </div>
          <div class="stat-card" style="padding:0.75rem;">
            <div class="stat-card__label">Reps</div>
            <div class="stat-card__value" style="font-size:1.25rem;">${rec.reps}</div>
          </div>
          <div class="stat-card" style="padding:0.75rem;">
            <div class="stat-card__label">Rest</div>
            <div class="stat-card__value" style="font-size:1.25rem;">${rec.rest}s</div>
          </div>
          <div class="stat-card" style="padding:0.75rem;">
            <div class="stat-card__label">Intensity</div>
            <div class="stat-card__value" style="font-size:0.75rem;">${rec.intensity}</div>
          </div>
        </div>

        <div class="workouts__exercise-list" style="margin:0 0 1.25rem 0;">
          ${(rec.exercises || []).map(ex => `
            <div class="workouts__exercise-item">
              <div>
                <div class="workouts__exercise-name">${ex.name}</div>
                <div class="workouts__exercise-detail">${rec.sets} × ${rec.reps} · ${ex.muscle}</div>
              </div>
              <span class="badge" style="font-size:0.65rem;">${ex.equipment}</span>
            </div>
          `).join('')}
        </div>

        <div style="padding:0.75rem 1rem;background:var(--accent-soft);border-radius:var(--radius-sm);font-size:0.85rem;margin-bottom:1rem;">
          💡 <strong>Pro Tip:</strong> ${rec.tip}
        </div>

        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">
          🧠 <em>${rec.reason}</em>
        </div>

        <button class="btn btn-primary" data-rec-index="${i}" style="width:100%;">Start This Workout 🚀</button>
      </div>
    `).join('')}
  `;

  // Start workout from recommendation
  container.querySelectorAll('[data-rec-index]').forEach(btn => {
    on(btn, 'click', () => {
      const idx = parseInt(btn.dataset.recIndex);
      const rec = recommendations[idx];
      if (!rec) return;

      const repsVal = parseInt(rec.reps) || 10;
      const setsVal = parseInt(rec.sets) || 3;

      activeWorkout = {
        plan: rec.title,
        planType: 'ai_recommendation',
        dayLabel: rec.subtitle,
        exercises: (rec.exercises || []).map(ex => ({
          name: ex.name,
          targetSets: setsVal,
          targetReps: repsVal,
          rest: rec.rest || 60,
          sets: []
        })),
        startTime: Date.now(),
        currentExerciseIndex: 0,
        currentSetIndex: 0
      };

      showSuccess('AI workout started! Let\'s go! 💪');
      switchTab('active');
    });
  });
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default async function workoutsPage() {
  const TABS = ['recommend', 'plans', 'today', 'active', 'history', 'videos'];
  const TAB_LABELS = { 'recommend': '🧠 AI Picks', 'plans': 'Plans', 'today': 'Today', 'active': 'Active', 'history': 'History', 'videos': 'Videos' };

  const page = html(`
    <div class="page">
      <div id="workouts-nav-container"></div>
      <div class="page-content">
        <div class="ambient-orb ambient-orb--blue"></div>
        <div class="ambient-orb ambient-orb--purple"></div>
        
        <div class="workouts__tabs reveal" id="workouts-tabs">
          ${TABS.map(t => `
            <button class="workouts__tab ${t === activeTab ? 'active' : ''}" data-tab="${t}">
              ${TAB_LABELS[t]}
            </button>
          `).join('')}
        </div>
        <div class="workouts__tab-content" id="workouts-tab-content"></div>
      </div>
    </div>
  `);

  // Insert navbar
  page.querySelector('#workouts-nav-container').appendChild(createNavbar());

  const tabContent = page.querySelector('#workouts-tab-content');
  const tabButtons = page.querySelectorAll('.workouts__tab');

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    tabContent.innerHTML = '';

    switch (tabName) {
      case 'recommend': renderRecommendTab(tabContent, switchTab); break;
      case 'plans':  renderPlansTab(tabContent); break;
      case 'today':  renderTodayTab(tabContent, switchTab); break;
      case 'active': renderActiveTab(tabContent, switchTab); break;
      case 'history': renderHistoryTab(tabContent); break;
      case 'videos': renderVideosTab(tabContent); break;
    }

    animateTabContent(tabContent);
  }

  tabButtons.forEach(btn => {
    on(btn, 'click', () => switchTab(btn.dataset.tab));
  });

  // Initial render
  switchTab(activeTab);

  const cleanupReveal = initScrollReveal(page);
  page.cleanup = () => {
    cleanupReveal();
    if (timerInterval) clearInterval(timerInterval);
  };

  return page;
}
