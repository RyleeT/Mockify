<script>
  import { onMount } from 'svelte';
  import Simplebar from 'simplebar';

  /** @type {'dark' | 'light'} */
  export let kind = 'dark';
  let className = '';
  export { className as class };
  export let height = '';
  export let scrollEl = null;
  export let onScroll = null;

  let el = null;

  onMount(() => {
    scrollEl = new Simplebar(el).getScrollElement();
    if (onScroll) {
      scrollEl.addEventListener('scroll', onScroll);
    }

    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
    };
  });
</script>

<div bind:this={el} class="{kind} {className} {height} overflow-y-auto">
  <slot />
</div>

<style global>
  @import 'simplebar/dist/simplebar.css';

  .light .simplebar-scrollbar:before {
    background: #82878d;
  }
</style>
