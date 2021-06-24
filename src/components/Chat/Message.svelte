<script context="module">
  // Takes a string of the hex-represented emoji codepoints.
  // Example:
  // "0x1f3f30xfe0f0x200d0x1f308" (4 code points)
  // "0x1f602" (1 code point)
  export function renderEmoji(hexCodePoints) {
    return String.fromCodePoint(
      ...hexCodePoints
        .split('0x')
        .slice(1)
        .map((c) => '0x' + c)
    );
  }
</script>

<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { tooltip } from '@metafy/lib/directives/tooltip';
  import { chatState } from '@metafy/lib/stores';
  import { dayjs } from '@metafy/lib/utils';

  import Dropdown from '@metafy/components/Dropdown.svelte';
  import Input from './Input.svelte';

  import IconThreeDots from '@metafy/assets/svgs/chat/three_dots.svg';
  import EditMessage from '@metafy/assets/svgs/chat/edit_message.svg';
  import DeleteMessage from '@metafy/assets/svgs/chat/delete_message.svg';
  import ReportMessage from '@metafy/assets/svgs/chat/report_message.svg';

  const dispatch = createEventDispatcher();

  export let message;
  export let showDate = false;

  let isEditing = false;
  let isActionVisible = false;
  let focus;
  export async function edit() {
    isEditing = true;
    isActionVisible = false;
    dispatchAction('startEdit');
    // Wait for our input to get mounted to the DOM, and then focus it.
    await tick();
    focus(true); // `true` means move cursor to the end.
  }

  let dateFormatted;
  $: {
    const d = dayjs(message.createdAt);
    const format = d.diff(dayjs(), 'day') <= -1 ? 'MMM M, h:mm a' : 'h:mm a';
    dateFormatted = d.format(format);
  }
  $: isMine = message.sender?.id === $chatState.participants.myself.id;
  $: editedAtFormatted = message.editedAt && dayjs(message.editedAt).format('MMM M, h:mm:ss a');

  // Get just the image/GIF part of a delta so we can pass it to our Input separately when editing a message.
  // This image/GIF will just be prepended to the final message, as only the text part of a message can be edited.
  // We can also use this to figure out if the message has an image/GIF or not.
  let image, gif;
  $: {
    image = message.delta.find((d) => typeof d.insert === 'object' && 'image' in d.insert);
    gif = message.delta.find((d) => typeof d.insert === 'object' && 'gif' in d.insert);
  }

  $: isOnlyEmoji = message.delta.every((d) => typeof d.insert === 'object' && 'emoji' in d.insert);

  function dispatchAction(action, extra) {
    dispatch(action, { id: message.id, ...extra });
  }

  // Get a textual representation of the delta, so we can pass it to the input as a value that can be edited.
  // Only returns text and emoji, ignoring images and GIFs.
  function deltaToText() {
    let text = '';
    for (const d of message.delta) {
      switch (typeof d.insert) {
        case 'string':
          text += d.insert;
          break;
        case 'object':
          if ('emoji' in d.insert) {
            text += renderEmoji(d.insert.emoji);
          }
          break;
      }
    }
    return text;
  }
</script>

<article
  class="{isMine ? 'me' : message.isSystem ? 'system' : 'them'} flex flex-col w-full self-start"
  in:fade|local={{ duration: 100 }}
