import { writable, get } from 'svelte/store';
import { browser } from '$app/env';

/**
 * @param {string} key - Key used in the localStorage
 * @param {any} [initialValue={}] - Initial value to store in localStorage
 * @returns {Writable<any>} Writable svelte store that persists to localStorage
 */
export function createPersistedStore(key, initialValue = {}) {
  const { subscribe, set, update } = writable(initialValue);

  // Set the value of the store from LS
  if (browser) {
    const item = window.localStorage.getItem(key);
    if (item) {
      set(JSON.parse(item));
    }
  }

  const store = {
    subscribe,
    set: (value) => {
      set(value);
      if (browser) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    },
    get: () => {
      return get(store);
    },
    update: (fn) => {
      const result = get(store);
      const value = fn(result);
      store.set(value);
    },
    clear: () => {
      set(initialValue);
      if (browser) {
        window.localStorage.removeItem(key);
      }
    }
  };
  return store;
}
