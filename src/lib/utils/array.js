/**
 * Shuffle an array.
 * @param {any[]} array - Array of data to shuffle.
 * @returns {any[]} Shuffled array
 */
export function shuffle(array) {
  const arr = [...(array || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function xor(seed) {
  const baseSeeds = [123456789, 362436069, 521288629, 88675123];
  let [x, y, z, w] = baseSeeds;

  const random = () => {
    const t = x ^ (x << 11);
    [x, y, z] = [y, z, w];
    w = w ^ (w >> 19) ^ (t ^ (t >> 8));
    return w / 0x7fffffff;
  };

  [x, y, z, w] = baseSeeds.map(i => i + seed);
  [x, y, z, w] = [0, 0, 0, 0].map(() => Math.round(random() * 1e16));

  return random;
}

/**
 * @param {[]} array
 * @param {number} seed
 * @returns {[]} Shuffled array with predictable output based on seed.
 */
export function shuffleWithSeed(array, seed) {
  let copy = [...array];
  let m = copy.length;
  let t;
  let i;

  const fn = xor(seed);

  while (m) {
    i = Math.floor(fn() * m--);
    t = copy[m];
    copy[m] = copy[i];
    copy[i] = t;
  }

  return copy;
}

/**
 * @param {any[]} array - Array of data
 * @param {number} size - Size of array to chunk
 * @returns {any[]} Chunked array by size
 * */
export function chunk(array, size) {
  return array.reduce((arr, item, idx) => {
    return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
}

/**
 * @param {[object]} items - A list of objects
 * @param {Function | string} getter - A function or key to use in order to determine uniqueness
 * @returns {[object]} The unique list of objects
 * @example uniqueBy([{ id: 1 }, { id: 1 }], 'id'); // [{ id: 1 }]
 */
export function uniqueBy(items, getter) {
  const getterFn = typeof getter === 'function' ? getter : item => item[getter];
  const uniqueKeys = [...new Set(items.map(getterFn))];
  return uniqueKeys.map(k => items.find(item => getterFn(item) === k));
}

/**
 * @param {object[]} lessons
 * @param {'live' | 'replay'} type
 * @returns {number}
 */
export function lessonTotal(lessons = [], type) {
  return lessons
    .filter(l => l.type === type)
    .reduce((acc, m) => {
      if (type === 'live') {
        return m.duration + acc;
      } else if (type === 'replay') {
        return m.amount + acc;
      }
    }, 0);
}
