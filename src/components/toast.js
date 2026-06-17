// src/components/toast.js
// Notification toast system

const DEFAULT_ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  achievement: '🏆',
};

/** @type {HTMLElement|null} */
let container = null;

/**
 * Returns (or creates) the singleton toast container element.
 * @returns {HTMLElement}
 */
function getContainer() {
  if (container && container.parentNode) {
    return container;
  }

  // Check if one already exists in the DOM
  container = document.querySelector('.toast-container');
  if (container) return container;

  container = document.createElement('div');
  container.className = 'toast-container';
  container.style.cssText = `
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  return container;
}

/**
 * Shows a toast notification.
 * @param {Object} options
 * @param {string} options.message - Toast message text
 * @param {'info'|'success'|'error'|'achievement'} [options.type='info'] - Toast type
 * @param {number} [options.duration=3000] - Display duration in ms
 * @param {string} [options.icon] - Optional icon emoji override
 */
export function showToast({ message, type = 'info', duration = 3000, icon } = {}) {
  const toastContainer = getContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.pointerEvents = 'auto';

  // Resolve icon
  const resolvedIcon = icon || DEFAULT_ICONS[type] || DEFAULT_ICONS.info;

  // Build content
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.style.cssText = 'margin-right:0.5rem;font-size:1.1em;flex-shrink:0;';
  iconSpan.textContent = resolvedIcon;

  const messageSpan = document.createElement('span');
  messageSpan.className = 'toast-message';
  messageSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(messageSpan);

  toastContainer.appendChild(toast);

  // Trigger slide-in animation via CSS class
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Schedule dismissal
  const dismissTimeout = setTimeout(() => {
    dismiss(toast);
  }, duration);

  // Allow click-to-dismiss
  toast.addEventListener('click', () => {
    clearTimeout(dismissTimeout);
    dismiss(toast);
  });
}

/**
 * Dismisses a toast element with exit animation.
 * @param {HTMLElement} toast
 */
function dismiss(toast) {
  toast.classList.remove('show');

  // Remove from DOM after CSS transition completes
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }

    // Clean up empty container
    if (container && container.children.length === 0 && container.parentNode) {
      container.parentNode.removeChild(container);
      container = null;
    }
  }, 400);
}

/**
 * Shows a success toast.
 * @param {string} message
 */
export function showSuccess(message) {
  showToast({ message, type: 'success' });
}

/**
 * Shows an error toast.
 * @param {string} message
 */
export function showError(message) {
  showToast({ message, type: 'error' });
}

/**
 * Shows an info toast.
 * @param {string} message
 */
export function showInfo(message) {
  showToast({ message, type: 'info' });
}
