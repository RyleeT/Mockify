<script>
  import { createEventDispatcher, getContext } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { Toasts, dashboardType } from '@metafy/lib/stores';
  import { capitalize } from '@metafy/lib/utils';

  let className = '';
  export { className as class };
  export let notify = false;
  export let isCompact = false;

  const { account } = getContext('app');
  const dispatch = createEventDispatcher();
  $: isCoach = $dashboardType === null ? $account.data.session.roles.includes('coach') : $dashboardType === 'coach';

  function handleSwitch(detail) {
    const currentType = $dashboardType ?? (isCoach ? 'coach' : 'student');
    dispatch('change', detail);
    if (notify && currentType !== detail) {
      Toasts.push({
        kind: 'success',
        content: `Switched to ${capitalize(detail)} Dashboard`,
      });
    }
  }
</script>

<div
  transition:slide|local={{ duration: 200, easing: cubicInOut }}
  class="p-4 mb-6 {className} {isCompact ? 'bg-neutrals-d10 rounded-lg' : 'bg-card rounded-2xl'}"
>
  <div
    transition:fade|local={{ duration: 150, easing: cubicInOut }}
    class={isCompact ? 'flex items-center justify-between' : ''}
  >
    <div class={isCompact ? 'space-y-2.5' : 'space-y-2 mb-3'}>
      {#if isCompact}
        <h3 class="text-xs font-medium leading-none text-white uppercase tracking-0.08">Coach mode</h3>
        <p class="text-xs leading-none text-neutrals-l40">
          You’re currently in {isCoach ? 'coach' : 'student'} mode
        </p>
      {:else}
        <h3 class="text-sm font-medium leading-none text-functional-b10">Switch to Student dashboard</h3>
        <p class="hidden text-xs sm:block text-neutrals-l40">
          You can switch from coach and student dashboards from here
        </p>
      {/if}
    </div>
    <div
      class="relative flex items-center justify-between text-xs font-medium leading-none uppercase rounded-lg tracking-0.08 {isCompact
        ? ''
        : 'bg-card'}"
    >
      <button
        on:click={() => handleSwitch(isCoach ? 'student' : 'coach')}
        class="flex rounded-full w-8.5 {isCompact
          ? 'relative h-4.5 border border-neutrals-l40'
          : 'absolute h-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'} {isCompact && !isCoach
          ? ''
          : 'bg-functional-r20 border-functional-r20'}"
      >
        <span
          style="--tw-translate-x: calc(-100% - 4px)"
          class="w-3 h-3 m-0.5 absolute top-0 bg-white transition-all rounded-full {isCompact
            ? isCoach
              ? 'left-full transform -translate-x-full'
              : 'left-0'
            : isCoach
            ? 'left-0'
            : 'left-full transform -translate-x-full'}"
        />
      </button>

      {#if !isCompact}
        <button
          on:click={() => handleSwitch('coach')}
          class="w-1/2 text-left transition-colors {isCoach
            ? 'text-white text-opacity-100'
            : 'text-neutrals-l40 text-opacity-65 hover:text-opacity-85'} py-3.5 pl-4"
        >
          Coach
        </button>

        <button
          on:click={() => handleSwitch('student')}
          class="w-1/2 text-right transition-colors {isCoach
            ? 'text-neutrals-l40 text-opacity-65 hover:text-opacity-85'
            : 'text-white text-opacity-100'} py-3.5 pr-4"
        >
          Student
        </button>
      {/if}
    </div>
  </div>
</div>
