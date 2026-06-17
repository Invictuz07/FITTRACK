// src/components/timer.js
// Rest timer component with circular progress
import { html, qs, on, off } from '../utils/dom.js';
import { getSettings } from '../store.js';
import { openModal, closeModal } from './modal.js';
import gsap from 'gsap';

const CIRCUMFERENCE = 2 * Math.PI * 52; // radius = 52
const PRESETS = [30, 60, 90, 120, 180];

/**
 * Returns stroke color based on remaining time proportion.
 * Transitions: accent → success → warning → error
 */
function getProgressColor(ratio) {
  if (ratio > 0.66) return 'var(--accent)';
  if (ratio > 0.33) return 'var(--success)';
  if (ratio > 0.15) return 'var(--warning)';
  return 'var(--error)';
}

/**
 * Formats seconds into MM:SS string.
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Plays a triple beep using the Web Audio API.
 */
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    for (let i = 0; i < 3; i++) {
      const startTime = ctx.currentTime + i * 0.3;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, startTime);

      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    }

    // Clean up context after beeps finish
    setTimeout(() => ctx.close(), 1500);
  } catch (e) {
    // Web Audio API not available — silent fallback
  }
}

/**
 * Creates a rest timer component.
 * @param {Object} options
 * @param {number} [options.duration=90] - Default duration in seconds
 * @param {Function} [options.onComplete] - Callback when timer completes
 * @returns {HTMLElement} The timer element
 */
