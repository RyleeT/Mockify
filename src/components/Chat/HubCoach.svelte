<script>
  import { createEventDispatcher } from 'svelte';

  import HubEntry from './HubEntry.svelte';

  import Controller from '@metafy/assets/svgs/chat/controller.svg';

  const dispatch = createEventDispatcher();

  export let coach = {};
  export let separatorTop = true;
  export let separatorBottom = true;
</script>

<HubEntry
  account={coach}
  {separatorTop}
  {separatorBottom}
  on:click={() => {
    dispatch('click', { coach });
  }}
>
  <p class="title text-neutrals-l30 uppercase leading-none mb-2">
    {coach.coachProfile?.title || ''}
  </p>
  <div class="flex">
    <Controller class="text-functional-r50" />
    <p class="text-xs text-neutrals-l00 leading-none ml-2">
      {#if coach.coachProfile?.coachGames?.length === 1}
        {coach.coachProfile.coachGames[0].game.title.en}
      {:else if coach.coachProfile?.coachGames?.length > 1}
        {coach.coachProfile?.coachGames.length} games
      {/if}
    </p>
  </div>
</HubEntry>

<style>
  .title {
    font-size: 11px;
    letter-spacing: 0.1em;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-top: 6px;
  }
</style>
