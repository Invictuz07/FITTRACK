import { html } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { saveUser, saveStats, unlockAchievement } from '../store.js';
import { calculateAllStats } from '../utils/calculations.js';
import { initScrollReveal, addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';

export default async function onboardingPage() {
  const state = {
    step: 1,
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'muscle',
    activity: '1.55',
    experience: 'beginner',
    sleep: '8'
  };

  const stepNames = ['', 'Identity', 'Body Stats', 'Mission', 'Lifestyle'];

  const page = html(`
    <div class="onboarding">
      <div class="ambient-orb ambient-orb--blue"></div>
      <div class="ambient-orb ambient-orb--purple"></div>
      <div class="ambient-orb ambient-orb--teal"></div>
      <div class="onboarding__progress">
        <div class="onboarding__progress-bar">
          <div class="onboarding__progress-fill" style="width: 25%"></div>
        </div>
        <div class="onboarding__step-label">Step 1 of 4 — Identity</div>
      </div>
      <div class="onboarding__card reveal-scale">
        <div class="onboarding__card-content"></div>
      </div>
    </div>
  `);

  const contentEl = page.querySelector('.onboarding__card-content');
  const progressFill = page.querySelector('.onboarding__progress-fill');
  const stepLabel = page.querySelector('.onboarding__step-label');

  function syncStateFromInputs() {
    const nameInput = contentEl.querySelector('#ob-name');
    const ageInput = contentEl.querySelector('#ob-age');
    const heightInput = contentEl.querySelector('#ob-height');
    const weightInput = contentEl.querySelector('#ob-weight');
    const activitySelect = contentEl.querySelector('#ob-activity');
    const experienceSelect = contentEl.querySelector('#ob-experience');
    const sleepInput = contentEl.querySelector('#ob-sleep');

    if (nameInput) state.name = nameInput.value;
    if (ageInput) state.age = ageInput.value;
    if (heightInput) state.height = heightInput.value;
    if (weightInput) state.weight = weightInput.value;
    if (activitySelect) state.activity = activitySelect.value;
    if (experienceSelect) state.experience = experienceSelect.value;
    if (sleepInput) state.sleep = sleepInput.value;
  }

  function renderStep() {
    syncStateFromInputs();

    gsap.to(progressFill, {
      width: `${(state.step / 4) * 100}%`,
      duration: 0.4,
      ease: 'power2.out'
    });
    stepLabel.textContent = `Step ${state.step} of 4 — ${stepNames[state.step]}`;

    let stepHTML = '';

    switch (state.step) {
      case 1:
        stepHTML = `
          <h2 class="onboarding__card-title">Who Are You?</h2>
          <p class="onboarding__card-subtitle">Let's start with the basics</p>
          <div class="form-group">
            <label class="form-label" for="ob-name">Name</label>
            <input type="text" id="ob-name" class="input" placeholder="Your Name" value="${state.name}" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="ob-age">Age</label>
              <input type="number" id="ob-age" class="input" placeholder="25" value="${state.age}" />
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <div class="onboarding__gender-cards">
                <div class="onboarding__gender-card ripple-container ${state.gender === 'male' ? 'selected' : ''}" data-gender="male">
                  <span>🙋‍♂️</span>
                  <span>Male</span>
                </div>
                <div class="onboarding__gender-card ripple-container ${state.gender === 'female' ? 'selected' : ''}" data-gender="female">
                  <span>🙋‍♀️</span>
                  <span>Female</span>
                </div>
              </div>
            </div>
          </div>
          <div class="onboarding__nav">
            <div></div>
            <button class="btn-primary ripple-container" data-action="next">Next →</button>
          </div>
        `;
        break;

      case 2:
        stepHTML = `
          <h2 class="onboarding__card-title">Your Body</h2>
          <p class="onboarding__card-subtitle">We need these to calculate your targets</p>
          <div class="form-group">
            <label class="form-label" for="ob-height">Height (cm)</label>
            <input type="number" id="ob-height" class="input" placeholder="175" value="${state.height}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="ob-weight">Weight (kg)</label>
            <input type="number" id="ob-weight" class="input" placeholder="75" value="${state.weight}" />
          </div>
          <div class="onboarding__nav">
            <button class="btn-secondary ripple-container" data-action="back">← Back</button>
            <button class="btn-primary ripple-container" data-action="next">Next →</button>
          </div>
        `;
        break;

      case 3:
        stepHTML = `
          <h2 class="onboarding__card-title">Your Mission</h2>
          <p class="onboarding__card-subtitle">What's your primary goal?</p>
          <div class="onboarding__goals">
            <div class="onboarding__goal-card ripple-container ${state.goal === 'lose' ? 'selected' : ''}" data-goal="lose">
              <div class="onboarding__goal-icon">🔥</div>
              <div class="onboarding__goal-label">Fat Loss</div>
              <div class="onboarding__goal-desc">Shred body fat while preserving muscle</div>
            </div>
            <div class="onboarding__goal-card ripple-container ${state.goal === 'muscle' ? 'selected' : ''}" data-goal="muscle">
              <div class="onboarding__goal-icon">💪</div>
              <div class="onboarding__goal-label">Muscle Gain</div>
              <div class="onboarding__goal-desc">Build size and strength</div>
            </div>
            <div class="onboarding__goal-card ripple-container ${state.goal === 'recomp' ? 'selected' : ''}" data-goal="recomp">
              <div class="onboarding__goal-icon">⚡</div>
              <div class="onboarding__goal-label">Body Recomp</div>
              <div class="onboarding__goal-desc">Lose fat and gain muscle simultaneously</div>
            </div>
            <div class="onboarding__goal-card ripple-container ${state.goal === 'maintain' ? 'selected' : ''}" data-goal="maintain">
              <div class="onboarding__goal-icon">🎯</div>
              <div class="onboarding__goal-label">Maintenance</div>
              <div class="onboarding__goal-desc">Stay fit and healthy</div>
            </div>
          </div>
          <div class="onboarding__nav">
            <button class="btn-secondary ripple-container" data-action="back">← Back</button>
            <button class="btn-primary ripple-container" data-action="next">Next →</button>
          </div>
        `;
        break;

      case 4:
        stepHTML = `
          <h2 class="onboarding__card-title">Your Lifestyle</h2>
          <p class="onboarding__card-subtitle">Almost there — just a few more details</p>
          <div class="form-group">
            <label class="form-label" for="ob-activity">Activity Level</label>
            <select id="ob-activity" class="select">
              <option value="1.2" ${state.activity === '1.2' ? 'selected' : ''}>Sedentary</option>
              <option value="1.375" ${state.activity === '1.375' ? 'selected' : ''}>Light</option>
              <option value="1.55" ${state.activity === '1.55' ? 'selected' : ''}>Moderate</option>
              <option value="1.725" ${state.activity === '1.725' ? 'selected' : ''}>Intense</option>
              <option value="1.9" ${state.activity === '1.9' ? 'selected' : ''}>Athlete</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="ob-experience">Experience</label>
              <select id="ob-experience" class="select">
                <option value="beginner" ${state.experience === 'beginner' ? 'selected' : ''}>Beginner</option>
                <option value="intermediate" ${state.experience === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="advanced" ${state.experience === 'advanced' ? 'selected' : ''}>Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="ob-sleep">Sleep (hours)</label>
              <input type="number" id="ob-sleep" class="input" placeholder="8" value="${state.sleep}" />
            </div>
          </div>
          <div class="onboarding__nav">
            <button class="btn-secondary ripple-container" data-action="back">← Back</button>
            <button class="btn-primary ripple-container" data-action="complete" style="flex:1">Complete Setup ✓</button>
          </div>
        `;
        break;
    }

    gsap.to(contentEl, {
      x: -30,
      opacity: 0,
      duration: 0.25,
      ease: 'power3.in',
      onComplete() {
        contentEl.innerHTML = stepHTML;
        bindStepEvents();
        gsap.fromTo(contentEl, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' });
      }
    });
  }

  function bindStepEvents() {
    const genderCards = contentEl.querySelectorAll('.onboarding__gender-card');
    genderCards.forEach(card => {
      card.addEventListener('click', (e) => {
        addRipple(e);
        genderCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.gender = card.getAttribute('data-gender');
      });
    });

    const goalCards = contentEl.querySelectorAll('.onboarding__goal-card');
    goalCards.forEach(card => {
      card.addEventListener('click', (e) => {
        addRipple(e);
        goalCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.goal = card.getAttribute('data-goal');
      });
    });

    const nextBtn = contentEl.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        addRipple(e);
        syncStateFromInputs();
        if (state.step < 4) {
          state.step++;
          setTimeout(() => renderStep(), 250);
        }
      });
    }

    const backBtn = contentEl.querySelector('[data-action="back"]');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        addRipple(e);
        syncStateFromInputs();
        if (state.step > 1) {
          state.step--;
          setTimeout(() => renderStep(), 250);
        }
      });
    }

    const completeBtn = contentEl.querySelector('[data-action="complete"]');
    if (completeBtn) {
      completeBtn.addEventListener('click', (e) => {
        addRipple(e);
        syncStateFromInputs();

        if (!state.name.trim() || !state.age || !state.height || !state.weight) {
          alert('Please fill in all required fields (name, age, height, weight).');
          return;
        }

        const userData = {
          name: state.name.trim(),
          age: parseInt(state.age, 10),
          gender: state.gender,
          height: parseFloat(state.height),
          weight: parseFloat(state.weight),
          goal: state.goal,
          activityLevel: parseFloat(state.activity),
          experience: state.experience,
          sleep: parseFloat(state.sleep),
          createdAt: new Date().toISOString()
        };

        const stats = calculateAllStats(userData);
        saveUser(userData);
        saveStats(stats);
        unlockAchievement('first_steps');
        setTimeout(() => navigateTo('/dashboard'), 300);
      });
    }
  }

  // Initial render — no animation, just set content directly
  contentEl.innerHTML = '';
  state.step = 1;
  renderStep();

  // Initialize scroll reveals
  const cleanupReveal = initScrollReveal(page);
  page.cleanup = () => {
    cleanupReveal();
  };

  return page;
}
