<script>
  import { tick, onDestroy, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createPopper } from '@popperjs/core';
  import ClickOutside from 'svelte-click-outside';

  export let isVisible = false;
  export let placement = 'bottom';
  export let positionFixed = false;
  export let eventsEnabled = false;
  export let matchWidth = false;
  export let offset = [0, 0];
  export let minWidth = 255;
  /** @type {'click' | 'mouseenter' | 'manual'} */
  export let trigger = 'click';
  export let closeOnClickOutside = true;
  export let disabled = false;
  export let containerClass = '';
  export let contentClass = 'bg-neutrals-l20 shadow-md rounded';

  const dispatch = createEventDispatcher();

  let parentElement = null;
  let popperElement = null;
  let popperInstance = null;

  onDestroy(() => {
    if (popperInstance !== null) {
      popperInstance.destroy();
    }
  });

  async function showPopper(value) {
    isVisible = value;
    if (isVisible) {
      if (popperInstance !== null) {
        popperInstance.destroy();
        popperInstance = null;
      }
      await tick();
      popperInstance = createPopper(parentElement, popperElement, {
        placement,
        strategy: positionFixed ? 'fixed' : 'absolute',
        modifiers: [
          {
            name: 'setWidth',
            enabled: matchWidth,
            phase: 'beforeWrite',
            requires: ['computeStyles'],
            fn: ({ state }) => {
              state.styles.popper.width = `${Math.round(state.rects.reference.width)}px`;
            },
            effect: ({ state }) => {
              state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
            }
          },
          {
            name: 'flip',
            enabled: true
          },
          {
            name: 'offset',
            options: {
              offset
            }
          },
          {
            name: 'eventListeners',
            options: {
              scroll: eventsEnabled,
              resize: eventsEnabled
            }
          }
        ]
      });
      dispatch('open');
    } else {
      dispatch('close');
    }
  }

  // When hovering over the trigger *or* the content, increment, when leaving, decrement.
  // If it reaches 0 close the dropdown.
  let triggerMouseEntered = 0;
  function handleTriggerMouseenter() {
    // Can't be bigger than 2
    if (disabled || trigger !== 'mouseenter' || triggerMouseEntered >= 1) {
      return;
    }
    triggerMouseEntered++;
  }
  function handleTriggerMouseleave() {
    // Can't be less than 0
    if (disabled || trigger !== 'mouseenter' || triggerMouseEntered <= 0) {
      return;
    }
    triggerMouseEntered--;
  }
  $: if (trigger === 'mouseenter') {
    isVisible = triggerMouseEntered > 0;
  }

  $: showPopper(isVisible);
</script>

<div bind:this={parentElement} class={containerClass}>
  {#if trigger !== 'manual'}
    <div
      on:click={() => {
        if (disabled || trigger !== 'click') {
          return;
        }
        isVisible = !isVisible;
        dispatch('click');
      }}
      on:mouseenter={handleTriggerMouseenter}
      on:mouseleave={handleTriggerMouseleave}
    >
      <slot name="trigger" />
    </div>
  {/if}
  {#if isVisible}
    <ClickOutside
      on:clickoutside={() => {
        if (trigger !== 'manual' && closeOnClickOutside) {
          isVisible = false;
          dispatch('click');
        }
      }}
      exclude={[parentElement]}
    >
      <div
        class="z-dropdown {contentClass}"
        style="min-width: {minWidth}px"
        bind:this={popperElement}
        on:mouseenter={handleTriggerMouseenter}
        on:mouseleave={handleTriggerMouseleave}
        transition:fade|local={{ duration: 150 }}
      >
        <slot name="content" />
      </div>
    </ClickOutside>
  {/if}
</div>
