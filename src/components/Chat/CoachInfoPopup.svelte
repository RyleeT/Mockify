<script>
  import { fly } from 'svelte/transition';
  import CoachInfo from './CoachInfo.svelte';
  import Cross from '@metafy/assets/svgs/cross.svg';

  export let account;
  export let active = false;

  function close() {
    active = false;
  }
</script>

<div
  class="coach-info flex flex-col rounded-lg backdrop-filter backdrop-blur-1.5xl p-5 mx-auto mt-2"
  transition:fly|local={{ y: -20, duration: 200 }}
>
  <div class="flex">
    <button class="focus:outline-none ml-auto" on:click={close}>
      <Cross />
    </button>
  </div>

  <CoachInfo {account} />
</div>

<style>
  .coach-info {
    width: 384px;
    background: linear-gradient(269.77deg, rgba(48, 82, 107, 0.32) 0%, rgba(40, 63, 84, 0.32) 100%);
  }
</style>
