/**
 * Create a DOM element with attributes and children.
 * @param {string} tag                - HTML tag name
 * @param {Object} [attributes={}]    - Attributes, event handlers, dataset, className, innerHTML
 * @param {...(string|HTMLElement)} children - Child elements or text strings
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      el.setAttribute('class', value);
    } else if (key === 'innerHTML') {
      el.innerHTML = value;
    } else if (key === 'dataset') {
      for (const [dataKey, dataVal] of Object.entries(value)) {
        el.dataset[dataKey] = dataVal;
      }
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof HTMLElement) {
      el.appendChild(child);
    }
  }

  return el;
}

/**
 * Parse an HTML string and return the first child element.
 * @param {string} templateString - Raw HTML
 * @returns {HTMLElement}
 */
export function html(templateString) {
  const tpl = document.createElement('template');
  tpl.innerHTML = templateString.trim();
  return tpl.content.firstElementChild;
}

/**
 * Clear a container and mount an element into it.
 * @param {HTMLElement} container
 * @param {HTMLElement} element
 */
export function mount(container, element) {
  container.innerHTML = '';
  container.appendChild(element);
}

/**
 * querySelector shorthand.
 * @param {string} selector
 * @param {HTMLElement|Document} [parent=document]
 * @returns {HTMLElement|null}
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * querySelectorAll shorthand, returns a real Array.
 * @param {string} selector
 * @param {HTMLElement|Document} [parent=document]
 * @returns {HTMLElement[]}
 */
export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

/**
 * addEventListener shorthand.
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} handler
 */
export function on(element, event, handler) {
  element.addEventListener(event, handler);
}

/**
 * removeEventListener shorthand.
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} handler
 */
export function off(element, event, handler) {
  element.removeEventListener(event, handler);
}

/**
 * Animate a number counting up from 0 to target inside an element.
 * Formats values > 999 with commas.
 * @param {HTMLElement} element  - Element whose textContent will be updated
 * @param {number} target       - Target number to count up to
 * @param {number} [duration=1000] - Animation duration in ms
 */
export function countUp(element, target, duration = 1000) {
  const start = performance.now();
  const format = (n) => {
    const rounded = Math.round(n);
    return rounded > 999
      ? rounded.toLocaleString('en-US')
      : String(rounded);
  };

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out quad for a satisfying deceleration
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = eased * target;

    element.textContent = format(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = format(target);
    }
  }

  requestAnimationFrame(step);
}
