<svelte:options immutable={true} />

<script>
  import { createEventDispatcher, onMount, onDestroy, afterUpdate } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { toggleBodyScroll } from '@metafy/lib/utils';
  import { BREAKPOINTS } from '@metafy/lib/constants';
  import { portal } from '@metafy/components/Portal.svelte';
  import Remove from '@metafy/assets/svgs/remove.svg';

  const dispatch = createEventDispatcher();

  export let isVisible = false;
  /** @type {'center' | 'right'} */
  export let placement = 'center';
  export let widthClass = 'w-11/12 md:w-7/12 xl:w-9/12';
  export let backgroundClass = 'bg-black bg-opacity-90';
  export let backgroundZindex = 'z-modal-backdrop';
  export let modalZindex = 'z-modal';
  export let portalTarget = null;
  export let limitHeight = true;
  export let hasBackground = true;
  export let closeButton = true;
  export let closeOnClickOutside = true;
  export let closeOnEscape = true;
  let className = 'bg-neutrals-d10 shadow';
  export { className as class };
  export let overflow = 'overflow-auto';
  export let rounded = 'rounded-3xl';
  export let ariaLabel = 'modal';
  /** @type {boolean | 'mobile'} */
  export let disableScroll = true;

  let innerWidth;
  let el;
  $: if (
    isVisible &&
    (disableScroll || (disableScroll === 'mobile' && innerWidth < BREAKPOINTS['xl']))
  ) {
    // Prevent body scrolling when modal is open
    toggleBodyScroll(false);
    dispatch('open', { el });
  } else {
    // TODO: Only re-enable scrolling after ALL modals are closed.
    // Re-enable body scrolling after modal is closed
    toggleBodyScroll(true);
    dispatch('close');
  }
  $: flyCoords = placement === 'center' ? { y: 100 } : { x: 100 };

  function onKeyDown(event) {
    // Close on escape key
    if (!closeOnEscape || event.isComposing || event.keyCode !== 27) {
      return;
    }

    close();
  }

  function close() {
    isVisible = false;
  }

  onMount(() => {
    if (isVisible) {
      toggleBodyScroll(false);
    }
  });

  afterUpdate(() => {
    if (isVisible) {
      dispatch('afterVisible');
    }
  });

  onDestroy(() => {
    toggleBodyScroll(true);
  });
</script>

<svelte:window on:keydown={onKeyDown} bind:innerWidth />

<!-- Sometimes we need to use a portal to render the Modal outside of its parent component
  For example, when the Modal is a child of an element that has the `transform` property set, it breaks the modal behaviour. -->
{#if isVisible}
  <div class="absolute" use:portal={portalTarget}>
    {#if hasBackground}
      <!-- Background -->
      <div
        class="block fixed top-0 left-0 w-full h-full {backgroundClass} {backgroundZindex}"
        transition:fade|local={{ duration: 150 }}
        on:click={() => {
          dispatch('clickoutside');

          if (closeOnClickOutside) {
            close();
          }
        }}
      />
    {/if}
    <!-- Modal -->
    <div
      bind:this={el}
      class="modal fixed {modalZindex} {className} {overflow} {widthClass} {rounded}"
      class:center={placement === 'center'}
      class:right={placement === 'right'}
      class:limitHeight
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      transition:fly|local={{ ...flyCoords, duration: 400, easing: cubicInOut }}
    >
      <!-- Close button -->
      {#if closeButton}
        <button
          type="button"
          class="absolute top-7.5 right-7.5 appearance-none focus:outline-none"
          on:click={close}
        >
          <Remove class="w-7.5 h-7.5 text-neutrals-l30" />
        </button>
      {/if}

      <!-- Content -->
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal {
    &.center {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      &.limitHeight {
        max-height: calc(100vh - 4rem);
      }
    }
    &.right {
      top: 0;
      right: 0;
      height: 100%;
    }
  }
</style>
