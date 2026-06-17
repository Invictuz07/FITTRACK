// src/pages/settings.js
// Settings page: profile editor, preferences, data management, and achievements

import { html, on } from '../utils/dom.js';
import { createNavbar } from '../components/navbar.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast, showSuccess, showError } from '../components/toast.js';
import { 
  getUser, saveUser, 
  getStats, saveStats, 
  getSettings, saveSettings, 
  getAchievements, unlockAchievement,
  exportAllData, importData, clearAllData
} from '../store.js';
import { calculateAllStats } from '../utils/calculations.js';
import { createBadgeGrid } from '../components/badges.js';
import { navigateTo } from '../router.js';
import { addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';

export default async function settingsPage() {
  let activeTab = 'settings'; // 'settings' | 'achievements'

  const page = html(`
    <div class="page">
      <div id="settings-nav-container"></div>
      <div class="page-content">
        <div class="nutrition__tabs" id="settings-tabs">
          <button class="nutrition__tab active" data-tab="settings">⚙️ Settings</button>
          <button class="nutrition__tab" data-tab="achievements">🏆 Achievements</button>
        </div>
        <div class="workouts__tab-content" id="settings-tab-content"></div>
      </div>
    </div>
  `);

  // Mount navbar
  page.querySelector('#settings-nav-container').appendChild(createNavbar());

  const tabContent = page.querySelector('#settings-tab-content');
  const tabButtons = page.querySelectorAll('.nutrition__tab');

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    tabContent.innerHTML = '';

    if (tabName === 'settings') {
      renderSettingsTab(tabContent);
    } else {
      renderAchievementsTab(tabContent);
    }

    // Animate transition
    gsap.fromTo(
      tabContent.children,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
    );
  }

  tabButtons.forEach(btn => {
    on(btn, 'click', () => switchTab(btn.dataset.tab));
  });

  // Initial render
  setTimeout(() => switchTab(activeTab), 0);

  return page;
}

