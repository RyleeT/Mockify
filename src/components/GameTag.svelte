<script>
  import GamePoster from '@metafy/components/GamePoster.svelte';

  export let game = {};
  export let title = '';
  export let link = true;
  let className = '';
  export { className as class };
</script>

<!-- Sometimes need to disable the <a> functionality because the game poster is already
    within an <a>, and nesting them is illegal. -->
{#if link}
  <a
    href="/{game.slug}"
    class="inline-flex items-center flex-shrink-0 p-1 pr-2 mr-3 transition-colors rounded-lg bg-neutrals-d80 hover:bg-neutrals-d00 {className}"
    sveltekit:prefetch
  >
    <GamePoster {game} link={false} rounded="rounded-md" size="w-8 h-8" />
    <h3 class="mx-3 text-sm font-medium leading-none text-white whitespace-nowrap">
      {title || game.title.en}
    </h3>
  </a>
{:else}
  <div
    class="inline-flex items-center flex-shrink-0 p-1 pr-2 mr-3 rounded-lg bg-neutrals-d80 {className}"
  >
    <GamePoster {game} link={false} rounded="rounded-md" size="w-8 h-8" />
    <h3 class="mx-3 text-sm font-medium leading-none text-white whitespace-nowrap">
      {title || game.title.en}
    </h3>
  </div>
{/if}
