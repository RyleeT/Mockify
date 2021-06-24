import { writable, get } from 'svelte/store';

/**
 * Writable store where an object within the array can be removed by a tracked
 * id that we add to the object.
 * @returns {Writable<[]>}
 */
export function createRemovableStore() {
  const { subscribe, update } = writable([]);
  let genId = 0;
  return {
    subscribe,
    /**
     * @param {object} item
     * @returns {object} The item
     */
    push: (options = {}) => {
      const item = { ...options, id: genId++ };
      update(value => [...value, item]);
      return item;
    },
    /**
     * @param {object} item to remove
     */
    remove: item => {
      update(value => value.filter(x => x.id !== item.id));
    },
  };
}
