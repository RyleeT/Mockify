<script>
  import { BREAKPOINTS } from '@metafy/lib/constants';
  import IconIntercom from '@metafy/assets/svgs/intercom.svg';

  let innerWidth;
  let retryTimes = 0;
  const MAX_RETRY_TIMES = 10;

  function initializeIntercom(hide_default_launcher) {
    if (window.Intercom?.booted) {
      window.Intercom('boot', { hide_default_launcher });
    } else {
      // Limit how many times we try to run this function. User might be blocking the
      // Intercom script from loading and therefore be running this timeout forever.
      if (retryTimes >= MAX_RETRY_TIMES) {
        return;
      }
      retryTimes++;
      setTimeout(() => initializeIntercom(hide_default_launcher), 1000);
    }
  }

  $: isMobile = innerWidth < BREAKPOINTS.xl;
  $: process.browser && initializeIntercom(isMobile);

  function onClick() {
    if (window.Intercom) {
      window.Intercom('show');
    }
  }
</script>

<svelte:window bind:innerWidth />

<button class="xl:hidden fixed z-[49] right-5 bottom-[76px] w-12 h-12" on:click={onClick}>
  <IconIntercom />
</button>
