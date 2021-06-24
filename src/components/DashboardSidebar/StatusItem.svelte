<script>
  export let status = {};
  export let active = false;

  const { href, type, title, icon, color } = status;
</script>

<a
  {href}
  class="flex items-center h-6 space-x-3 text-xs transition-colors {active
    ? 'text-opacity-100 text-white'
    : 'text-neutrals-l40 text-opacity-65 hover:text-opacity-100 hover:text-white'}"
  sveltekit:prefetch
>
  <span class={icon ? 'flex justify-center w-1.5' : `w-1.5 h-1.5 rounded ${color}`}>
    {#if icon}
      <svelte:component this={icon} />
    {/if}
  </span>
  <span class="truncate">
    {title}
  </span>
</a>
