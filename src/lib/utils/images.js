import { STATIC_URL, BREAKPOINTS } from '../constants';

function resizeUrl(url, opts = {}) {
  if (!opts.width && !opts.height) {
    throw new Error('Must provide width or height to resizeImage');
  }

  // Apply options
  let query = '';
  ['width', 'height', 'dpr', 'fit', 'gravity', 'quality', 'format', 'sharpen'].forEach((key) => {
    if (key in opts && opts[key] !== undefined) {
      query = `${query},${key}=${opts[key]}`;
    }
  });
  // Drop leading ','
  query = query.slice(1);

  // Always default format to auto.
  if (!opts.format) {
    query = `${query},format=auto`;
  }

  return `${STATIC_URL}/img/${query}/${url.replace(`${STATIC_URL}/`, '')}`;
}

// Create these regexes only once at the top level.
const matchers = {};
const matchersJit = {};
['DEFAULT', ...Object.keys(BREAKPOINTS)].forEach((bp) => {
  const bpKey = bp === 'DEFAULT' ? '' : bp + ':';
  matchers[bp] = {};
  matchersJit[bp] = {};
  ['w', 'h'].forEach((sizeKey) => {
    matchers[bp][sizeKey] = new RegExp(bpKey + sizeKey + '-([0-9.]+)');
    matchersJit[bp][sizeKey] = new RegExp(bpKey + sizeKey + '-\\[([0-9]+)\\px]');
  });
});

/**
 * @param {string} classes A space separated list of Tailwind size classes. Both classic spacing (w-8) and JIT spacing are supported (w-[32px]).
 * @param {'w' | 'h'} key
 * @param {'DEFAULT' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} bp - Breakpoint name
 * @returns {number | undefined}
 */
function extractSize(classes, key, bp) {
  let match = classes.match(matchers[bp][key]);
  if (match) {
    return parseFloat(match[1], 10) * 4;
  }
  match = classes.match(matchersJit[bp][key]);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * @param {string} size - A space separated list of Tailwind size classes. Both classic spacing (w-8) and JIT spacing are supported (w-[32px]).
 * @returns {Object.<string, { width: number, height: number }>}
 */
function extractSizes(size) {
  const sizes = {};
  ['DEFAULT', ...Object.keys(BREAKPOINTS)].forEach((bp) => {
    const width = extractSize(size, 'w', bp);
    const height = extractSize(size, 'h', bp);
    if (width !== undefined || height !== undefined) {
      sizes[bp] = { width, height };
    }
  });
  return sizes;
}

/**
 * @param {string} url
 * @param {string} size - A space separated list of Tailwind size classes. Both classic spacing (w-8) and JIT spacing are supported (w-[32px]).
 * @param {object} opts
 * @returns {Object.<string, string>}
 */
export function resizeImage(url, size, opts) {
  if (size.length === 0 || !url || url.length === 0 || url.split('.').pop() === 'svg') {
    return {};
  }

  const sizes = extractSizes(size);
  if (Object.keys(sizes).length === 0) {
    return {};
  }

  // If the width is not defined we can't build the responsive `srcset`, so instead we just use the image with the biggest height.
  if (Object.values(sizes).every(({ width }) => width === undefined)) {
    const biggest = Object.values(sizes).reduce(
      (acc, v) => {
        if (v.height > acc.height) {
          return v;
        }
        return acc;
      },
      { width: -Infinity, height: -Infinity }
    );
    return {
      src: resizeUrl(url, { ...opts, ...biggest }),
      attributes: biggest
    };
  }

  let srcsetItems = [];
  let sizesItems = [];
  const resized = {};
  for (const [bp, { width, height }] of Object.entries(sizes)) {
    resized[bp] = resizeUrl(url, { ...opts, width, height });

    // Generate `srcset` and `sizes` attributes.
    srcsetItems.push(`${resized[bp]} ${width}w`);
    if (bp === 'DEFAULT') {
      sizesItems.push(width + 'px');
    } else {
      sizesItems.push(`(min-width: ${BREAKPOINTS[bp]}px) ${width}px`);
    }
  }

  // Get smallest size to use for the `width` and `height` attributes.
  const smallestSize = Object.values(sizes).reduce(
    (acc, v) => {
      if (
        (v.width !== undefined && v.width < acc.width) ||
        (v.height !== undefined && v.height < acc.height)
      ) {
        return v;
      }
      return acc;
    },
    { width: Infinity, height: Infinity }
  );

  return {
    srcResized: resized,
    src: resized['DEFAULT'],
    srcset: srcsetItems.join(', '),
    sizes: sizesItems.reverse().join(', '),
    attributes: smallestSize
  };
}
