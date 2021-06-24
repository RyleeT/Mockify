<svelte:options immutable />

<script>
  import { onMount } from 'svelte';

  let progress = 0;
  onMount(() => {
    function next() {
      progress += 0.1;
      const remaining = 1 - progress;
      if (remaining > 0.15) {
        setTimeout(next, 500 / remaining);
      }
    }
    setTimeout(next, 250);
  });
</script>

<div
  class="bg-functional-r20 h-1 fixed top-0 left-0 z-50 transition-all duration-300"
  style="width: {progress * 100}%"
/>
