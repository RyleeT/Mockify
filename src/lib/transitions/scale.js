import { cubicOut } from 'svelte/easing';

export function flyScale(
  node,
  {
    delay = 0,
    duration = 400,
    easing = cubicOut,
    translate = {
      x: 0,
      y: 0,
    },
    scale = {
      x: 1,
      y: 1,
    },
    opacity = 0,
  }
) {
  translate.x = translate.x ?? 0;
  translate.y = translate.y ?? 0;
  scale.y = scale.y ?? 0;
  scale.y = scale.y ?? 0;

  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;

  const od = target_opacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (t, u) => {
      return `
			transform: ${transform} translate(${(1 - t) * translate.x}px, ${(1 - t) * translate.y}px) scale(${
        scale.x + (1 - scale.x) * t
      }, ${scale.y + (1 - scale.y) * t});
			opacity: ${target_opacity - od * u}`;
    },
  };
}

export function scaleFrom(
  node,
  { delay = 0, duration = 400, easing = cubicOut, scaleTargetX, scaleTargetY, translateTargetX, translateTargetY }
) {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  let scaleX, scaleY;
  let translateX, translateY;
  if (transform === '') {
    const transform = getTransformForPixels(node, scaleTargetX, scaleTargetY, translateTargetX, translateTargetY);
    scaleX = transform.scaleX;
    scaleY = transform.scaleY;
    translateX = transform.translateX;
    translateY = transform.translateY;
  }

  const ssx = 1 - scaleX;
  const ssy = 1 - scaleY;

  function getTransformForPixels(node, scaleTargetX, scaleTargetY, translateTargetX, translateTargetY) {
    let scaleX = 1,
      scaleY = 1;
    let foundScaleX = false,
      foundScaleY = false;
    while (true) {
      const { x, y, width, height } = node.getBoundingClientRect();

      if (!foundScaleX) {
        if (width - scaleTargetX < 0.1) {
          foundScaleX = true;
        } else {
          scaleX -= 0.001;
        }
      }
      if (!foundScaleY) {
        if (height - scaleTargetY < 0.1) {
          foundScaleY = true;
        } else {
          scaleY -= 0.001;
        }
      }

      if (foundScaleX && foundScaleY) {
        const res = { scaleX, scaleY, translateX: translateTargetX - x, translateY: translateTargetY - y };
        node.style.transform = '';
        return res;
      }

      node.style.transform = `scale(${scaleX}, ${scaleY})`;
    }
  }

  return {
    delay,
    duration,
    easing,
    css: (t, u) =>
      `transform: ${transform} translate(${(1 - t) * translateX}px, ${(1 - t) * translateY}px) scale(${1 - ssx * u}, ${
        1 - ssy * u
      });`,
  };
}
