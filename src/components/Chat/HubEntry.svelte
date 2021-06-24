<script>
  import { onlineUsers } from '@metafy/lib/stores';

  import Avatar from '@metafy/components/Avatar.svelte';

  import UnreadIndicator from '@metafy/assets/svgs/chat/hub_unread_indicator.svg';

  export let account = {};
  export let isUnread = false;
  export let separatorTop = true;
  export let separatorBottom = true;

  $: isOnline = !!$onlineUsers.find((id) => id === account.id);
  $: name = !!account?.coachProfile ? account.coachProfile.name : account?.name;
</script>

{#if account}
  <div class="hub-entry relative">
    {#if isUnread}
      <UnreadIndicator class="unread-indicator absolute left-0" />
    {/if}

    {#if separatorTop}
      <div class="separator absolute top-0" />
    {/if}

    <button class="bg-gradient w-full flex text-left focus:outline-none py-3 px-5" on:click>
      <div class="relative overflow-hidden flex-shrink-0">
        <Avatar user={account} rounded="rounded-lg" class="my-auto" size="w-14 h-14" />
        <div class="online-indicator-cutout absolute flex bg-neutrals-d10 rounded-full" />
        <div class="online-indicator absolute bottom-0 right-0 rounded-full" class:isOnline />
      </div>

      <div class="flex flex-col w-full pt-1 ml-4">
        <div class="flex items-center">
          <h2 class="font-medium text-sm text-neutrals-l00 whitespace-nowrap leading-none">
            {name}
          </h2>
          <slot name="header" />
        </div>

        <slot />
      </div>
    </button>

    {#if separatorBottom}
      <div class="separator bottom absolute" />
    {/if}
  </div>
{/if}

<style>
  .hub-entry {
    & :global(.unread-indicator) {
      top: 50%;
      transform: translateY(-50%);
    }

    & .online-indicator-cutout {
      width: 24px;
      height: 24px;
      right: -11px;
      bottom: -12px;
    }
    & .online-indicator {
      width: 7px;
      height: 7px;
      @apply bg-neutrals-l30;
      &.isOnline {
        @apply bg-functional-g20;
      }
    }

    & .separator {
      @apply w-full transition-opacity ease-in-out duration-200;
      height: 1px;
      background: linear-gradient(
        90.52deg,
        rgba(48, 82, 107, 0) 0.51%,
        #30526b 48.04%,
        rgba(48, 82, 107, 0) 99.6%
      );
      opacity: 0.64;
      &.bottom {
        bottom: -1px;
      }
    }

    &:hover {
      & .bg-gradient {
        background: linear-gradient(
          273.29deg,
          rgba(48, 82, 107, 0) 2.72%,
          rgba(190, 51, 51, 0.1152) 47.97%,
          rgba(40, 63, 84, 0) 97.28%
        );
      }
      & .separator {
        z-index: 1;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(190, 52, 52, 0) 0%,
          #be3434 48.79%,
          rgba(190, 52, 52, 0) 97.69%
        );
        opacity: 1;
      }
    }
  }
</style>
