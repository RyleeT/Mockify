<script context="module">
  import { browser } from '$app/env';

  const threshold = 0.5;
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
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let disabled = false;
  let el = null;

  function onHit(event) {
    dispatch('hit', event);
  }

  onMount(() => {
    observer.observe(el);
    el.addEventListener('visible', onHit);
    return () => {
      observer.unobserve(el);
      el.removeEventListener('visible', onHit);
    };
  });
</script>

<div bind:this={el} class="h-1 w-full" class:hidden={disabled} />
