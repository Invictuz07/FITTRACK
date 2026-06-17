// src/components/modal.js
// Reusable modal system with GSAP animations
import { html, qs, on, off } from '../utils/dom.js';
import gsap from 'gsap';

let activeOverlay = null;
let activeCloseCallback = null;
let escHandler = null;

/**
 * Opens a modal with custom content.
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string|HTMLElement} options.content - Modal body content
 * @param {Array<{label: string, className: string, onClick: Function}>} [options.actions] - Action buttons
 * @param {Function} [options.onClose] - Callback when modal is closed
 */
export function openModal({ title, content, actions = [], onClose } = {}) {
  // Close any existing modal first
  if (activeOverlay) {
    _removeImmediately();
  }

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title || 'Modal');

  // Build modal content container
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Title
  if (title) {
    const heading = document.createElement('h2');
    heading.className = 'modal-title';
    heading.textContent = title;
    modalContent.appendChild(heading);
  }

  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  modalContent.appendChild(body);

  // Action buttons
  if (actions.length > 0) {
    const footer = document.createElement('div');
    footer.className = 'modal-actions';
    footer.style.cssText = 'display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1.5rem;';
    actions.forEach(({ label, className = 'btn-primary', onClick }) => {
      const btn = document.createElement('button');
      btn.className = className;
      btn.textContent = label;
      if (onClick) {
        btn.addEventListener('click', onClick);
      }
      footer.appendChild(btn);
    });
    modalContent.appendChild(footer);
  }

  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  // Store references
  activeOverlay = overlay;
  activeCloseCallback = onClose || null;

  // Prevent content click from closing overlay
  modalContent.addEventListener('click', (e) => e.stopPropagation());

  // Close on overlay click
  overlay.addEventListener('click', () => closeModal());

  // Close on Escape key
  escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', escHandler);

  // Trigger CSS transition via active class + GSAP entrance
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    gsap.fromTo(
      modalContent,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
  });
}

/**
 * Closes the currently open modal with exit animation.
 */
export function closeModal() {
  if (!activeOverlay) return;

  const overlay = activeOverlay;
  const content = overlay.querySelector('.modal-content');
  const callback = activeCloseCallback;

  // Clean up escape listener
  if (escHandler) {
    document.removeEventListener('keydown', escHandler);
    escHandler = null;
  }

  // Remove active class (CSS transition)
  overlay.classList.remove('active');

  // GSAP reverse animation
  if (content) {
    gsap.to(content, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }

  // Clear references immediately to prevent double-close
  activeOverlay = null;
  activeCloseCallback = null;

  // Remove from DOM after animation completes
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (typeof callback === 'function') {
      callback();
    }
  }, 300);
}

/**
 * Immediately removes the active modal without animation (internal use).
 */
function _removeImmediately() {
  if (!activeOverlay) return;

  if (escHandler) {
    document.removeEventListener('keydown', escHandler);
    escHandler = null;
  }

  if (activeOverlay.parentNode) {
    activeOverlay.parentNode.removeChild(activeOverlay);
  }

  activeOverlay = null;
  activeCloseCallback = null;
}

/**
 * Convenience: confirmation dialog returning a Promise.
 * @param {Object} options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Confirmation message
 * @param {string} [options.confirmText='Confirm'] - Confirm button label
 * @param {string} [options.cancelText='Cancel'] - Cancel button label
 * @param {Function} [options.onConfirm] - Legacy callback on confirm
 * @param {Function} [options.onCancel] - Legacy callback on cancel
 * @returns {Promise<boolean>} Resolves true if confirmed, false if cancelled
 */
export function confirmModal({
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
} = {}) {
  return new Promise((resolve) => {
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    messageParagraph.style.cssText = 'margin:0;line-height:1.6;color:var(--text-secondary, #aaa);';

    openModal({
      title,
      content: messageParagraph,
      actions: [
        {
          label: cancelText,
          className: 'btn-secondary',
          onClick: () => {
            closeModal();
            if (typeof onCancel === 'function') onCancel();
            resolve(false);
          },
        },
        {
          label: confirmText,
          className: 'btn-primary',
          onClick: () => {
            closeModal();
            if (typeof onConfirm === 'function') onConfirm();
            resolve(true);
          },
        },
      ],
      onClose: () => {
        // If closed via overlay/escape without clicking a button, treat as cancel
        if (typeof onCancel === 'function') onCancel();
        resolve(false);
      },
    });
  });
}
