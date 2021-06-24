<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { dev } from '$app/env';
  import { BASE_APP_URL, STATIC_URL } from '@metafy/lib/constants';
  import { fetch, afterLogout } from '@metafy/lib/utils';
  import { dashboardState, dashboardType } from '@metafy/lib/stores';
  import { open as openBrowseGamesModal } from '@metafy/components/BrowseGamesModal.svelte';

  import SidebarItem from '../DashboardSidebar/SidebarItem.svelte';
  import TeamList from '../DashboardSidebar/TeamList.svelte';
  // import FolderMenu from '../DashboardSidebar/FolderMenu.svelte';
  import StatusDropdown from '../DashboardSidebar/StatusDropdown.svelte';
  // import MediaVaultMenu from '../DashboardSidebar/MediaVaultMenu.svelte';
  import CoachSwitcher from '@metafy/routes/account/_components/CoachSwitcher.svelte';
  // import StartIcon from '@metafy/assets/svgs/account_dashboard/empty_star.svg';
  import SettingIcon from '@metafy/assets/svgs/sidebar/settings.svg';
  import IconWallet from '@metafy/assets/svgs/sidebar/wallet.svg';
  import IconSignout from '@metafy/assets/svgs/sidebar/signout.svg';
  import IconBrowseGames from '@metafy/assets/svgs/home/browse_games.svg';

  export let isVisible = false;
  export let isCoach = false;
  const dispatch = createEventDispatcher();
  const { account } = getContext('app');
  const selectedTeam = 'test';
  // $: selectedTeam = ($account.data.session.teamMemberships || []).find(
  //   (x) => x.team.id === $dashboardState.selectedTeamId
  // );
  // $: videoCount = selectedTeam ? selectedTeam.videoCount : $account.data.session.videoCount;
  // TODO-2.1: Folders, Sub-menus
  $: navConfigs = [
    {
      component: StatusDropdown,
      params: {
        type: 'live',
        href: '/account/sessions/upcoming',
        isMobile: true
      }
    },
    {
      component: StatusDropdown,
      params: {
        type: 'lesson',
        href: '/account/plans/in-progress',
        isMobile: true
      },
      divide: true
    },
    // {
    //   component: StatusDropdown,
    //   params: {
    //     type: 'replay',
    //     href: '/account/reviews/drafts',
    //     isMobile: true,
    //   },
    //   divide: true,
    // },
    // {
    //   component: MediaVaultMenu,
    //   params: {
    //     count: videoCount,
    //     href: '/account/vault',
    //     isMobile: true,
    //   },
    // },
    {
      href: '/account/wallet',
      icon: IconWallet,
      name: 'My Wallet'
    },
    {
      href: '/account/settings',
      icon: SettingIcon,
      name: 'Settings',
      divide: true
    },
    {
      icon: IconSignout,
      name: 'Logout',
      onClick: logout
    }
  ];

  async function logout() {
    try {
      await fetch(`${BASE_APP_URL}/auth/proxy/logout.json`, { method: 'post' });
    } catch (error) {
      if (dev) console.error(error);
    } finally {
      // Hard reload to drop all cache and start fresh on the home page.
      afterLogout();
      window.location.assign(BASE_APP_URL);
    }
  }

  function handleChangeTeam({ detail }) {
    dashboardState.update((s) => ({ ...s, selectedTeamId: detail }));
  }
</script>

{#if isVisible}
  <div
    class="fixed top-0 bottom-0 left-0 right-0 mb-16 bg-neutrals-d10 bg-opacity-65 z-60"
    transition:fade|local={{ duration: 150 }}
    on:click={() => dispatch('close')}
  />
  <div class="absolute bottom-0 left-0 w-full mb-16 z-60">
    <div
      class="px-5 pt-3 pb-18 overflow-auto sidebar-content rounded-t-3xl bg-[#040505]"
      transition:fly|local={{ y: 30 }}
    >
      <div class="flex items-center mb-4">
        <span class="h-[3px] bg-neutrals-l40 bg-opacity-15 mx-auto w-10 rounded-sm" />
      </div>

      <TeamList isMobile on:change={handleChangeTeam} />

      {#if isCoach && !selectedTeam}
        <CoachSwitcher
          isCompact
          notify
          on:change={({ detail }) => {
            $dashboardType = detail;
            dispatch('close');
          }}
        />
      {/if}

      <div class="w-full space-y-4 nav-wrap">
        <SidebarItem
          icon={IconBrowseGames}
          name="Browse games"
          isMobile
          on:click={() => {
            openBrowseGamesModal();
            dispatch('close');
          }}
        />

        {#each navConfigs as { component, params, href, icon, name, content, onClick, divide }}
          {#if component}
            <svelte:component this={component} {...params} />
          {:else}
            <SidebarItem {href} {icon} {name} isMobile on:click={onClick}>
              <div slot="right-content">
                {#if content}{@html content}{/if}
              </div>
            </SidebarItem>
          {/if}
          {#if divide}
            <div class="w-full h-px mt-4 border-t border-neutrals-l50 border-opacity-15" />
          {/if}
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .sidebar-content {
    max-height: calc(100% - 40px - 64px);
  }
  .nav-wrap :global(svg) {
    --primaryColor: theme('colors.neutrals.l00');
    --accentColor: theme('colors.neutrals.l00');
  }
</style>
