<script>
  import IconBrowseGames from '@metafy/assets/svgs/home/browse_games.svg';
  import IconLeague from '@metafy/assets/svgs/home/league.svg';
  import IconOverwatch from '@metafy/assets/svgs/home/overwatch.svg';
  import { open } from '@metafy/components/BrowseGamesModal.svelte';

  export let compact = false;
  export let expanded = false;
  export let isLoggedIn = false;
  export let isMobile = false;
</script>

<button
  class="flex items-center relative overflow-hidden text-neutrals-l00 font-medium text-sm leading-none bg-neutrals-d10 border border-neutrals-l50 border-opacity-35 hover:border-opacity-50 rounded-md md:pr-3"
  class:compact
  class:expanded
  class:isLoggedIn
  class:isMobile
  on:click={open}
>
  <div class="icon league absolute left-0 flex">
    <svelte:component this={IconLeague} class="m-auto" />
  </div>
  <div class="icon overwatch absolute flex">
    <svelte:component this={IconOverwatch} class="m-auto" />
  </div>
  <div class="icon browse flex relative text-white bg-functional-r20 ml-auto md:mr-3">
    <svelte:component this={IconBrowseGames} class="m-auto" />
  </div>
  <span class="text whitespace-nowrap hidden md:inline" class:xl:hidden={compact && !expanded}
    ><span class="hidden xl:inline">Browse</span>
    Games</span
  >
</button>

<style>
  button {
    width: 64px;
    height: 48px;
    @apply xl:ease-in-out xl:duration-300;
    @screen md {
      width: 129px;
    }
    @screen xl {
      width: 163px;
      height: auto;
      transition-property: width, border-color;

      &:hover {
        width: 200px;
      }
    }

    &.compact {
      height: 32px;

      & .icon {
        width: 24px;
        height: 24px;
        @apply xl:mr-0;
        @screen xl {
          width: 32px;
          height: 32px;
        }
      }

      /* @apply xl:bg-neutrals-d30; */
      & span.text {
        @apply xl:ml-3;
      }
      @screen xl {
        width: 40px;
        height: 42px;
      }
    }
    &.expanded {
      & span.text {
        @apply xl:mr-auto;
      }
      @screen xl {
        width: 100%;
        & .icon.overwatch {
          right: 153px;
        }
        & .icon.browse {
          margin-left: 49px;
        }
      }
    }
    /* Prevent wonky animation when expanding the sidebar. */
    @screen 2xl {
      &.isLoggedIn .icon.overwatch {
        right: 0;
        left: 22px;
      }
    }
  }

  .icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-width: 3px;
    border-style: solid;
    @apply border-neutrals-d10 rounded-md box-content;

    &.league {
      z-index: 0;
      background-color: #1173c6;
    }
    &.overwatch {
      z-index: 1;
      background-color: #313a44;
      right: 16px;
      @screen md {
        right: 83px;
      }
      @screen xl {
        right: 140px;
      }
    }
    &.browse {
      z-index: 2;

      & :global(svg) {
        width: 15px;
        height: 10px;
        @screen xl {
          width: 21px;
          height: 13px;
        }
      }
    }
  }

  button.isMobile {
    @apply w-full border-none;
    & .icon {
      &.league {
        left: -3px;
      }
      &.overwatch {
        left: 17px;
      }
      &.browse {
        left: 37px;
        margin: 0;
      }
    }
    & .text {
      @apply inline absolute;
      left: 85px;
      & span {
        @apply inline;
      }
    }
  }
</style>
