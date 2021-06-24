<script>
  import { onMount, getContext } from 'svelte';
  import SidebarButton from './SidebarButton.svelte';

  import IconDashboard from '@metafy/assets/svgs/sidebar/dashboard.svg';
  import IconWallet from '@metafy/assets/svgs/sidebar/wallet.svg';
  import IconSettings from '@metafy/assets/svgs/sidebar/settings.svg';
  import IconLiveSessions from '@metafy/assets/svgs/sidebar/sessions.svg';
  import IconLessons from '@metafy/assets/svgs/sidebar/lessons.svg';

  export let expanded = false;

  // const { account } = getContext('app');
  // const isCoach = $account.data.session.roles.includes('coach');
  const isCoach = false;
</script>

<nav>
  <ul class="flex flex-col">
    <li class="mb-4">
      <SidebarButton href="/account" on:click content="Dashboard" icon={IconDashboard} {expanded} />
    </li>
    <!-- TODO: Replay reviews - uncomment on launch -->
    <!-- <li class="mb-4">
      <SidebarButton
        href="/account/replays"
        on:click
        content="Replay reviews"
        icon={IconReplayReviews}
        {expanded}
        activeStartsWith={['replays']}
      />
    </li> -->
    <li class="mb-4">
      <SidebarButton
        href="/account/sessions"
        on:click
        content="Live sessions"
        icon={IconLiveSessions}
        {expanded}
        activeStartsWith={['sessions']}
      />
    </li>
    <li class="mb-4">
      <SidebarButton
        href="/account/plans"
        on:click
        content="Training Plans"
        icon={IconLessons}
        {expanded}
        activeStartsWith={['plans', 'plan']}
      />
    </li>
    <li class="mb-4">
      <SidebarButton
        href="/account/wallet"
        on:click
        content="My wallet"
        icon={IconWallet}
        {expanded}
      />
    </li>
    <li class="mb-4">
      <SidebarButton
        href="/account/settings/general"
        on:click
        content="Settings"
        icon={IconSettings}
        {expanded}
        activeStartsWith={['settings']}
      />
    </li>
  </ul>
</nav>
