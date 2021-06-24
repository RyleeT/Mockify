<script>
  import { getContext, createEventDispatcher, tick } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { dev } from '$app/env';
  import { uuidv4, dayjs } from '@metafy/lib/utils';
  import { query, mutate, gql } from '@metafy/lib/apollo';
  import { CONVERSATION_FIELDS, GET_CONVERSATION_MESSAGES } from '@metafy/graphql/queries';
  import {
    ADD_CONVERSATION_MESSAGE,
    EDIT_CONVERSATION_MESSAGE,
    REMOVE_CONVERSATION_MESSAGE,
    MARK_CONVERSATION_SEEN
  } from '@metafy/graphql/mutations';
  import { Toasts, onlineUsers, chatState } from '@metafy/lib/stores';

  import Modal from '@metafy/components/Modal.svelte';
  import PaginationSentinel from '@metafy/components/PaginationSentinel.svelte';
  import Scrollable from '@metafy/components/Scrollable.svelte';
  import Avatar from '@metafy/components/Avatar.svelte';
  import PreviewMedia from '@metafy/components/PreviewMedia.svelte';
  import InputWithMedia from './InputWithMedia.svelte';
  import Message from './Message.svelte';
  import CoachInfoPopup from './CoachInfoPopup.svelte';
  import CoachInfo from './CoachInfo.svelte';

  import Cross from '@metafy/assets/svgs/cross.svg';
  import Controller from '@metafy/assets/svgs/chat/controller.svg';
  // import IconDragDrop from '@metafy/assets/svgs/chat/drag_drop.svg';

  export let conversation = null;
  export let isLoading = false;

  const dispatch = createEventDispatcher();
  const response = query({
    query: GET_CONVERSATION_MESSAGES,
    variables: { id: conversation?.id }
  });
  const { account } = getContext('app');

  $: loadConversationData(conversation?.id);
  $: messages = ($response.data?.conversationMessages?.edges || []).map((e) => e.node).reverse();
  $: partnerName = $chatState.participants.partner?.roles?.includes?.('coach')
    ? $chatState.participants.partner?.coachProfile?.name
    : $chatState.participants.partner?.name;
  $: isOnline = !!$onlineUsers.find((id) => id === $chatState.participants.partner?.id);
  $: isUnread = conversation?.unreadMessageCount > 0;

  let paginationDisabled = true;
  $: if (paginationDisabled && !$response.loading) {
    tick().then(() => {
      scrollDown();
      paginationDisabled = false;
    });
  }

  let messageComps = [];
  let closeMedia;
  let focusInput;
  let isLoadingNextPage = false;
  let isCoachInfoOpen = false;
  let isPreviewVisible = false;
  let previewDelta;
  let scrollEl;

  // Keep a total count of how many times we dragenter (increment) and dragleave
  // (decrement) on the file drop-zone (including its children, because events fire
  // on the children elements too).
  // If > 0, it means we're hovering a file over the dropzone, otherwise we're not.
  let isDragging = 0;

  let lastFetchValue = conversation?.id;
  async function loadConversationData(id) {
    try {
      if (id === undefined || id === lastFetchValue) {
        // Don't do anything.
      } else {
        isLoading = true;
        await $response.query?.refetch({ id });
        lastFetchValue = id;
      }
    } catch (error) {
      // ...
    } finally {
      isLoading = false;
    }
  }

  async function createMessage({ detail: { delta } }) {
    try {
      const optimisticMessage = {
        __typename: 'ConversationMessage',
        id: uuidv4(),
        seen: false,
        reported: false,
        createdAt: dayjs().toISOString(),
        editedAt: null,
        delta,
        isSystem: false,
        sender: $chatState.participants.myself
      };
      const { data } = await mutate({
        mutation: ADD_CONVERSATION_MESSAGE,
        variables: {
          otherId: $chatState.participants.partner.id,
          message: { delta }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addConversationMessage: {
            __typename: 'AddConversationMessagePayload',
            status: 'success',
            conversation: {
              __typename: 'Conversation',
              id: uuidv4(),
              unreadMessageCount: 0,
              participants: [$chatState.participants.myself, $chatState.participants.partner],
              latestMessage: {
                ...optimisticMessage
              }
            },
            conversationMessage: {
              ...optimisticMessage
            }
          }
        },
        update: (cache, { data: { addConversationMessage } }) => {
          scrollDown();
          if (addConversationMessage?.status !== 'success') {
            return;
          }
          // add the message to cache
          try {
            const data = cache.readQuery({
              query: GET_CONVERSATION_MESSAGES,
              variables: { id: addConversationMessage.conversation.id }
            });
            if (data?.conversationMessages) {
              cache.writeQuery({
                query: GET_CONVERSATION_MESSAGES,
                variables: { id: addConversationMessage.conversation.id },
                data: {
                  conversationMessages: {
                    ...data.conversationMessages,
                    edges: [
                      {
                        node: addConversationMessage.conversationMessage,
                        __typename: 'ConversationMessageEdge'
                      },
                      ...data.conversationMessages.edges
                    ]
                  }
                }
              });
            }
          } catch (error) {
            if (dev) console.error(error);
            $response.query?.refetch();
          }
          // update latest message
          if (addConversationMessage?.conversationMessage) {
            cache.modify({
              id: `Conversation:${addConversationMessage.conversation.id}`,
              fields: {
                latestMessage(existing = {}) {
                  const fragment = cache.writeFragment({
                    data: addConversationMessage.conversationMessage,
                    fragment: gql`
                      fragment LatestMessage on ConversationMessage {
                        id
                        delta
                        createdAt
                        isSystem
                        sender {
                          id
                        }
                      }
                    `,
                    fragmentName: 'LatestMessage'
                  });
                  return fragment;
                }
              }
            });
          }
        }
      });
      if (data?.addConversationMessage?.status === 'success') {
        // Set conversation if non-existant
        if (!conversation.id) {
          conversation = data.addConversationMessage.conversation;
        }
      }
    } catch (error) {
      if (dev) console.error(error);
      Toasts.push({
        kind: 'error',
        content: 'There was an issue sending your message.'
      });
    }
  }

  async function handleDeleteMessage({ detail }) {
    try {
      const { data } = await mutate({
        mutation: REMOVE_CONVERSATION_MESSAGE,
        variables: { id: detail?.id },
        optimisticResponse: {
          __typename: 'Mutation',
          removeConversationMessage: {
            status: 'success'
          }
        },
        update: (cache) => {
          cache.modify({
            fields: {
              conversationMessages(existing = {}, { readField }) {
                const edges = (existing.edges || []).filter(
                  (edge) => readField('id', edge.node) !== detail.id
                );
                return { ...existing, edges };
              }
            }
          });
        }
      });
    } catch (error) {
      if (dev) console.error(error);
      Toasts.push({
        kind: 'error',
        content: 'There was an issue deleting this message.'
      });
    }
  }

  function handleStartEditMessage({ detail }) {
    const i = messages.findIndex((m) => m.id === detail.id);
    // If it's the latest message, scroll chat down.
    if (i === messages.length - 1) {
      scrollDown();
    }
  }

  function handleEditRecentMessage() {
    const myMessages = messages.filter((m) => m.sender.id === $chatState.participants.myself.id);
    const myLatestIdx = messages.findIndex((m) => m.id === myMessages[myMessages.length - 1].id);
    messageComps[myLatestIdx]?.edit();
  }

  // TODO: Explore why conversation doesn't get updated when Apollo's cache is updated after the mutation
  let allUnread = false;
  async function readAllMessages() {
    try {
      if (!conversation?.id || !isUnread || allUnread) {
        return;
      }
      const { data } = await mutate({
        mutation: MARK_CONVERSATION_SEEN,
        variables: { conversationId: conversation.id }
      });
      if (data?.markConversationSeen?.status === 'success') {
        allUnread = true;
      }
    } catch (error) {
      if (dev) console.error(error);
    }
  }

  async function handleEditMessage({ detail }) {
    try {
      const { data } = await mutate({
        mutation: EDIT_CONVERSATION_MESSAGE,
        variables: { id: detail?.id, message: { delta: detail?.delta } },
        optimisticResponse: {
          __typename: 'Mutation',
          editConversationMessage: {
            __typename: 'EditConversationMessage',
            status: 'success',
            conversationMessage: {
              __typename: 'ConversationMessage',
              id: detail?.id,
              delta: detail?.delta,
              editedAt: dayjs().toISOString()
            }
          }
        }
      });
    } catch (error) {
      if (dev) console.error(error);
      Toasts.push({
        kind: 'error',
        content: 'There was an issue editing this message.'
      });
    }
  }

  async function handleReportMessage({ detail }) {
    try {
      const { data } = await mutate({
        mutation: EDIT_CONVERSATION_MESSAGE,
        variables: { id: detail?.id, message: { reported: true } }
      });
    } catch (error) {
      if (dev) console.error(error);
      Toasts.push({
        kind: 'error',
        content: 'There was an issue reporting this message.'
      });
    }
  }

  function handlePreview({ detail }) {
    previewDelta = detail?.delta;
    isPreviewVisible = true;
  }

  function handleDragEnter() {
    isDragging++;
  }

  function handleDragLeave() {
    isDragging--;
  }

  function handleDragDrop(event) {
    //   openImageUpload();
    //   console.log('dropped, event:', event);
    //   // TODO: Hook-up: Handle dropped image
  }

  function shouldShowDate(messageIdx) {
    const msg = messages[messageIdx];
    try {
      if (msg.editedAt) {
        return true;
      }
      if (!(messageIdx + 1 in messages)) {
        return true;
      }
      const nextMsg = messages[messageIdx + 1];
      if (msg.sender.id !== nextMsg?.sender?.id) {
        return true;
      }
      if (nextMsg) {
        const date = dayjs(msg.createdAt).tz($account.data.session.timezone);
        const nextDate = dayjs(nextMsg.createdAt).tz($account.data.session.timezone);
        if (date.diff(nextDate, 'minute') <= -10) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      console.log(msg);
    }
  }

  async function loadNextPage({ detail: { detail } }) {
    try {
      if (
        detail &&
        conversation?.id &&
        $response.data?.conversationMessages?.pageInfo?.hasNextPage
      ) {
        isLoadingNextPage = true;
        await $response.query?.fetchMore({
          variables: { after: $response.data.conversationMessages.pageInfo.endCursor }
        });
      }
    } catch (error) {
      if (dev) console.error(error);
    } finally {
      isLoadingNextPage = false;
    }
  }

  function scrollDown() {
    if (scrollEl) {
      requestAnimationFrame(() => {
        scrollEl.scrollTo(0, scrollEl.scrollHeight);
      });
    }
  }
</script>

<Modal
  isVisible={conversation}
  placement="custom"
  backgroundZindex="z-lower-modal-backdrop"
  modalZindex="z-lower-modal"
  class="conversation-gradient-border left-0 top-0 xl:left-auto xl:top-auto xl:bottom-0 xl:right-[404px]"
  widthClass="w-full h-full xl:w-100 xl:h-150"
  disableScroll="mobile"
  overflow="overflow-hidden"
  rounded="rounded-t-lg"
  hasBackground={false}
  closeButton={false}
  closeOnClickOutside={false}
>
  <div
    class="conversation flex flex-col rounded-t-lg"
    on:click={() => {
      // Clear unread messages.
      if (isUnread) {
        readAllMessages();
      }
    }}
  >
    <div class="header flex items-center px-5 py-4">
      {#if $chatState.participants.partner}
        <div class="relative overflow-hidden mr-4">
          <Avatar
            user={$chatState.participants.partner}
            name={partnerName}
            rounded="rounded-lg"
            size="w-10 h-10"
          />
          <div class="online-indicator-cutout absolute flex bg-neutrals-d10 rounded-full" />
          <div class="online-indicator absolute bottom-0 right-0 rounded-full" class:isOnline />
        </div>
        <div class="flex flex-col">
          <h2 class="font-medium text-neutrals-l00 leading-none mb-2">{partnerName}</h2>
          <p class="font-medium text-xs text-neutrals-l40 uppercase leading-none tracking-0.08">
            {#if isOnline}Online{:else}Offline{/if}
          </p>
        </div>
        <div class="flex space-x-3 ml-auto">
          {#if $chatState.participants.partner?.roles?.includes?.('coach') && messages.length > 0}
            <button
              on:click={() => {
                // Close others.
                closeMedia();
                // Open coach info.
                isCoachInfoOpen = !isCoachInfoOpen;
              }}
            >
              <Controller class="text-white" />
            </button>
          {/if}
          <button on:click={() => dispatch('close')}>
            <Cross />
          </button>
        </div>
      {:else}
        <div class="spinner w-full h-full" />
      {/if}
    </div>

    <div class="separator flex-shrink-0" />

    <!-- File dropzone -->
    {#if $response.loading}
      <div class="spinner w-full h-full" />
    {:else}
      <div
        class="flex flex-col relative pb-4"
        style="height: calc(100% - 74px);"
        on:dragenter={handleDragEnter}
        on:dragleave={handleDragLeave}
        on:drop|preventDefault={handleDragDrop}
      >
        <Scrollable bind:scrollEl class="overscroll-contain">
          <PaginationSentinel disabled={paginationDisabled} on:hit={loadNextPage} />
          <div class="flex flex-col pt-5 px-5">
            {#if isLoadingNextPage && !isLoading}
              <div class="spinner w-full h-8 py-2" />
            {:else if isLoading}
              <div class="spinner w-full h-full" />
            {:else if conversation?.id}
              {#each messages as message, idx (message.id)}
                <!-- If has unread messages, figure out when to show the line -->
                {#if isUnread && messages.length - conversation.unreadMessageCount === idx}
                  <div class="unread-line flex items-center mb-3">
                    <div class="line left" />
                    <p
                      class="font-medium text-xs text-neutrals-l00 uppercase whitespace-nowrap tracking-0.08 leading-none mx-2"
                    >
                      New messages
                    </p>
                    <div class="line right" />
                  </div>
                {/if}
                <Message
                  bind:this={messageComps[idx]}
                  {message}
                  showDate={shouldShowDate(idx)}
                  on:startEdit={handleStartEditMessage}
                  on:edit={handleEditMessage}
                  on:delete={handleDeleteMessage}
                  on:report={handleReportMessage}
                  on:preview={handlePreview}
                />
              {/each}
            {/if}

            {#if !isLoading && (conversation?.id === undefined || messages.length === 0) && $chatState.participants.partner?.roles?.includes?.('coach')}
              <CoachInfo account={$chatState.participants.partner} footerBg="bg-neutrals-d20" />
            {/if}
          </div>
        </Scrollable>

        <div class="pt-5 px-5 mt-auto">
          <InputWithMedia
            bind:focusInput
            bind:closeMedia
            mediaInputOffset={[0, 40]}
            on:message={createMessage}
            on:arrowUp={handleEditRecentMessage}
            on:mediaOpen={() => {
              isCoachInfoOpen = false;
              isDragging = 0;
            }}
          />
        </div>

        <!-- TODO-2.1: Image Upload -->
        <!-- {#if isDragging}
          <div
            class="absolute top-0 left-0 w-full h-full flex bg-neutrals-d30 bg-opacity-85 pointer-events-none"
            transition:fade={{ duration: 200 }}
          >
            <div class="dragging-container bg-neutrals-d10 rounded-lg p-3 m-auto">
              <div
                class="flex flex-col items-center justify-center text-center border border-functional-r50 border-dashed rounded-lg p-6"
              >
                <IconDragDrop />
                <h2 class="font-medium text-neutrals-l00 leading-none mt-6 mb-2">Drag & Drop</h2>
                <p class="text-xs text-neutrals-l40 leading-4">Just release the image to upload</p>
              </div>
            </div>
          </div>
        {/if} -->

        {#if isCoachInfoOpen}
          <div
            class="absolute top-0 left-0 w-full flex bg-transparent"
            transition:fade|local={{ duration: 200 }}
          >
            <CoachInfoPopup
              account={$chatState.participants.partner}
              bind:active={isCoachInfoOpen}
            />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</Modal>

<PreviewMedia bind:isVisible={isPreviewVisible} delta={previewDelta} />

<style>
  :global(.conversation-gradient-border),
  :global(.hub-gradient-border) {
    @screen xl {
      padding: 1px;
      background-image: linear-gradient(
        179.73deg,
        rgba(163, 222, 255, 0.22) 0.25%,
        rgba(163, 222, 255, 0) 99.79%
      );
    }
  }

  .conversation {
    background-color: #16181c;
    width: 100%;
    height: 100%;
    @screen xl {
      width: 400px;
      height: 600px;
    }

    & .header {
      background: linear-gradient(
        271.18deg,
        rgba(48, 82, 107, 0.0896) 1.01%,
        rgba(40, 63, 84, 0.28) 47.89%,
        rgba(40, 63, 84, 0.0896) 98.99%
      );

      & button {
        @apply flex items-center justify-center bg-neutrals-d10 rounded-md;
        width: 28px;
        height: 28px;
        &:focus {
          @apply outline-none;
        }
        &:hover {
          @apply bg-functional-r20;
        }
      }
    }

    & .separator {
      @apply w-full;
      height: 2px;
      background: linear-gradient(
        90.52deg,
        rgba(48, 82, 107, 0) 0.51%,
        #30526b 48.04%,
        rgba(48, 82, 107, 0) 99.6%
      );
    }

    & :global(.overscroll-contain) {
      height: calc(100% - 60px);
      @screen xl {
        height: 446px;
      }
    }
  }

  .unread-line .line {
    width: 100%;
    height: 1px;
    &.left {
      background: linear-gradient(90.63deg, rgba(241, 67, 67, 0) 0.61%, #f14343 119.31%);
    }
    &.right {
      background: linear-gradient(90.65deg, #f14343 -23%, rgba(241, 67, 67, 0) 99.51%);
    }
  }

  .online-indicator-cutout {
    width: 24px;
    height: 24px;
    right: -11px;
    bottom: -12px;
  }
  .online-indicator {
    width: 7px;
    height: 7px;
    /* @apply bg-neutrals-l30; */
    &.isOnline {
      /* @apply bg-functional-g20; */
    }
  }

  /* .dragging-container {
    width: 200px;
  } */
</style>
