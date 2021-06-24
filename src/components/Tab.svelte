<script>
  let className = '';
  export { className as class };
  export let padding = 'py-2 px-5';
  export let active = false;
  export let href = '';
</script>

<li
  class="inline-block hover:text-functional-r10 hover:bg-neutrals-d30 text-neutrals-l40 text-sm cursor-pointer transition-all {className}"
  class:active
  on:click
>
  <a
    class="block font-medium focus:outline-none appearance-none transition-colors {padding}"
    {href}
    sveltekit:prefetch
  >
    <slot />
  </a>
</li>

<style>
  li {
    &:hover {
      box-shadow: inset 0px -1px 0px rgba(142, 148, 154, 0.16);
    }
    &.active {
      @apply text-functional-r10;
      box-shadow: inset 0px -2px 0px theme('colors.functional.r10');
    }
  }
</style>
