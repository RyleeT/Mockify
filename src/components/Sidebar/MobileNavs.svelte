<script>
  import { chatState } from '@metafy/lib/stores';

  import SidebarButton from './SidebarButton.svelte';
  // import Notification from './Notification.svelte';

  import IconDashboard from '@metafy/assets/svgs/sidebar/dashboard.svg';
  import IconChat from '@metafy/assets/svgs/sidebar/chat.svg';

  const isMobile = true;
</script>

<div class="flex items-center justify-center space-x-6 sm:space-x-14 md:space-x-24">
  <div class="nav-item">
    <SidebarButton href="/account" on:click content="Dashboard" icon={IconDashboard} {isMobile} />
  </div>
  <div class="nav-item">
    <SidebarButton
      on:click={() => chatState.update((s) => ({ ...s, expanded: !$chatState.expanded }))}
      content="Chat"
      icon={IconChat}
      buttonActive={$chatState.expanded}
      {isMobile}
    />
  </div>
  <!-- prettier-ignore -->
  <!-- TODO-2.1: Notifications -->
  <!-- prettier-ignore -->
  <!-- <div class="nav-item">
    <SidebarButton on:click content="Notifications" icon={Notification} noticeCount={0} {isMobile} />
  </div> -->

  <!-- <div class="nav-item">
    <SidebarButton on:click content="Notifications" icon={Notification} noticeCount={0} {isMobile} />
  </div> -->
</div>
