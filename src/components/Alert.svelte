<script>
  export let icon = null;
  export let title = '';
  export let description = '';
  export let backgroundColor = 'bg-neutrals-d80';
  export let textColor = 'text-white';
  export let descriptionColor = 'text-neutrals-l40';

  let className = '';
  export { className as class };
</script>

<div
  class="p-3 md:p-4 min-h-[40px] items-center space-y-3 rounded-2xl {backgroundColor} {textColor} {className}"
>
  <div class="flex items-center space-x-3">
    {#if icon}
      <span>
        <svelte:component this={icon} class="w-4 h-4" />
      </span>
    {/if}

    <p class="text-sm font-medium leading-none">{title}</p>
  </div>

  {#if description}
    <p class="text-sm leading-normal {descriptionColor}">{description}</p>
  {/if}
</div>
