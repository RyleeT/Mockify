<script>
  import { dev } from '$app/env';
  import { BASE_APP_URL, BREAKPOINTS } from '@metafy/lib/constants';
  import { fetch } from '@metafy/lib/utils';
  import { afterLogout } from '@metafy/lib/utils';
  import { dashboardState } from '@metafy/lib/stores';

  import Dropdown from '../Dropdown.svelte';
  import Avatar from '../Avatar.svelte';
  import MobileDropdown from './MobileDropdown.svelte';

  import IconDropdown from '@metafy/assets/svgs/sidebar/dropdown.svg';
  import IconProfile from '@metafy/assets/svgs/sidebar/profile.svg';
  import IconSignout from '@metafy/assets/svgs/sidebar/signout.svg';

  export let user = {};
  export let expanded = false;

  let isVisible = false;
  let isLoggingOut = false;
  let innerWidth;

  $: isMobile = innerWidth < BREAKPOINTS.xl;
  $: isCoach = (user.roles || []).includes('coach');

  async function logout() {
    try {
      isVisible = false;
      isLoggingOut = true;
      await fetch(`${BASE_APP_URL}/auth/proxy/logout.json`, { method: 'post' });
    } catch (error) {
      if (dev) console.error(error);
    } finally {
      // Hard reload to drop all cache and start fresh on the home page.
      afterLogout();
      window.location.assign(BASE_APP_URL);
    }
  }

  function handleClick() {
    if (isMobile) {
      dashboardState.update((s) => ({ ...s, mobileVisible: !$dashboardState.mobileVisible }));
    }
  }
</script>

<svelte:window bind:innerWidth />

<Dropdown
  bind:isVisible
  placement="top-start"
  offset={[16, 6]}
  contentClass="bg-neutrals-d10 border border-neutrals-l50 border-opacity-25 rounded-lg"
  disabled={isMobile}
>
  <button
    slot="trigger"
    class="group relative flex items-center text-left xl:bg-neutrals-d60 xl:w-full xl:h-16"
    on:click={handleClick}
  >
    <Avatar
      {user}
      class="my-auto xl:ml-3.5"
      size="w-8 h-8 xl:h-9 xl:w-9"
      rounded="rounded-lg"
      border=""
    />
    {#if expanded}
      <div class="flex w-full items-center pr-4 ml-3">
        <div class="flex flex-col max-w-[140px]">
          <h3
            class="font-medium text-sm text-neutrals-l00 tracking-0.01 leading-none truncate mb-1"
          >
            {user.name}
          </h3>
          <p class="text-xs text-neutrals-l40 tracking-0.01 leading-none truncate">{user.email}</p>
        </div>
        <IconDropdown class="text-neutrals-l00 group-hover:text-functional-r50 ml-auto" />
      </div>
    {/if}
  </button>
  <div slot="content" class="user-dropdown">
    <ul class="py-2">
      {#if isCoach}
        <li>
          <a
            href={`/@${user.coachProfile.slug}`}
            class="flex items-center px-5 py-3 hover:bg-neutrals-d60"
            sveltekit:prefetch
            on:click={() => (isVisible = false)}
          >
            <IconProfile />
            <span class="font-medium text-sm text-neutrals-l40 tracking-0.01 leading-none ml-5"
              >View Profile</span
            >
          </a>
        </li>
      {/if}
      <li>
        <button
          class="w-full flex items-center text-left px-5 py-3 hover:bg-neutrals-d60"
          disabled={isLoggingOut}
          on:click={logout}
        >
          <IconSignout />
          <span class="font-medium text-sm text-neutrals-l40 tracking-0.01 leading-none ml-5"
            >Sign out</span
          >
        </button>
      </li>
    </ul>
  </div>
</Dropdown>

<MobileDropdown
  isVisible={$dashboardState.mobileVisible}
  {isCoach}
  on:close={() => dashboardState.update((s) => ({ ...s, mobileVisible: false }))}
/>
