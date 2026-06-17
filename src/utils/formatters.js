const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format a date as 'Jan 15, 2025'.
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format a date as 'MM/DD'.
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateShort(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}`;
}

/**
 * Format a date as relative time ('just now', '5 min ago', etc.).
 * Falls back to formatDate for anything older than 7 days.
 * @param {Date|string} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const d = new Date(date);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60)  return 'just now';
  if (diffMin < 60)  return `${diffMin} min ago`;
  if (diffHr < 24)   return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay === 1)  return 'yesterday';
  if (diffDay <= 7)   return `${diffDay} days ago`;
  return formatDate(d);
}

/**
 * Format a number with commas and optional decimal places.
 * @param {number} n
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatNumber(n, decimals = 0) {
  return Number(n).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a calorie value with 'kcal' suffix.
 * @param {number} n
 * @returns {string}
 */
export function formatCalories(n) {
  return formatNumber(n) + ' kcal';
}

/**
 * Format a weight value with unit suffix.
 * @param {number} n
 * @param {string} [units='metric'] - 'metric' for kg, 'imperial' for lbs
 * @returns {string}
 */
export function formatWeight(n, units = 'metric') {
  return units === 'imperial'
    ? formatNumber(n, 1) + ' lbs'
    : formatNumber(n, 1) + ' kg';
}

/**
 * Format a height value.
 * Metric: '175 cm'. Imperial: 5'9" format.
 * @param {number} n - Height in cm
 * @param {string} [units='metric']
 * @returns {string}
 */
export function formatHeight(n, units = 'metric') {
  if (units === 'imperial') {
    const totalInches = n / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(n)} cm`;
}

/**
 * Return a time-of-day greeting.
 * @returns {string}
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Return today's date as a 'YYYY-MM-DD' ISO string.
 * @returns {string}
 */
export function getTodayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generate a unique-ish ID string.
 * @returns {string}
 */
export function generateId() {
  const hex = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
  return `ft_${Date.now()}_${hex}`;
}
