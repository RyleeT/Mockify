export function countUp(node, { duration = 3000 }) {
  if (!node.tagName === 'SPAN') {
    throw new Error(`This transition only works on <span> elements`);
  }

  const number = parseInt(node.textContent);
  node.textContent = '0';

  return {
    duration,
    tick: t => {
      node.textContent = Math.ceil(t * number);
    },
  };
}
