<script>
  import { page } from '$app/stores';
  import { goto, prefetch } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import { dashboardState } from '@metafy/lib/stores';

  const dispatch = createEventDispatcher();

  export let href = '';
  export let icon;
  export let name;
  export let iconColor = '';
  export let isFolder = false;
  export let active = false;
  export let isMobile = false;
  let className = '';
  export { className as class };

  $: isActive = !isMobile && (active || (href && $page.path === href));

  function handleClick() {
    if (href) {
      goto(href);
      if (isMobile) {
        dashboardState.update((s) => ({ ...s, mobileVisible: false }));
      }
    } else {
      dispatch('click');
    }
  }

  function handleMouseEnter() {
    if (href) {
      prefetch(href);
    }
  }
</script>

<div
  class="nav-root flex items-center justify-between -mx-2 px-2 h-9 rounded-md cursor-pointer hover:bg-neutrals-d00 {className}"
  class:isActive
  class:isMobile
  class:isFolder
  on:click={handleClick}
  on:mouseenter={handleMouseEnter}
>
  <div class="flex items-center">
    <div class="icon-wrap mr-3 w-4 flex justify-center items-center">
      {#if typeof icon === 'function'}
        <svelte:component this={icon} />
      {:else}
        <img src={icon} width="16" height="16" alt={name} />
      {/if}
    </div>
    <div class="nav-name leading-none text-sm text-neutrals-l40">{name}</div>
  </div>
  {#if iconColor}
    <div class="w-1.5 h-1.5 rounded {iconColor}" />
  {:else}
    <slot name="right-content" />
  {/if}
</div>

<style>
  .nav-root {
    & :global(svg) {
      --primaryColor: theme('colors.white');
      --accentColor: theme('colors.white');
    }
    &:hover,
    &.isActive {
      & .nav-name {
        @apply text-white;
      }
    }
    &.isActive {
      @apply font-medium;
      & :global(svg) {
        --primaryColor: theme('colors.functional.r50');
      }
    }
    &.isMobile {
      @apply h-6;
      & .icon-wrap {
        @apply mr-4 h-6 w-6;
        & :global(svg),
        & img {
          @apply w-4 h-4;
          --primaryColor: theme('colors.neutrals.l40');
          --accentColor: theme('colors.neutrals.l40');
        }
      }
      & .nav-name {
        @apply text-white;
      }
      &.isFolder {
        & .icon-wrap {
          @apply bg-transparent;
          & :global(svg) {
            width: 13px;
            height: 11px;
            --primaryColor: theme('colors.white');
          }
        }
        & .nav-name {
          @apply text-neutrals-l40;
        }
      }
    }
  }
</style>