export function createTimer({ duration = 90, onComplete } = {}) {
  // State
  let totalDuration = duration;
  let remaining = duration;
  let isRunning = false;
  let intervalId = null;

  // Build the card container
  const card = document.createElement('div');
  card.className = 'card timer-card';
  card.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1.25rem;padding:2rem;';

  // SVG circular progress
  const svgNS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.setAttribute('width', '160');
  svg.setAttribute('height', '160');
  svg.style.cssText = 'transform:rotate(-90deg);';

  // Background track
  const bgCircle = document.createElementNS(svgNS, 'circle');
  bgCircle.setAttribute('cx', '60');
  bgCircle.setAttribute('cy', '60');
  bgCircle.setAttribute('r', '52');
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', 'var(--border, rgba(255,255,255,0.1))');
  bgCircle.setAttribute('stroke-width', '8');

  // Progress arc
  const progressCircle = document.createElementNS(svgNS, 'circle');
  progressCircle.setAttribute('cx', '60');
  progressCircle.setAttribute('cy', '60');
  progressCircle.setAttribute('r', '52');
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', 'var(--accent)');
  progressCircle.setAttribute('stroke-width', '8');
  progressCircle.setAttribute('stroke-linecap', 'round');
  progressCircle.setAttribute('stroke-dasharray', String(CIRCUMFERENCE));
  progressCircle.setAttribute('stroke-dashoffset', '0');
  progressCircle.style.transition = 'stroke 0.3s ease';

  svg.appendChild(bgCircle);
  svg.appendChild(progressCircle);

  // SVG wrapper with centered text overlay
  const svgWrapper = document.createElement('div');
  svgWrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center;justify-content:center;';

  const timeDisplay = document.createElement('div');
  timeDisplay.style.cssText = `
    position:absolute;
    font-family:'JetBrains Mono','Fira Code',monospace;
    font-weight:700;
    font-size:1.5rem;
    color:var(--text-primary, #fff);
    letter-spacing:0.05em;
  `;
  timeDisplay.textContent = formatTime(remaining);

  svgWrapper.appendChild(svg);
  svgWrapper.appendChild(timeDisplay);
  card.appendChild(svgWrapper);

  // Duration preset chips
  const presetsRow = document.createElement('div');
  presetsRow.style.cssText = 'display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;';

  PRESETS.forEach((preset) => {
    const chip = document.createElement('button');
    chip.className = preset === totalDuration ? 'btn-primary' : 'btn-ghost';
    chip.style.cssText = 'padding:0.4rem 0.85rem;font-size:0.8rem;border-radius:2rem;min-width:auto;';
    chip.textContent = preset >= 60 ? `${preset / 60}m` : `${preset}s`;
    chip.addEventListener('click', () => {
      selectPreset(preset);
    });
    presetsRow.appendChild(chip);
  });

  card.appendChild(presetsRow);

  // Control buttons
  const controls = document.createElement('div');
  controls.style.cssText = 'display:flex;gap:0.75rem;';

  const startPauseBtn = document.createElement('button');
  startPauseBtn.className = 'btn-primary';
  startPauseBtn.textContent = 'Start';
  startPauseBtn.style.cssText = 'min-width:6rem;';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn-secondary';
  resetBtn.textContent = 'Reset';
  resetBtn.style.cssText = 'min-width:6rem;';

  startPauseBtn.addEventListener('click', toggleStartPause);
  resetBtn.addEventListener('click', resetTimer);

  controls.appendChild(startPauseBtn);
  controls.appendChild(resetBtn);
  card.appendChild(controls);

  // --- Internal functions ---

  function updateDisplay() {
    const ratio = totalDuration > 0 ? remaining / totalDuration : 0;
    const offset = CIRCUMFERENCE * (1 - ratio);

    timeDisplay.textContent = formatTime(remaining);
    progressCircle.setAttribute('stroke-dashoffset', String(offset));
    progressCircle.setAttribute('stroke', getProgressColor(ratio));
  }

  function tick() {
    if (remaining <= 0) {
      stop();
      handleComplete();
      return;
    }
    remaining--;
    updateDisplay();
    if (remaining <= 0) {
      stop();
      handleComplete();
    }
  }

  function start() {
    if (isRunning || remaining <= 0) return;
    isRunning = true;
    startPauseBtn.textContent = 'Pause';
    intervalId = setInterval(tick, 1000);
  }

  function pause() {
    if (!isRunning) return;
    isRunning = false;
    startPauseBtn.textContent = 'Start';
    clearInterval(intervalId);
    intervalId = null;
  }

  function stop() {
    isRunning = false;
    startPauseBtn.textContent = 'Start';
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function toggleStartPause() {
    if (isRunning) {
      pause();
    } else {
      if (remaining <= 0) {
        remaining = totalDuration;
        updateDisplay();
      }
      start();
    }
  }

  function resetTimer() {
    stop();
    remaining = totalDuration;
    updateDisplay();
  }

  function selectPreset(preset) {
    stop();
    totalDuration = preset;
    remaining = preset;
    updateDisplay();

    // Update chip styles
    const chips = presetsRow.querySelectorAll('button');
    chips.forEach((chip, i) => {
      chip.className = PRESETS[i] === preset ? 'btn-primary' : 'btn-ghost';
      chip.style.cssText = 'padding:0.4rem 0.85rem;font-size:0.8rem;border-radius:2rem;min-width:auto;';
    });
  }

  function handleComplete() {
    // Check if sound is enabled via settings
    try {
      const settings = getSettings();
      if (settings && settings.soundEnabled !== false) {
        playBeep();
      }
    } catch {
      // If getSettings fails, play beep anyway
      playBeep();
    }

    // Pulse animation on the SVG wrapper
    gsap.fromTo(
      svgWrapper,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
      }
    );

    if (typeof onComplete === 'function') {
      onComplete();
    }
  }

  // Initial render
  updateDisplay();

  // Cleanup observer — clears interval when element is removed from DOM
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const removed of mutation.removedNodes) {
        if (removed === card || removed.contains?.(card)) {
          stop();
          observer.disconnect();
          return;
        }
      }
    }
  });

  // Start observing once appended
  requestAnimationFrame(() => {
    if (card.parentNode) {
      observer.observe(card.parentNode, { childList: true, subtree: true });
    }
  });

  return card;
}

/**
 * Opens a modal containing a rest timer.
 * @param {Object} options
 * @param {number} [options.duration=90] - Timer duration in seconds
 * @param {Function} [options.onComplete] - Callback when timer completes
 */
export function createTimerModal({ duration = 90, onComplete } = {}) {
  const timerElement = createTimer({
    duration,
    onComplete: () => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        closeModal();
      }, 2000);
    },
  });

  openModal({
    title: 'Rest Timer',
    content: timerElement,
  });
}
