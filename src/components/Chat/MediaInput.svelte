<script context="module">
  export const tabs = {
    emoji: 0,
    gif: 1
  };
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import VirtualList from '@sveltejs/svelte-virtual-list';
  import { fetch, debounce } from '@metafy/lib/utils';
  import { TENOR_API_URL, TENOR_API_KEY } from '@metafy/lib/constants';
  import emoji from '@metafy/lib/data/emoji.js';

  import Scrollable from '@metafy/components/Scrollable.svelte';
  import Dropdown from '@metafy/components/Dropdown.svelte';
  import FormControl from '@metafy/components/FormControl.svelte';
  import Cross from '@metafy/assets/svgs/cross.svg';

  const dispatch = createEventDispatcher();

  // Get a unique map of all the emoji categories.
  let emojiByCategoryMap = {};
  for (const e of emoji) {
    if (!(e.category in emojiByCategoryMap)) {
      emojiByCategoryMap[e.category] = [];
    }
    emojiByCategoryMap[e.category].push(e);
  }
  // Convert the map into an array, to make sure ordering is consistent,
  // and also so we can have a manually defined order for the categories.
  let emojiByCategory = [];
  const keyFirstCategory = 'Smileys & People';
  emojiByCategory.push({
    name: keyFirstCategory,
    emojis: emojiByCategoryMap[keyFirstCategory]
  });
  const categoriesRest = Object.entries(emojiByCategoryMap).filter(
    ([category]) => category !== keyFirstCategory
  );
  for (const [category, emojis] of categoriesRest) {
    emojiByCategory.push({ name: category, emojis });
  }

  export let isVisible = false;
  export let activeTab = tabs.emoji;
  export let offset = [0, 0];

  let searchValue;
  let focusSearch;
  let highlightSearched = true;
  $: filteredEmoji =
    searchValue && emoji.filter((e) => e.names.some((n) => n.includes(searchValue)));

  let gifs = null;
  const fetchGifs = debounce((query) => {
    let url = `${TENOR_API_URL}/search?key=${TENOR_API_KEY}&limit=10&mediafilter=minimal`;
    if (query) {
      url += '&q=' + query;
    }
    gifs = fetch(url).then((res) => res.json());
  }, 1000);

  // Re-run GIF search whenever the active tab changes to the GIF tab, and when the search value changes.
  $: if (activeTab === tabs.gif) {
    fetchGifs(searchValue);
  }

  function close() {
    isVisible = false;
  }
</script>

<Dropdown
  bind:isVisible
  trigger="manual"
  contentClass=""
  placement="top-end"
  {offset}
  on:open={focusSearch}
>
  <div
    slot="content"
    class="media-input flex flex-col bg-neutrals-d20 rounded-lg pt-4 px-5 mx-auto mt-2"
  >
    <div class="flex items-center mb-3">
      <nav class="flex pt-1">
        <button class:active={activeTab === tabs.emoji} on:click={() => (activeTab = tabs.emoji)}>
          Emoji
          <div class="tab-border-active" />
        </button>
        <button class:active={activeTab === tabs.gif} on:click={() => (activeTab = tabs.gif)}>
          GIF
          <div class="tab-border-active" />
        </button>
      </nav>
      <button class="focus:outline-none ml-auto" on:click={close}>
        <Cross />
      </button>
    </div>

    <div>
      {#if activeTab === tabs.emoji}
        <FormControl
          type="text"
          class="search-input mb-3"
          bind:value={searchValue}
          bind:focus={focusSearch}
          placeholder="Search for emoji"
          on:keydown={(event) => {
            if (event.key === 'Escape') {
              dispatch('close');
              return;
            }
            if (event.key === 'Enter' && searchValue) {
              dispatch('select:emoji', { value: filteredEmoji[0].emoji });
              event.preventDefault();
            }
          }}
        />
        <Scrollable height="h-[341px]">
          {#if searchValue}
            <div class="emoji-grid grid grid-cols-9 mb-2">
              {#each filteredEmoji as e, idx}
                <button
                  on:click={() => dispatch('select:emoji', { value: e.emoji })}
                  class:highlightSearched={highlightSearched && idx === 0}
                  on:mouseenter={() => (highlightSearched = false)}>{e.emoji}</button
                >
              {/each}
            </div>
          {:else}
            <!-- Use a VirtualList to only render the visible category & improve performance -->
            <VirtualList items={emojiByCategory} let:item={category}>
              <h3 class="text-xs tracking-0.1 uppercase mb-2 ml-1">{category.name}</h3>
              <div class="emoji-grid grid grid-cols-9 mb-2">
                {#each category.emojis as e}
                  <button on:click={() => dispatch('select:emoji', { value: e.emoji })}
                    >{e.emoji}</button
                  >
                {/each}
              </div>
            </VirtualList>
          {/if}
        </Scrollable>
      {:else if activeTab === tabs.gif}
        <FormControl
          type="text"
          class="search-input mb-3"
          placeholder="Search for a GIF"
          bind:value={searchValue}
          bind:focus={focusSearch}
          on:keydown={(event) => {
            if (event.key === 'Escape') {
              dispatch('close');
            }
          }}
        />

        <!-- TODO: Find a way to not have #await inside #await -->
        {#if gifs}
          {#await gifs}
            <div class="w-full h-full spinner" />
          {:then data}
            <div class="gif-grid grid grid-cols-2 gap-3 overflow-y-auto">
              {#each data.results as r}
                <video
                  class="object-cover cursor-pointer rounded-md"
                  src={r.media[0].nanomp4.url}
                  on:click={() => {
                    dispatch('select:gif', { value: r.media[0].mp4.url });
                    close();
                  }}
                  muted
                  autoplay
                  loop
                  playsinline
                  in:fade|local={{ duration: 200 }}
                />
              {/each}
            </div>
          {/await}
        {/if}
      {/if}
    </div>
  </div>
</Dropdown>

<style>
  .media-input {
    width: 384px;
    height: 460px;
  }
  nav button {
    @apply relative text-neutrals-l40 font-medium leading-none pb-2;
    width: 60px;

    & .tab-border-active {
      @apply hidden absolute w-full bottom-0 left-0;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(241, 67, 67, 0) 0%,
        #f14343 48.79%,
        rgba(241, 67, 67, 0) 97.69%
      );
    }

    &.active {
      @apply text-neutrals-l00;
      & .tab-border-active {
        @apply block;
      }
    }
    &:focus {
      @apply outline-none;
    }
  }

  .media-input :global(.search-input) {
    @apply text-sm px-3 py-2;
  }

  .emoji-grid {
    @apply text-2xl;
    font-family: emoji;

    & button {
      width: 40px;
      height: 40px;
      @apply rounded;
      &:hover,
      &.highlightSearched {
        @apply bg-neutrals-l40 bg-opacity-25;
      }
      &:focus {
        @apply outline-none;
      }
    }
  }

  .gif-grid {
    height: 341px;
    & video {
      width: 170px;
      height: 95px;
    }
  }
</style>
