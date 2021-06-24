<script>
  import { draw, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { Toasts } from '@metafy/lib/stores';
  import { flyScale } from '@metafy/lib/transitions';

  const DEFAULT_DURATION = 3000;
  const placementClass = {
    left: 'mr-auto',
    right: 'ml-auto',
    center: 'mx-auto'
  };
  const KIND_CLASSES = {
    info: {
      background: 'bg-neutrals-l40',
      color: 'text-white'
    },
    attention: {
      background: 'bg-functional-y20',
      color: 'text-functional-y20'
    },
    error: {
      background: 'bg-functional-r50',
      color: 'text-functional-r50'
    },
    success: {
      background: 'bg-functional-g30',
      color: 'text-functional-g30'
    }
  };

  /** Directive that creates a delete timer if needed */
  function initializeToast(node, options) {
    const { toast } = options;
    if (toast.duration === undefined) {
      toast.duration = DEFAULT_DURATION;
    }
    let timerId;
    // If duration is <= 0, don't hide automatically.
    if (toast.duration > 0) {
      timerId = setTimeout(() => {
        onClose(toast);
      }, toast.duration);
    }
    return {
      destroy() {
        if (toast.duration > 0) {
          clearTimeout(timerId);
        }
      }
    };
  }

  /** Returns the desired opacity for the index */
  function getOpacity(index) {
    const opacities = ['opacity-40', 'opacity-65', 'opacity-100'];
    return opacities[3 - toasts.length + index];
  }

  function getPlacementClass(toast) {
    return placementClass[toast.placement || 'right'];
  }

  /** Close the toast and remove it from the store */
  function onClose(toast) {
    if (toast.onClose) {
      toast.onClose();
    }
    Toasts.remove(toast);
  }

  /** Remove the current toast and execute the action clicked */
  function onActionClick(toast, action) {
    Toasts.remove(toast);
    action.func(toast);
  }

  // Grab the 3 most recent toasts
  $: toasts = $Toasts.slice(Math.min(Math.max($Toasts.length - 3, 0), $Toasts.length));
</script>

<!-- Toasts are used to display important messaging to the user in a prominent way -->
<div class="fixed w-full pointer-events-none left-0 bottom-0 p-6 sm:p-5 z-toast">
  <div class="flex flex-col items-start space-y-5">
    {#each toasts as toast, index (toast.id)}
      <button
        class="{KIND_CLASSES[toast.kind].background} {getOpacity(index)} {getPlacementClass(
          toast
        )} bg-opacity-25 relative w-full sm:w-auto pointer-events-auto inline-flex items-center shadow-lg rounded-lg p-3 pr-5 backdrop-filter backdrop-blur-md"
        on:click={() => onClose(toast)}
        in:flyScale|local={{ translate: { x: 100 }, scale: { x: 0, y: 0 }, duration: 500 }}
        animate:flip={{ duration: 200 }}
        use:initializeToast={{ toast }}
      >
        <!-- Toast icon. -->
        <span in:fade|local={{ duration: 300, delay: 300 }}>
          {#if toast.kind === 'info'}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#21252A" />
              <rect
                in:draw|local={{ duration: 400, delay: 200 }}
                x="15"
                y="15"
                width="2"
                height="8"
                rx="1"
                fill="white"
              />
              <circle
                in:draw|local={{ duration: 400, delay: 200 + 300 }}
                cx="15.9998"
                cy="11.3333"
                r="1.33333"
                fill="white"
              />
            </svg>
          {:else if toast.kind === 'attention'}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#EE6B0D" />
              <path
                in:draw|local={{ duration: 400, delay: 200 }}
                d="M13.827 10.2537C13.6948 9.32809 14.413 8.5 15.348 8.5H16.7612C17.6961 8.5 18.4143 9.32809 18.2821 10.2536L17.3029 17.1083C17.2141 17.7295 16.6821 18.191 16.0546 18.191C15.427 18.191 14.895 17.7295 14.8063 17.1083L13.827 10.2537Z"
                stroke="white"
              />
              <circle
                in:draw|local={{ duration: 400, delay: 200 + 300 }}
                cx="16.0544"
                cy="22.7637"
                r="1.53637"
                stroke="white"
              />
            </svg>
          {:else if toast.kind === 'error'}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#F14343" />
              <path
                in:draw|local={{ duration: 400, delay: 200 }}
                d="M11.1819 11.1818L21.2099 21.2099"
                stroke="white"
                stroke-width="1.77273"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                in:draw|local={{ duration: 400, delay: 200 + 300 }}
                d="M21.2099 11.1818L11.1818 21.2099"
                stroke="white"
                stroke-width="1.77273"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {:else if toast.kind === 'success'}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#239F5C" />
              <path
                in:draw|local={{ duration: 400, delay: 200 }}
                d="M9.55093 17.3099L14.0047 21.4211L22.9123 11.4"
                stroke="white"
                stroke-width="2.14737"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
        </span>

        <div class="flex items-center ml-3">
          {#if toast.content}
            <p
              in:fade|local={{ duration: 300, delay: 200 }}
              class="font-medium text-neutrals-l00 text-left"
            >
              {toast.content}
            </p>
          {/if}
          <!-- Actions -->
          {#if toast.actions}
            <div class="w-px flex-shrink-0 h-6 bg-neutrals-l50 bg-opacity-25 mx-3" />
            {#each toast.actions as action, idx (idx)}
              <button
                class="font-medium text-sm md:text-base leading-none {KIND_CLASSES[toast.kind]
                  .color}"
                on:click={() => onActionClick(toast, action)}
              >
                {action.content}
              </button>
            {/each}
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
