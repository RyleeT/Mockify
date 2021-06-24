<script>
  import { fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import { tooltip } from '@metafy/lib/directives/tooltip';
  import { chatState } from '@metafy/lib/stores';

  let className = '';
  export { className as class };
  export let href = null;
  export let content = '';
  export let icon;
  export let expanded = false;
  export let activeStartsWith = [];
  export let isMobile = false;
  export let noticeCount = 0;
  export let buttonActive = false;

  let active;
  $: if (href !== null) {
    active = $chatState.expanded
      ? false
      : activeStartsWith.length > 0
      ? $page.path === href || activeStartsWith.some((x) => $page.path.startsWith(`/account/${x}`))
      : href === $page.path;
  }
  $: tooltipContent = expanded ? '' : content;
</script>

<!-- Need to re-render the whole thing each time we expand/unexpand because we only want to show the
  tooltip when the sidebar is collapsed, but the parameters for `use` directives are not reactive. -->
{#key expanded}
  {#if href}
    <a
      {href}
      class={className}
      on:click
      class:active
      class:expanded
      class:isMobile
      sveltekit:prefetch
      use:tooltip={{ content: tooltipContent, disableMobile: true }}
    >
      <svelte:component this={icon} {noticeCount} {isMobile} />
      {#if expanded}<span in:fly|local={{ x: -50, duration: 200 }}>{content}</span>{/if}
    </a>
  {:else}
    <button
      class={className}
      class:active={active || buttonActive}
      class:expanded
      class:isMobile
      on:click
      use:tooltip={{ content: tooltipContent, disableMobile: true }}
    >
      <svelte:component this={icon} {noticeCount} {isMobile} />
      {#if expanded}<span in:fly|local={{ x: -50, duration: 200 }}>{content}</span>{/if}
    </button>
  {/if}
{/key}

<!-- Need to re-render the whole thing each time we expand/unexpand because we only want to show the
  tooltip when the sidebar is collapsed, but the parameters for `use` directives are not reactive. -->
<style>
  a,
  button {
    width: 40px;
    height: 40px;
    @apply flex items-center rounded-md px-2.5;
    @apply transition-colors ease-in-out duration-100;

    & :global(svg) {
      width: 20px;
      height: 20px;
      --primaryColor: #798694;
      --accentColor: white;
      @apply flex-shrink-0;
    }
    & span {
      @apply xl:font-medium text-base xl:text-sm text-neutrals-l00 xl:text-neutrals-l40 leading-none xl:tracking-0.01 whitespace-nowrap;
    }

    &.active {
      &:not(.expanded) {
        background-color: #21242a;
      }
      & span {
        @apply text-neutrals-l00;
      }
      & :global(svg) {
        --primaryColor: theme('colors.functional.r50');
        --accentColor: theme('colors.neutrals.l00');
      }
    }

    &.expanded {
      @apply w-full;
      & span {
        @apply ml-5;
      }
    }

    &:hover {
      background-color: #21242a;
    }

    &.isMobile {
      @apply w-9 h-9 justify-center px-0 rounded-lg bg-transparent;
      & :global(svg) {
        --accentColor: theme('colors.neutrals.l40');
      }
      &.active {
        @apply bg-functional-r20;
        & :global(svg) {
          --primaryColor: theme('colors.white');
          --accentColor: theme('colors.white');
        }
      }
    }
  }
</style>
