<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import { browser, dev } from '$app/env';
  import { query } from '@metafy/lib/apollo';
  import { GET_CONVERSATIONS, GET_COACHES } from '@metafy/graphql/queries';
  import { searchIndex } from '@metafy/lib/utils';
  import { chatState, dashboardType } from '@metafy/lib/stores';
  import { STATIC_URL, BREAKPOINTS } from '@metafy/lib/constants';

  import PaginationSentinel from '@metafy/components/PaginationSentinel.svelte';
  import FormControl from '@metafy/components/FormControl.svelte';
  import HubConversation from './HubConversation.svelte';
  import HubCoach from './HubCoach.svelte';
  import EmptyInbox from './EmptyInbox.svelte';
  // import EmptyCoach from './EmptyCoach.svelte';

  import MetafySymbol from '@metafy/assets/svgs/metafy_symbol.svg';
  import Collapse from '@metafy/assets/svgs/chat/collapse.svg';
  import Inbox from '@metafy/assets/svgs/chat/inbox.svg';
  import InboxActive from '@metafy/assets/svgs/chat/inbox_active.svg';
  import Coaches from '@metafy/assets/svgs/chat/coaches.svg';
  import CoachesActive from '@metafy/assets/svgs/chat/coaches_active.svg';

  const dispatch = createEventDispatcher();
  const response = query({ query: GET_CONVERSATIONS });
  const coachResponse = query({ query: GET_COACHES, variables: { first: 20 } });

  function toggle() {
    chatState.update((s) => ({ ...s, expanded: !$chatState.expanded }));
  }

  const TABS = {
    inbox: 0,
    coaches: 1
  };

  let activeTab = TABS.inbox;
  let innerWidth;
  let isLoadingNextPage = false;

  async function loadNextConversations({ detail: { detail } }) {
    try {
      if (detail && $response.data?.conversations?.pageInfo?.hasNextPage) {
        isLoadingNextPage = true;
        await $response.query.fetchMore({
          variables: { after: $response.data.conversations.pageInfo.endCursor }
        });
      }
    } catch (error) {
      if (dev) console.error(error);
    } finally {
      isLoadingNextPage = false;
    }
  }

  async function loadNextCoaches({ detail: { detail } }) {
    try {
      if (detail && $coachResponse.data?.coaches?.pageInfo?.hasNextPage) {
        isLoadingNextPage = true;
        await $coachResponse.query.fetchMore({
          variables: { after: $coachResponse.data.coaches.pageInfo.endCursor }
        });
      }
    } catch (error) {
      if (dev) console.error(error);
    } finally {
      isLoadingNextPage = false;
    }
  }

  $: coaches = ($coachResponse.data?.coaches?.edges || []).map((e) => e.node);
  $: conversations = ($response.data?.conversations?.edges || []).map((e) => e.node);
  $: $chatState.hasUnread = conversations.some((c) => c.unreadMessageCount > 0);

  // Remove body scroll while chat is open on mobile.
  $: if (browser && innerWidth < BREAKPOINTS.xl) {
    document.body.classList.toggle('overflow-y-hidden', $chatState.expanded);
  }
</script>

<svelte:window bind:innerWidth />

<div
  class="hub-fixed hub-gradient-border fixed rounded-t-3xl overflow-hidden transition-transform ease-in-out duration-200"
  class:isCollapsed={!$chatState.expanded}
