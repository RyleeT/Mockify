<script>
  import { slide } from 'svelte/transition';

  let className = '';
  export { className as class };
</script>

<div class="pl-7 {className}" transition:slide|local={{ duration: 200 }}>
  <slot />
</div>
