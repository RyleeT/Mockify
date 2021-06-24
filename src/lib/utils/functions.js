import { browser } from '$app/env';
/**
 * Debounce a function for a set amount of time.
 * @param {function} callback - Function to debounce
 * @param {number} wait - Amount of time to debounce the function
 * @returns {function}
 */
export function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

export function toggleBodyScroll(enabled) {
  if (browser && document.body) {
    document.body.classList.toggle('overflow-hidden', !enabled);
  }
}