>
  <div class="hub bg-neutrals-d10 bg-opacity-90 backdrop-filter backdrop-blur-1.5xl rounded-t-3xl">
    <div class="header flex flex-col relative rounded-t-3xl">
      <button
        class="collapse-header flex items-center focus:outline-none text-left py-4 px-5"
        on:click={toggle}
      >
        <MetafySymbol class="metafy-symbol text-brands-metafy" />
        <h2 class="font-medium text-base text-neutrals-l00 tracking-0.01 leading-none ml-3">
          {#if $chatState.participants.myself.roles.includes('coach')}Chat{:else}Coach Chat{/if}
        </h2>
        <div
          class="unread-indicator ml-1"
          class:hidden={$chatState.expanded || !$chatState.hasUnread}
        />
        <div class="collapse ml-auto">
          <Collapse />
        </div>
      </button>
      <nav class="flex">
        <button class:active={activeTab === TABS.inbox} on:click={() => (activeTab = TABS.inbox)}>
          {#if activeTab === TABS.inbox}
            <InboxActive />
            <div class="tab-border-active" />
          {:else}
            <Inbox />
          {/if}
          <p class="ml-3">Inbox</p>
          <div class="unread-indicator ml-1" class:hidden={!$chatState.hasUnread} />
        </button>
        <button
          class:active={activeTab === TABS.coaches}
          on:click={() => (activeTab = TABS.coaches)}
        >
          {#if activeTab === TABS.coaches}
            <CoachesActive />
            <div class="tab-border-active" />
          {:else}
            <Coaches />
          {/if}
          <p class="ml-3">
            {#if $dashboardType === 'coach'}
              Students
            {:else}
              Coaches
            {/if}
          </p>
        </button>
      </nav>
      <img
        src="{STATIC_URL}/chat/hexagons_left.svg"
        class="absolute left-0 bottom-0 opacity-25 pointer-events-none"
        alt="Decorative hexagon graphic"
      />
      <img
        src="{STATIC_URL}/chat/hexagons_right.svg"
        class="absolute right-0 top-0 opacity-25 pointer-events-none"
        alt="Decorative hexagon graphic"
      />
    </div>

    <div class="tab-container relative">
      {#if $response.loading || $coachResponse.loading}
        <div class="spinner w-full h-full" />
      {:else if activeTab === TABS.inbox}
        <div
          class="inbox absolute top-0 flex flex-col overflow-y-auto"
          transition:fly|local={{ x: -500, duration: 400 }}
        >
          {#each conversations as conversation, idx (conversation.id)}
            <HubConversation
              {conversation}
              separatorTop={idx > 0}
              separatorBottom={idx < conversations.length - 1}
              on:click={() => {
                dispatch('select', conversation);
              }}
            />
          {:else}
            <EmptyInbox />
          {/each}
          {#if conversations.length > 0}
            <PaginationSentinel on:hit={loadNextConversations} />
            {#if isLoadingNextPage}
              <div class="spinner w-full h-8 py-2" />
            {/if}
          {/if}
        </div>
      {:else if activeTab === TABS.coaches}
        <div
          class="coaches absolute top-0 flex flex-col overflow-y-auto"
          transition:fly|local={{ x: 500, duration: 400 }}
        >
          {#each coaches as coach, idx (coach.id)}
            <HubCoach
              {coach}
              separatorTop={idx > 0}
              separatorBottom={idx < conversations.length - 1}
              on:click={({ detail }) => {
                // Try to find existing conversation with this coach from the local data.
                const conversation = conversations.find((c) =>
                  c.participants.find((p) => p.id === detail.coach.id)
                );
                if (conversation) {
                  dispatch('select', conversation);
                } else {
                  dispatch('create', detail.coach);
                }
              }}
            />
          {:else}
            <!-- <EmptyCoach /> -->
          {/each}
          {#if coaches.length > 0}
            <PaginationSentinel on:hit={loadNextCoaches} />
            {#if isLoadingNextPage}
              <div class="spinner w-full h-8 py-2" />
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .hub-fixed {
    @apply top-0 left-0 w-full z-40;
    height: calc(100% - 63px);

    @screen xl {
      right: 40px;
    }
    @apply xl:top-auto xl:left-auto xl:bottom-0 xl:w-auto xl:h-auto;

    &.isCollapsed {
      @apply hidden xl:block;
      @screen xl {
        transform: translateY(100%);
      }

      & .collapse :global(svg) {
        transform: rotate(180deg);
      }
    }
  }

  .hub {
    @apply w-full h-full;
    @screen xl {
      width: 340px;
      height: 700px;
    }

    & .header {
      background: linear-gradient(
        78.42deg,
        rgba(36, 38, 41, 0.2) 16.23%,
        rgba(53, 59, 65, 0.350624) 66.84%,
        rgba(111, 116, 121, 0.2) 105.46%
      );

      & :global(.metafy-symbol) {
        width: 33px;
        height: 30px;
      }

      & button.collapse-header:hover .collapse {
        @apply bg-functional-r20;
      }

      & .collapse {
        @apply flex items-center justify-center bg-neutrals-d10 rounded-md;
        @apply transition-colors ease-in-out duration-200;
        width: 28px;
        height: 28px;

        & :global(svg) {
          @apply transition-transform ease-in-out duration-500;
        }
      }

      & nav button {
        @apply w-full flex items-center justify-center relative py-3;
        &:focus {
          @apply outline-none;
        }
        &.active {
          & p {
            @apply text-neutrals-l00 text-opacity-100;
          }
        }

        & p {
          @apply font-medium text-sm text-neutrals-l40 text-opacity-60 leading-none;
        }
        & .tab-border-active {
          @apply absolute w-full bottom-0 left-0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(241, 67, 67, 0) 0%,
            #f14343 48.79%,
            rgba(241, 67, 67, 0) 97.69%
          );
        }
      }
    }

    & :global(.search-input) {
      @apply text-sm px-3 py-2;
    }
  }

  .inbox,
  .coaches {
    @apply w-full h-full;
    @screen xl {
      height: 597px;
    }
  }

  .tab-container {
    height: calc(100% - 104px);
  }

  .unread-indicator {
    @apply bg-functional-r50 rounded-full;
    width: 6px;
    height: 6px;
    margin-bottom: 9px;
  }
  /* Slightly reduce bottom margin for the indicator in the header */
  .collapse-header .unread-indicator {
    margin-bottom: 7px;
  }
</style>
