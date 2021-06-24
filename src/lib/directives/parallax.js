import { browser } from '$app/env';
import { BREAKPOINTS } from '@metafy/lib/constants';

let observer;
if (browser && observer === undefined) {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.setAttribute('visible', entry.isIntersecting);
    }
  });
}

export function parallax(node, options) {
  // TODO: passing in arguments for different views should be more flexible, maybe an option for each breakpoint
  if (window.innerWidth < BREAKPOINTS.xl && options.mobile) {
    options.y = options.mobile.y;
  }

  observer.observe(node);

  let ticking = false;
  function translateElement() {
    if (node.getAttribute('visible') !== 'true') {
      return;
    }

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const { y, height } = node.getBoundingClientRect();
        const perc = 1 - (y + height / 2) / window.innerHeight;
        if (perc > 1 || perc < 0) {
          ticking = false;
          return;
        }

        // TODO: make translation on both axes work too
        node.style.transform = `translateY(${options.y * perc}px)`;

        ticking = false;
      });
      ticking = true;
    }
  }

  const classes = ['transition-transform', 'ease-linear'];
  node.classList.add(...classes);
  node.style.transitionDuration = '4ms';

  // Translate the element once when the page loads to prevent jankiness on first scroll
  window.addEventListener('load', translateElement);
  window.addEventListener('scroll', translateElement);

  return {
    destroy() {
      observer.unobserve(node);
      window.removeEventListener('scroll', translateElement);
      node.classList.remove(...classes);
      node.style.transitionDuration = '0';
    }
  };
}