function renderSettingsTab(container) {
  const user = getUser() || {};
  const settings = getSettings();


  container.innerHTML = `
    <div class="settings-layout">
      <!-- Profile settings card -->
      <div class="card settings__section">
        <h3 class="settings__section-title">Edit Profile</h3>
        <form id="profile-form">
          <div class="form-group">
            <label class="form-label" for="profile-name">Name</label>
            <input type="text" id="profile-name" class="input" value="${user.name || ''}" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profile-age">Age</label>
              <input type="number" id="profile-age" class="input" value="${user.age || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="profile-gender">Gender</label>
              <select id="profile-gender" class="select">
                <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profile-height">Height (cm)</label>
              <input type="number" id="profile-height" class="input" value="${user.height || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="profile-weight">Weight (kg)</label>
              <input type="number" id="profile-weight" class="input" value="${user.weight || ''}" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profile-goal">Goal</label>
              <select id="profile-goal" class="select">
                <option value="lose" ${user.goal === 'lose' ? 'selected' : ''}>Fat Loss</option>
                <option value="muscle" ${user.goal === 'muscle' ? 'selected' : ''}>Muscle Gain</option>
                <option value="recomp" ${user.goal === 'recomp' ? 'selected' : ''}>Body Recomp</option>
                <option value="maintain" ${user.goal === 'maintain' ? 'selected' : ''}>Maintenance</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="profile-activity">Activity Level</label>
              <select id="profile-activity" class="select">
                <option value="1.2" ${user.activityLevel === 1.2 ? 'selected' : ''}>Sedentary</option>
                <option value="1.375" ${user.activityLevel === 1.375 ? 'selected' : ''}>Light</option>
                <option value="1.55" ${user.activityLevel === 1.55 ? 'selected' : ''}>Moderate</option>
                <option value="1.725" ${user.activityLevel === 1.725 ? 'selected' : ''}>Intense</option>
                <option value="1.9" ${user.activityLevel === 1.9 ? 'selected' : ''}>Athlete</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profile-experience">Experience</label>
              <select id="profile-experience" class="select">
                <option value="beginner" ${user.experience === 'beginner' ? 'selected' : ''}>Beginner</option>
                <option value="intermediate" ${user.experience === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="advanced" ${user.experience === 'advanced' ? 'selected' : ''}>Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="profile-sleep">Sleep (hours)</label>
              <input type="number" id="profile-sleep" class="input" value="${user.sleep || '8'}" required />
            </div>
          </div>
          <button type="submit" class="btn-primary" style="width:100%;margin-top:0.5rem;">Save Changes</button>
        </form>
      </div>

      <!-- App Preferences & Data section -->
      <div class="settings__right-column">
        <div class="card settings__section">
          <h3 class="settings__section-title">App Preferences</h3>
          
          <div class="settings__toggle-row">
            <div>
              <div class="settings__toggle-label">Theme Mode</div>
              <div class="settings__toggle-desc">Switch between light and dark UI themes</div>
            </div>
            <div class="theme-select-pills">
              <button class="pill-btn ${settings.theme === 'dark' ? 'active' : ''}" id="pref-theme-dark">Dark</button>
              <button class="pill-btn ${settings.theme === 'light' ? 'active' : ''}" id="pref-theme-light">Light</button>
            </div>
          </div>

          <div class="settings__toggle-row">
            <div>
              <div class="settings__toggle-label">Measurement Units</div>
              <div class="settings__toggle-desc">Switch between Metric (kg, cm) and Imperial (lbs, ft/in)</div>
            </div>
            <div class="theme-select-pills">
              <button class="pill-btn ${settings.units === 'metric' ? 'active' : ''}" id="pref-units-metric">Metric</button>
              <button class="pill-btn ${settings.units === 'imperial' ? 'active' : ''}" id="pref-units-imperial">Imperial</button>
            </div>
          </div>

          <div class="settings__toggle-row">
            <div>
              <div class="settings__toggle-label">Timer Sound</div>
              <div class="settings__toggle-desc">Play sound alert when rest timer finishes</div>
            </div>
            <div class="theme-select-pills">
              <button class="pill-btn ${settings.soundEnabled ? 'active' : ''}" id="pref-sound-on">On</button>
              <button class="pill-btn ${!settings.soundEnabled ? 'active' : ''}" id="pref-sound-off">Off</button>
            </div>
          </div>
        </div>



        <div class="card settings__section">
          <h3 class="settings__section-title">Data Management</h3>
          <p class="text-muted" style="font-size:0.85rem;margin-bottom:1.5rem;">
            Backup your profile, workout logs, nutrition tracking, and achievements, or clear all data to start fresh.
          </p>

          <div class="settings__data-actions">
            <button class="btn-secondary btn-sm" id="btn-export-data">📤 Export Data</button>
            <button class="btn-secondary btn-sm" id="btn-import-data">📥 Import Data</button>
            <input type="file" id="import-file-input" style="display:none;" accept=".json" />
          </div>

          <div class="divider" style="margin:1.25rem 0;"></div>

          <button class="btn-primary btn-error" id="btn-reset-data" style="width:100%;background:rgba(255,82,82,0.15);color:var(--error);border:1px solid rgba(255,82,82,0.3);box-shadow:none;">
            ⚠️ Reset All Data
          </button>
        </div>
      </div>
    </div>
  `;



  // Bind profile form submit
  const profileForm = container.querySelector('#profile-form');
  on(profileForm, 'submit', (e) => {
    e.preventDefault();
    const updatedUser = {
      name: container.querySelector('#profile-name').value.trim(),
      age: parseInt(container.querySelector('#profile-age').value, 10),
      gender: container.querySelector('#profile-gender').value,
      height: parseFloat(container.querySelector('#profile-height').value),
      weight: parseFloat(container.querySelector('#profile-weight').value),
      goal: container.querySelector('#profile-goal').value,
      activityLevel: parseFloat(container.querySelector('#profile-activity').value),
      experience: container.querySelector('#profile-experience').value,
      sleep: parseFloat(container.querySelector('#profile-sleep').value),
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newStats = calculateAllStats(updatedUser);
    saveUser(updatedUser);
    saveStats(newStats);
    showSuccess('Profile updated successfully!');
  });

  // Bind theme toggles
  const darkBtn = container.querySelector('#pref-theme-dark');
  const lightBtn = container.querySelector('#pref-theme-light');
  
  on(darkBtn, 'click', () => {
    darkBtn.classList.add('active');
    lightBtn.classList.remove('active');
    updateAppPreference('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    // Also sync standard navbar icon if instantiated
    const navThemeBtn = document.querySelector('#theme-toggle');
    if (navThemeBtn) navThemeBtn.textContent = '☀️';
  });

  on(lightBtn, 'click', () => {
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
    updateAppPreference('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    const navThemeBtn = document.querySelector('#theme-toggle');
    if (navThemeBtn) navThemeBtn.textContent = '🌙';
  });

  // Bind unit toggles
  const metricBtn = container.querySelector('#pref-units-metric');
  const imperialBtn = container.querySelector('#pref-units-imperial');

  on(metricBtn, 'click', () => {
    metricBtn.classList.add('active');
    imperialBtn.classList.remove('active');
    updateAppPreference('units', 'metric');
    showSuccess('Units updated to metric!');
  });

  on(imperialBtn, 'click', () => {
    imperialBtn.classList.add('active');
    metricBtn.classList.remove('active');
    updateAppPreference('units', 'imperial');
    showSuccess('Units updated to imperial!');
  });

  // Bind sound toggles
  const soundOnBtn = container.querySelector('#pref-sound-on');
  const soundOffBtn = container.querySelector('#pref-sound-off');

  on(soundOnBtn, 'click', () => {
    soundOnBtn.classList.add('active');
    soundOffBtn.classList.remove('active');
    updateAppPreference('soundEnabled', true);
    showSuccess('Timer sounds enabled!');
  });

  on(soundOffBtn, 'click', () => {
    soundOffBtn.classList.add('active');
    soundOnBtn.classList.remove('active');
    updateAppPreference('soundEnabled', false);
    showSuccess('Timer sounds muted!');
  });

  // Bind Export Data
  const exportBtn = container.querySelector('#btn-export-data');
  on(exportBtn, 'click', () => {
    try {
      const dataStr = exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fittrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('Data backup downloaded!');
      
      // Unlock data_nerd achievement
      checkAndUnlockAchievement('data_nerd');
    } catch (e) {
      showError('Failed to export data');
    }
  });

  // Bind Import Data
  const fileInput = container.querySelector('#import-file-input');
  const importBtn = container.querySelector('#btn-import-data');
  
  on(importBtn, 'click', () => {
    fileInput.click();
  });

  on(fileInput, 'change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = importData(evt.target.result);
      if (result.success) {
        showSuccess('Data imported successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showError(`Import failed: ${result.error || 'Invalid file format'}`);
      }
    };
    reader.onerror = () => {
      showError('Error reading file');
    };
    reader.readAsText(file);
  });

  // Bind Reset Data
  const resetBtn = container.querySelector('#btn-reset-data');
  on(resetBtn, 'click', () => {
    try {
      openModal({
        title: '⚠️ Critical: Reset All Data?',
        content: `
          <div style="padding: 0.5rem 0;">
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.5;">
              This will permanently delete all your profile data, workout histories, logged nutrition plans, and achievements. This action is irreversible!
            </p>
            <div style="display:flex;gap:1rem;">
              <button class="btn btn-secondary" id="confirm-reset-cancel" style="flex:1;">Cancel</button>
              <button class="btn btn-primary" id="confirm-reset-confirm" style="flex:1;background:var(--error);border-color:var(--error);">Confirm Delete</button>
            </div>
          </div>
        `
      });

      setTimeout(() => {
        const cancelBtn = document.querySelector('#confirm-reset-cancel');
        const confirmBtn = document.querySelector('#confirm-reset-confirm');

        if (cancelBtn) on(cancelBtn, 'click', closeModal);
        if (confirmBtn) on(confirmBtn, 'click', () => {
          clearAllData();
          closeModal();
          showSuccess('All data cleared!');
          setTimeout(() => {
            navigateTo('/');
          }, 1000);
        });
      }, 100);
    } catch (e) {
      if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        clearAllData();
        window.location.hash = '/';
      }
    }
  });
}

function renderAchievementsTab(container) {
  const unlocked = getAchievements();
  
  container.innerHTML = `
    <div class="achievements-page">
      <div class="achievements-summary-banner card">
        <div class="achievements-summary-score">
          <span class="achievements-summary-num">${unlocked.length}</span>
          <span class="achievements-summary-total">/ 10</span>
        </div>
        <div class="achievements-summary-text">
          <h3 style="margin-bottom: 0.25rem;">Unlocked Badges</h3>
          <p class="text-muted" style="font-size:0.85rem;">Keep pushing your limits to unlock all achievements!</p>
        </div>
      </div>
      <div id="badge-grid-holder"></div>
    </div>
  `;

  const gridHolder = container.querySelector('#badge-grid-holder');
  gridHolder.appendChild(createBadgeGrid(unlocked));
}

function updateAppPreference(key, value) {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
}

/**
 * Custom wrapper to unlock achievement and show achievement toast
 * @param {string} id 
 */
function checkAndUnlockAchievement(id) {
  const achievements = getAchievements();
  if (!achievements.includes(id)) {
    unlockAchievement(id);
    
    // Lazy load or find the achievement metadata to display the name
    import('../data/achievements.js').then(m => {
      const ach = m.ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        showToast({
          message: `Achievement Unlocked: ${ach.name}! ${ach.icon}`,
          type: 'achievement',
          duration: 4500
        });
      }
    });
  }
}
