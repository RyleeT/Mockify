import tippy, { followCursor, roundArrow } from 'tippy.js';
import { BREAKPOINTS } from '@metafy/lib/constants';

/**
 * Tooltip directive.
 * @param {HTMLElement} node
 * @param {{
 *  allowHTML: boolean
 *  theme: 'black' | 'blue' | 'seek-cursor' | 'comment' | undefined
 * }} options
 */
export function tooltip(node, options) {
  options = {
    placement: 'right',
    allowHTML: false,
    theme: 'black',
    arrow: options.theme === 'comment' ? wideRoundArrow + wideRoundArrow : roundArrow + roundArrow,
    animation: 'shift-away-subtle',
    // If trigger is on click, automatically hide it after 1 seconds.
    onShow:
      options.trigger === 'click'
        ? (instance) => {
            window.setTimeout(instance.hide, 1000);
          }
        : undefined,
    ...options
  };
  // Disable on mobile if option is given, and disable if content is falsey
  const isMobile = window.innerWidth < BREAKPOINTS.xl;
  if ((options.disableMobile && isMobile) || !options.content) {
    return;
  }
  delete options.disableMobile;

  if (options.followCursor) {
    options.plugins = [followCursor];
  }

  node.dataset.id = 'metafy-tooltip';

  if (isMobile && options.placementMobile) {
    options.placement = options.placementMobile;
  }

  const instance = tippy(node, {
    ...options,
    duration: 150
  });

  const updateContent = () => {
    if (typeof options.content === 'function') {
      instance.setContent(options.content());
    }
  };
  if (options.updateOnMousemove) {
    node.addEventListener('mousemove', updateContent);
  }
  return {
    destroy() {
      instance.destroy();
      if (options.updateOnMousemove) {
        node.removeEventListener('mousemove', updateContent);
      }
    }
  };
}

const wideRoundArrow = `<svg width="37" height="10" viewBox="0 0 37 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 10H36.5L33 10C29.2229 10 25.6663 8.22167 23.4 5.2L20.4 1.2C19.2 -0.400001 16.8 -0.4 15.6 1.2L12.6 5.2C10.3337 8.22167 6.77709 10 3 10Z" fill="#030404"/>
</svg>`;
