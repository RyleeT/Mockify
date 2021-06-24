<script>
  import { fly } from 'svelte/transition';
  import { expanded, isSidebarHiddenMobile } from './_helpers/stores.js';
  import { chatState } from '@metafy/lib/stores';
  import { BREAKPOINTS } from '@metafy/lib/constants';

  import BrowseGamesButton from '@metafy/components/BrowseGamesButton.svelte';
  import SidebarButton from './SidebarButton.svelte';
  import UserNav from './UserNav.svelte';
  import GuestNav from './GuestNav.svelte';
  import MobileNavs from './MobileNavs.svelte';

  import MetafySymbol from '@metafy/assets/svgs/metafy_symbol.svg';
  import MetafyLogotype from '@metafy/assets/svgs/metafy_logotype.svg';
  import IconAccount from '@metafy/assets/svgs/sidebar/account.svg';
  import IconExpand from '@metafy/assets/svgs/sidebar/expand.svg';
  import IconCollapse from '@metafy/assets/svgs/sidebar/collapse.svg';
  import IconChat from '@metafy/assets/svgs/chat/chat.svg';
  import IconMenu from '@metafy/assets/svgs/sidebar/menu.svg';
  import IconMenuClose from '@metafy/assets/svgs/sidebar/menu_close.svg';

  let className = '';
  export { className as class };
  export let isLoggedIn;

  let opened = false;
  let innerWidth;

  // When breakpoint is less than `2xl`, force sidebar to unexpand.
  $: if (innerWidth < BREAKPOINTS['2xl']) {
    $expanded = false;
  }

  function close() {
    opened = false;
  }
</script>

<svelte:window bind:innerWidth />

<header
  class="navbar z-sidebar fixed left-0 bottom-0 xl:bottom-auto xl:top-0 flex flex-col border-t xl:border-t-0 border-neutrals-l50 border-opacity-35 {className}"
  class:expanded={$expanded}
  class:isHiddenMobile={$isSidebarHiddenMobile}
