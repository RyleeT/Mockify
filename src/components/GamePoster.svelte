<script>
  import Image from '@metafy/components/Image.svelte';

  export let game = {};
  let className = '';
  export { className as class };
  export let size;
  export let border = '';
  export let rounded = '';
  export let square = true;
  export let link = true;
</script>

<!-- Sometimes need to disable the <a> functionality because the game poster is already
  within an <a>, and nesting them is illegal. -->
{#if link}
  <a href="/{game.slug}" class="flex-shrink-0 {className} {rounded}" sveltekit:prefetch>
    <Image
      src={game.poster}
      alt={game.title.en}
      class={square ? 'object-cover' : ''}
      {size}
      {border}
      {rounded}
      fit={square ? 'crop' : 'cover'}
      on:error={(event) => (event.target.style.opacity = '0')}
    />
  </a>
{:else}
  <Image
    src={game.poster}
    alt={game.title.en}
    class="{square ? 'object-cover' : ''} {className}"
    {size}
    {border}
    {rounded}
    fit={square ? 'crop' : 'cover'}
    on:error={(event) => (event.target.style.opacity = '0')}
  />
{/if}
