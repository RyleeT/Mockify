<script>
  import '../app.postcss';
  import { prerendering } from '$app/env';
  import { page, session } from '$app/stores';

  import EnvironmentScripts from '@metafy/components/EnvironmentScripts.svelte';
  import PageLoader from '@metafy/components/PageLoader.svelte';
  import Toasts from '@metafy/components/Toasts.svelte';
  // import Pusher from '@metafy/components/Pusher.svelte';
  import Sidebar from '@metafy/components/Sidebar/Sidebar.svelte';
  // import Chat from '@metafy/components/Chat/Chat.svelte';
  import GuestNavbar from '@metafy/components/GuestNavbar.svelte';

  const isLoggedIn = true;

  const EMPTY_PAGES = ['/auth/', /@.+\/schedule/, '/swt'];
  $: path = $page.path;
  $: isEmptyPage = EMPTY_PAGES.some((page) => !!path.match(page)?.length);
</script>

<!-- Environment-specific scripts -->
<EnvironmentScripts />

<!-- Top-level progress bar -->
{#if prerendering}
  <PageLoader />
{/if}

<!-- Content -->
<div class="flex w-full min-h-screen bg-neutrals-d03">
  <Sidebar class={!isLoggedIn ? 'xl:hidden mobile-only' : ''} {isLoggedIn} />
  <div class="flex-1">
    {#if !isEmptyPage && !isLoggedIn}
      <GuestNavbar />
    {/if}

    <slot />
  </div>
</div>

<!-- Toasts -->
<Toasts />

<!-- Always present BrowseGames modal -->
<!-- <BrowseGamesModal /> -->

<!-- Chat -->
<!-- {#if isLoggedIn && browser}
  <Chat bind:this={$chatState.instance} />
{/if} -->

<!-- Pusher -->
<!-- {#if browser}
  <Pusher />
{/if} -->
