<script>
  import { goto } from '$app/navigation';
  import { getContext, createEventDispatcher } from 'svelte';
  import { dashboardState } from '@metafy/lib/stores';

  import Avatar from '../Avatar.svelte';
  // import AddIcon from '@metafy/assets/svgs/account_dashboard/add_icon.svg';

  const dispatch = createEventDispatcher();
  const { account } = getContext('app');

  $: teamMemberships = ($account.data.session.teamMemberships || []).map((m) => m.team);

  export let isMobile = false;
</script>

<div class="teams-wrap sticky top-0 flex items-center overflow-auto" class:isMobile>
  <div class="flex items-center">
    <!-- User Selection -->
    <a
      href={$account.data.session.roles.includes('coach')
        ? `/@${$account.data.session.coachProfile.slug}`
        : undefined}
      class="avatar mr-0.5 p-0.5 border border-solid border-transparent opacity-50"
      class:has-teams={!!teamMemberships.length}
      class:active={$dashboardState.selectedTeamId === null}
      on:click|preventDefault={() => {
        // If this is the currently selected option, then navigate to profile on clieck
        // Otherwise, just swap to this selection.
        if (
          $dashboardState.selectedTeamId === null &&
          $account.data.session.roles.includes('coach')
        ) {
          goto(`/@${$account.data.session.coachProfile.slug}`);
        }
        dispatch('change', null);
      }}
      sveltekit:prefetch
    >
      <Avatar
        user={$account.data.session}
        rounded="rounded-lg"
        size="w-full md:w-8 h-full md:h-8"
      />
    </a>
    <!-- Team Selection -->
    {#each teamMemberships as team (team.id)}
      <div
        class="avatar has-teams mr-0.5 p-0.5 border border-solid border-transparent cursor-pointer opacity-50"
        class:active={$dashboardState.selectedTeamId === team.id}
        on:click={() => dispatch('change', team.id)}
      >
        <!-- TODO-2.1: Team's don't have avatars -->
        <!-- TODO-2.1: Tooltip -->
        <img
          src="https://static.metafy.gg/default_avatar.png"
          alt={team.name}
          class="w-8 h-8 rounded-lg"
        />
      </div>
    {:else}
      <span class="font-medium text-white ml-3">
        {$account.data.session.name}
      </span>
    {/each}
  </div>
  <!-- TODO-2.1: Add team -->
  <!-- prettier-ignore -->
  <!-- <div class="add-wrap sticky right-0 z-1 p-0.5">
    <div
      class="add-icon flex items-center justify-center w-full h-full rounded-lg border border-dashed border-transparent cursor-pointer"
      on:click={() => dispatch('add')}
    >
      <AddIcon class="text-white {isMobile ? 'w-4 h-4' : ''}" />
    </div>
  </div> -->
</div>

<style>
  .teams-wrap {
    padding: 13px 0;
    border-bottom: 1px solid rgba(142, 148, 154, 0.16);
    background-color: #0d0f10;
    &.isMobile {
      /* @apply mb-5 p-0 w-full bg-neutrals-d30 border-none; */
    }
  }
  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    &.has-teams {
      @apply cursor-pointer;
      &.active {
        /* @apply border-functional-r50; */
      }
    }
    &.active {
      @apply opacity-100;
    }
  }
  /* .add-wrap {
    width: 38px;
    min-width: 38px;
    height: 38px;
    background-color: #0d0f10;
  }
  .add-icon {
    border-color: rgba(142, 148, 154, 0.36);
    &:hover {
      background-color: rgba(24, 26, 30, 0.7);
    }
  } */
  .teams-wrap.isMobile {
    & .avatar {
      @apply mr-3 w-10 h-10 lg:w-8 lg:h-8 p-0 rounded-2xl border-none overflow-hidden;
      &:last-child {
        @apply mr-4;
      }
      & img {
        @apply w-full h-full rounded-2xl;
      }
    }
    /* & .add-wrap {
      @apply p-0 w-10 h-10;
      min-width: 48px;
      & .add-icon {
        @apply rounded-2xl;
        border-width: 1.5px;
      }
    } */
  }
</style>
