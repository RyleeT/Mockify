<script>
  export let title = 'Show more';
  export let hasShadow = false;
  export let display = 'flex';
  let className = '';
  export { className as class };
</script>

<div class="relative z-0 items-center {display} {className}">
  {#if hasShadow}
    <div
      class="absolute left-0 w-full pointer-events-none bottom-1/2 h-68 bg-gradient-to-t from-neutrals-d30 to-transparent -z-1"
    />
  {/if}
  <span class="flex-1 flex-shrink-0 h-px rounded-full bg-opacity-30 bg-neutrals-l40" />
  <button
    on:click
    class="inline-flex items-center h-10 px-8 transition-colors border cursor-pointer border-neutrals-l40 border-opacity-30 hover:border-opacity-50 sm:h-12 sm:px-6 rounded-xl sm:rounded-2xl"
  >
    <span
      class="text-sm text-transparent  bg-clip-text bg-gradient-to-r from-functional-r50 to-functional-b10 sm:text-base lg:text-xl"
    >
      {title}
    </span>
  </button>
  <span class="flex-1 flex-shrink-0 h-px rounded-full bg-opacity-30 bg-neutrals-l40" />
</div>