>
  <ul class="links flex items-center h-full xl:flex-col xl:py-4 pl-6 pr-5 xl:px-3">
    <li
      class="flex justify-start xl:border-b border-neutrals-l50 border-opacity-15 xl:pb-3 xl:mb-4"
    >
      <a
        href={isLoggedIn ? '/account' : '/'}
        on:click={close}
        class="flex items-center"
        sveltekit:prefetch
      >
        <MetafySymbol class="metafy-symbol text-brands-metafy" />
        {#if $expanded}
          <div transition:fly|local={{ x: -50, duration: 200 }}>
            <MetafyLogotype class="ml-3" />
          </div>
        {/if}
      </a>
    </li>

    <!-- prettier-ignore -->
    <!-- TODO-2.1: Notifications -->
    <!-- prettier-ignore -->
    <!-- <li class="hidden xl:flex xl:justify-center mb-4 pb-2 border-b border-neutrals-l50 border-opacity-15">
      <SidebarButton on:click content="Notifications" icon={Notification} expanded={$expanded} noticeCount={0} />
    </li> -->
    <!-- Browse games button - visible on both mobile and desktop, for both users and guests. -->
    <li class="hidden xl:block xl:mb-4 ml-4 xl:ml-0">
      <BrowseGamesButton compact expanded={$expanded} {isLoggedIn} />
    </li>

    {#if isLoggedIn}
      <!-- User nav, visible only on desktop and when the user is logged in. -->
      <li class="hidden xl:block">
        <UserNav expanded={$expanded} />
      </li>

      <!-- Mobile nav, visible only on mobile and when the user is logged in. -->
      <li class="xl:hidden flex-1">
        <MobileNavs />
      </li>

      <!-- Chat, visible only on xl and up. -->
      <li class="hidden xl:block mt-auto relative">
        <SidebarButton
          content="Chat"
          icon={IconChat}
          expanded={$expanded}
          on:click={() => {
            chatState.update((s) => ({ ...s, expanded: !$chatState.expanded }));
          }}
        />
        <div
          class="bg-functional-r50 rounded-full w-[6px] h-[6px] mb-2 absolute top-2 right-2"
          class:hidden={!$chatState.hasUnread}
        />
      </li>

      <!-- Expand/collapse sidebar button - visible only on 2xl and up. -->
      <li class="hidden 2xl:block mt-4">
        <SidebarButton
          on:click={() => ($expanded = !$expanded)}
          content={$expanded ? 'Collapse' : 'Expand'}
          icon={$expanded ? IconCollapse : IconExpand}
          expanded={$expanded}
        />
      </li>
    {/if}

    <!-- Mobile only -->
    {#if isLoggedIn}
      <!-- <li class="flex xl:hidden">
        <UserDropdown user={$account.data.session} expanded={false} />
      </li> -->
    {:else}
      <li class="flex xl:hidden ml-6">
        <a
          href="/auth/account/login"
          class="w-8 h-8 flex items-center justify-center"
          sveltekit:prefetch
        >
          <IconAccount />
        </a>
      </li>
    {/if}

    <!-- Hamburger menu button - visible only on mobile, for both users and guests -->
    {#if !isLoggedIn}
      <li class="flex xl:hidden ml-6">
        <button
          class="w-8 h-8 flex items-center justify-center"
          on:click={() => (opened = !opened)}
        >
          {#if opened}
            <IconMenuClose />
          {:else}
            <IconMenu />
          {/if}
        </button>
      </li>
    {/if}
  </ul>

  {#if isLoggedIn}
    <!-- Desktop only -->
    <!-- <div class="hidden xl:block">
      <UserDropdown user={$account.data.session} expanded={$expanded} />
    </div> -->
  {/if}

  <!-- Menu drawer - visible only on mobile, if opened.
  If the user is logged in, show UserButtons, otherwise show GuestButtons. -->
  {#if opened}
    <div class="menu xl:hidden fixed w-full py-6 px-5">
      {#if !isLoggedIn}
        <GuestNav on:click={close} />
      {/if}
    </div>
  {/if}
</header>

<style>
  header.navbar {
    width: 100%;
    height: calc(64px + env(safe-area-inset-bottom, 0px));
    background-color: #141619;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    @apply xl:ease-in-out xl:duration-200;
    @screen xl {
      width: 64px;
      height: 100vh;
      transition-property: width;
    }

    & :global(.metafy-symbol) {
      width: 34px;
      height: 30px;
      flex-shrink: 0;
      @screen xl {
        width: 38px;
        height: 34px;
      }
    }

    &.expanded {
      @screen 2xl {
        width: 240px;
      }
    }
    &.isHiddenMobile {
      @apply hidden xl:flex;
    }
  }
  :global(header.navbar + *) {
    margin-bottom: 64px;
    @screen xl {
      margin-bottom: 0;
    }
  }
  :global(header.navbar.isHiddenMobile + *) {
    margin-bottom: 0;
  }
  :global(header.navbar:not(.mobile-only) + *) {
    @screen xl {
      margin-left: 64px;
    }
  }

  @screen 2xl {
    :global(header.navbar.expanded:not(.mobile-only) + *) {
      margin-left: 240px;
    }
  }
  /* Make sure there is enough room for the sidebar and the container to
   fit next to eachother on smaller screens */
  :global(header.navbar:not(.mobile-only) + div .container),
  :global(header.navbar:not(.mobile-only) + div .lg\:container),
  :global(header.navbar:not(.mobile-only) + div .xl\:container) {
    @screen xl {
      max-width: 1150px;
    }
    @media (min-width: 1367px) {
      max-width: 1280px;
    }
    @screen 2xl {
      max-width: 1450px;
    }
  }
  :global(header.navbar.expanded:not(.mobile-only) + div .container),
  :global(header.navbar.expanded:not(.mobile-only) + div .lg\:container),
  :global(header.navbar.expanded:not(.mobile-only) + div .xl\:container) {
    @screen 2xl {
      max-width: 1275px;
    }
  }

  .links li {
    @apply xl:w-full;
  }

  .menu {
    background-color: #040505;
    bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  }
</style>
