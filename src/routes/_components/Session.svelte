<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { parallax } from '@metafy/lib/directives/parallax.js';

  const CHANGE_DURATION = 5000;
  const states = [
    {
      game: 'https://static.metafy.gg/home/session/mordhau.png',
      coach: 'https://static.metafy.gg/home/session/coach_1.png',
    },
    {
      game: 'https://static.metafy.gg/home/session/tft.png',
      coach: 'https://static.metafy.gg/home/session/coach_2.png',
    },
    {
      game: 'https://static.metafy.gg/home/session/mtg.png',
      coach: 'https://static.metafy.gg/home/session/coach_3.png',
    },
  ];

  let showing = 0;
  $: state = states[showing];

  onMount(() => {
    const intervalId = setInterval(() => {
      showing++;
      if (showing === states.length) {
        showing = 0;
      }
    }, CHANGE_DURATION);
    return () => clearInterval(intervalId);
  });
</script>

<div class="session flex xl:w-1/2 relative" use:parallax={{ y: 300, mobile: { y: 0 } }}>
  <img
    class="poly hidden md:block absolute left-0"
    src="https://static.metafy.gg/home/session/poly.png"
    alt="Metafy - Win More"
    width="194"
    height="194"
  />
  <div class="mx-auto relative">
    <img class="bg relative" src="https://static.metafy.gg/home/session/bg.png" alt="Metafy - Win More" />
    {#key showing}
      <img class="game absolute" src={state.game} transition:fade|local={{ duration: 200 }} alt="Game session" />
      <img
        class="coach absolute left-0 bottom-0"
        src={state.coach}
        transition:fade|local={{ duration: 200 }}
        alt="Coach"
      />
    {/key}
  </div>
</div>

<style>
  .session {
    & .poly {
      z-index: 0;
      top: 104px;
    }
    & .bg {
      z-index: 1;
      width: 327px;
      @screen md {
        width: 454px;
        height: 381px;
      }
    }
    & .game {
      z-index: 2;
      width: 310.31px;
      height: 72.17px;
      left: 7.22px;
      top: 33.38px;
      @screen md {
        width: 432px;
        height: 101px;
        top: 46px;
        left: 10px;
      }
    }
    & .coach {
      width: 42px;
      height: 42px;
      @screen md {
        width: 58px;
        height: 58px;
      }
    }
  }
  .bg,
  .session {
    height: 274px;
    @screen md {
      height: 381px;
    }
  }
</style>
