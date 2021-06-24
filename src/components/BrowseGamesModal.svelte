<script context="module">
  import { writable } from 'svelte/store';

  let isVisible = writable(false);

  export function open() {
    isVisible.set(true);
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { searchIndex } from '@metafy/lib/utils';

  import Modal from '@metafy/components/Modal.svelte';
  import Image from '@metafy/components/Image.svelte';
  import GamePoster from '@metafy/components/GamePoster.svelte';
  import FormControl from '@metafy/components/FormControl.svelte';
  import PaginationSentinel from '@metafy/components/PaginationSentinel.svelte';

  import IconClose from '@metafy/assets/svgs/close_browse_games.svg';
  import IconSearch from '@metafy/assets/svgs/search_browse_games.svg';

  let query = '';
  let games = [];
  let hasNextPage = false;
  let showScrollOverlay = false;
  let scrollOverlayWidth;
  let focus;

  async function loadNextPage({ detail: { detail } }) {
    if (detail && hasNextPage) {
      const results = await doSearch({ offset: games.length, limit: 20 });
      games = [...games, ...results?.hits];
      hasNextPage = games.length < results?.nbHits;
    }
  }

  async function doSearch(options = {}) {
    return await searchIndex('games', query, { filters: 'coach_count >= 1', ...options });
  }

  onMount(async () => {
    const results = await doSearch({ limit: 20 });
    games = [...results?.hits];
    hasNextPage = results?.nbHits > 20;
  });
</script>

<Modal
  bind:isVisible={$isVisible}
  closeButton={false}
  closeOnClickOutside={false}
  class=""
  widthClass="container h-full"
  backgroundClass="bg-neutrals-d30"
  limitHeight={false}
  overflow="overflow-hidden"
  on:afterVisible={focus}
>
  <div class="h-full max-w-7xl flex flex-col mx-auto pt-6 md:pt-8 xl:pt-12 pb-3">
    <div class="flex items-center mb-4 md:mb-6 xl:mb-10">
      <h2 class="font-medium text-xl md:text-1.5xl xl:text-3.25xl text-neutrals-l00 leading-none">
        Browse games
      </h2>
      <button class="w-8 h-8 xl:w-10 xl:h-10 ml-auto" on:click={() => ($isVisible = false)}>
        <svelte:component this={IconClose} class="w-full h-full" />
      </button>
    </div>

    <div class="relative mb-6 md:mb-8 xl:mb-10">
      <div
        class="absolute left-0 inset-y-0 w-14 flex items-center justify-center pointer-events-none"
      >
        <svelte:component this={IconSearch} />
      </div>
      <FormControl
        type="text"
        placeholder="What’s your game?"
        class="h-12 text-sm pl-14 md:h-16 md:text-xl"
        on:input={async (event) => {
          query = event.target.value;
          hasNextPage = false;
          const results = await doSearch({ limit: 20 });
          games = [...results.hits];
          hasNextPage = results.nbHits > 20;
        }}
        bind:focus
      />
    </div>
    <div
      class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-4 md:gap-y-6 relative overflow-y-auto"
      bind:clientWidth={scrollOverlayWidth}
      on:scroll={(event) => (showScrollOverlay = event.target.scrollTop > 0)}
    >
      <div
        class="scroll-overlay fixed z-1 w-full h-[106px] xl:h-[146px] -mt-px pointer-events-none transition-opacity duration-300 ease-linear {showScrollOverlay
          ? 'opacity-100'
          : 'opacity-0'}"
        style="width: {scrollOverlayWidth}px"
      />
      {#each games as game (game.id)}
        <a
          class="game p-px w-full bg-neutrals-d10 bg-opacity-80 rounded-3xl text-center mx-auto"
          href="/{game.slug}"
          on:click={() => ($isVisible = false)}
        >
          <div class="flex flex-col h-full bg-neutrals-d10 rounded-3xl p-4 pb-3 space-y-3">
            <div class="relative overflow-hidden w-full pt-[135%] rounded-lg bg-neutrals-d30">
              <GamePoster
                {game}
                class="absolute top-0 left-0"
                size="w-full h-full"
                square={false}
                link={false}
              />
            </div>
            <div class="flex-1 flex items-center justify-center text-center">
              <h2 class="text-white -tracking-0.01 line-clamp-2">
                {game.title.en}
              </h2>
            </div>
          </div>
        </a>
      {/each}
      <PaginationSentinel on:hit={loadNextPage} />
    </div>
  </div>
</Modal>

<style>
  .game:hover {
    background: linear-gradient(
      46.33deg,
      rgba(190, 52, 52, 0) 3.72%,
      #be3434 51.18%,
      rgba(190, 52, 52, 0) 98.74%
    );
  }

  .scroll-overlay {
    background: linear-gradient(
      to bottom,
      #030404 9.2%,
      rgba(3, 4, 4, 0.64) 35.48%,
      rgba(3, 4, 4, 0) 54.12%
    );
  }
</style>
