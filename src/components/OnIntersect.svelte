<script context="module">
  import { browser } from '$app/env';

  const threshold = 0.25;
  let observer;
  if (browser && observer === undefined) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.dispatchEvent(new CustomEvent('visible', { detail: entry.isIntersecting }));
        }
      },
      { threshold }
    );
  }
</script>

<script>
  import { onMount } from 'svelte';

  let className = '';
  export { className as class };

  let isVisible = false;
  let el = null;

  let showDirectly = false;
  let scrollY;
  let isMounted = false;

  function changeVisibility(event) {
    // Don't hide elements if they are visible.
    if (!isVisible) {
      isVisible = event.detail;
    }
  }

  onMount(() => {
    // Only hide the element using opacity after the JS is loaded (so we don't have a blank page while JS is loading).
    isMounted = true;

    // If the page is first loaded scrolled down (for example after a refresh, or when going back)
    // then show all elements directly, not when they come into view.
    showDirectly = scrollY > 0;

    observer.observe(el);
    el.addEventListener('visible', changeVisibility);

    return () => {
      observer.unobserve(el);
      el.removeEventListener('visible', changeVisibility);
    };
  });
</script>

<svelte:window bind:scrollY />

<div bind:this={el} class={className}>
  {#if isVisible || showDirectly}
    <slot />
  {:else}
    <div class:opacity-0={isMounted}>
      <slot />
    </div>
  {/if}
</div>