>
  <div class="action-row flex items-center">
    <div class="bubble py-2 px-3" class:isEditing class:opacity-30={message.reported}>
      {#if !message.isSystem}
        {#if isEditing}
          {#if image}
            <img
              src={image.insert.image}
              class="image object-cover rounded-md mt-1 mb-2"
              alt="{message.sender.name} sent an image"
            />
          {:else if gif}
            <video
              class="object-cover cursor-pointer rounded-md mt-1 mb-2"
              src={gif.insert.gif}
              muted
              autoplay
              loop
              playsinline
            />
          {/if}
          <Input
            bind:focus
            value={deltaToText()}
            prependDelta={image || gif}
            placeholder=""
            rows={2}
            canPasteImages={false}
            hasEmojiPicker={false}
            on:message={({ detail }) => {
              dispatchAction('edit', { delta: detail.delta });
              isEditing = false;
            }}
            on:cancelEdit={() => {
              isEditing = false;
            }}
          />
        {:else}
          {#each message.delta as d}
            {#if typeof d.insert === 'string'}
              <span class="text-sm whitespace-pre-line">{d.insert}</span>
            {:else if typeof d.insert === 'object'}
              {#if 'emoji' in d.insert}
                <span class="emoji" class:big={isOnlyEmoji && message.delta.length <= 6}
                  >{renderEmoji(d.insert.emoji)}</span
                >
              {:else if 'image' in d.insert}
                <img
                  src={d.insert.image}
                  class="image object-cover cursor-pointer rounded-md mt-1 mb-2"
                  alt="{message.sender.name} sent an image"
                  on:click={() => dispatch('preview', { delta: d })}
                />
              {:else if 'gif' in d.insert}
                <video
                  class="video object-cover cursor-pointer rounded-md mt-1 mb-2"
                  on:click={() => dispatch('preview', { delta: d })}
                  src={d.insert.gif}
                  muted
                  autoplay
                  loop
                  playsinline
                />
              {/if}
            {/if}
          {/each}
        {/if}
      {:else}
        <!-- TODO-2.1: <BookingSystemMessage {booking}
        isCoach={$chatState.participants.myself.roles.includes('coach')} /> -->
        <div />
      {/if}
    </div>
    {#if !message.reported}
      <Dropdown
        placement="bottom-{isMine ? 'start' : 'end'}"
        containerClass="action {isEditing ? 'hidden' : ''} ml-auto"
        contentClass="bg-neutrals-d10 rounded border border-neutrals-l30 border-opacity-20 shadow-lg p-1"
        isVisible={isActionVisible}
        offset={[0, 8]}
        minWidth={150}
        on:click={() => {
          isActionVisible = !isActionVisible;
        }}
      >
        <button
          slot="trigger"
          class="action-dropdown-button hidden bg-neutrals-d00 rounded-md justify-center items-center focus:outline-none"
        >
          <IconThreeDots />
        </button>
        <ul slot="content" class="action-buttons">
          {#if isMine}
            <li>
              <button on:click={edit} class="text-neutrals-l00">
                <EditMessage />
                Edit message</button
              >
            </li>
            <li>
              <button
                on:click={() => {
                  isActionVisible = false;
                  dispatchAction('delete');
                }}
                class="text-functional-r50"><DeleteMessage />Delete</button
              >
            </li>
          {:else}
            <li>
              <button
                on:click={() => {
                  isActionVisible = false;
                  dispatchAction('report');
                }}
                class="text-neutrals-l00"><ReportMessage />Report</button
              >
            </li>
          {/if}
        </ul>
      </Dropdown>
    {/if}
  </div>
  {#if showDate}
    <div class="footer leading-none">
      <span class="date font-medium text-neutrals-l40 text-opacity-60 uppercase"
        >{dateFormatted}</span
      >
      {#if message.editedAt}
        <span
          class="text-xs text-neutrals-l40 text-opacity-60"
          use:tooltip={{ content: 'Edited at ' + editedAtFormatted, placement: 'top' }}
          >&middot; Edited</span
        >
      {/if}
      {#if message.reported}
        <span class="text-xs text-neutrals-l40 text-opacity-60">&middot; Reported</span>
      {/if}
    </div>
  {/if}
</article>

<style>
  article {
    @apply mt-2;

    & .footer {
      @apply mt-2 mb-3;
    }
    & .date {
      font-size: 11px;
      letter-spacing: 0.06em;
    }

    & .bubble {
      @apply rounded-md;
      max-width: 300px;
      &.isEditing {
        max-width: none;
        width: 100%;
      }

      & .emoji {
        @apply text-xl;
        font-family: emoji;
        &.big {
          font-size: 32px;
        }
      }
    }

    &:first-child {
      @apply mt-0;
    }
    &:last-child .footer {
      @apply mb-0;
    }

    &:hover button.action-dropdown-button {
      @apply flex;
    }
    & button.action-dropdown-button {
      width: 40px;
      height: 28px;
    }
  }

  .me {
    @apply ml-auto;
    & .bubble {
      @apply bg-neutrals-d20 text-neutrals-l30 rounded-br-none ml-auto;
    }
    & .footer {
      @apply ml-auto;
    }

    & .action-row {
      @apply flex-row-reverse;
      & :global(.action) {
        @apply mr-auto ml-0;
      }
    }
  }

  .system {
    & .bubble {
      @apply w-full max-w-none bg-neutrals-d20 rounded-md;
    }
    &:hover button.action-dropdown-button {
      @apply hidden;
    }
  }

  .them .bubble {
    @apply bg-neutrals-d50 text-neutrals-l00 rounded-bl-none;
  }

  .image,
  .video {
    width: 284px;
    height: 152px;
  }

  .action-buttons button {
    @apply flex w-full text-left items-center text-sm leading-none pl-2 pr-5 py-2;
    &:hover {
      @apply bg-neutrals-d00 rounded-md;
    }
    &:focus {
      @apply outline-none;
    }
    & :global(svg) {
      @apply mr-3;
    }
  }
</style>
