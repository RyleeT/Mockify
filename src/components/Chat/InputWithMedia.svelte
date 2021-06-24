<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import Input from './Input.svelte';
  import ImageUpload from './ImageUpload.svelte';
  import MediaInput, { tabs as mediaInputTabs } from './MediaInput.svelte';

  import IconImage from '@metafy/assets/svgs/chat/image.svg';
  import IconGIF from '@metafy/assets/svgs/chat/gif.svg';
  import IconReveal from '@metafy/assets/svgs/chat/reveal.svg';
  import IconSend from '@metafy/assets/svgs/chat/send.svg';

  const dispatch = createEventDispatcher();

  // In `large` mode, show in a vertical layout, with the Input taking up more space.
  export let large = false;
  export let placeholder = 'Type your message';
  export let hasSendButton = true;
  export let mediaInputOffset = [0, 40];

  const hideButtonsWhileTyping = !large;
  const rows = large ? 2 : 1;

  let inputEl;
  let send;
  let inputHasText = false;
  let areButtonsHidden = false;

  let isImageUploadVisible = false;

  let isMediaInputVisible = false;
  let isMediaInputFromKeyboard = false;
  let mediaInputTab = mediaInputTabs.emoji;

  export function closeMedia() {
    isImageUploadVisible = false;
    isMediaInputVisible = false;
  }

  export function focusInput() {
    if (inputEl) {
      inputEl.focus();
    }
  }

  function openImageUpload() {
    dispatch('mediaOpen');

    // Close others.
    isMediaInputVisible = false;
    // Open image uploader.
    isImageUploadVisible = true;
  }

  function toggleMediaInput(tab) {
    dispatch('mediaOpen');

    // Close others.
    isImageUploadVisible = false;
    // Open media input.
    mediaInputTab = tab;
    isMediaInputVisible = !isMediaInputVisible;
  }
</script>

<article class="flex" class:flex-col-reverse={large}>
  {#if areButtonsHidden}
    <button class="reveal" on:click={() => (areButtonsHidden = false)}>
      <IconReveal />
    </button>
  {:else}
    <div
      class="input-buttons flex items-center {large
        ? 'border-t border-neutrals-l50 border-opacity-15 pt-2.5'
        : 'mr-2'}"
    >
      <slot name="actions-before" />
      <button
        on:click={() => toggleMediaInput(mediaInputTabs.gif)}
        class="{large ? 'ml-auto' : ''} mr-2"
      >
        <IconGIF class="text-neutrals-l30" />
      </button>
      <!-- <button on:click={openImageUpload}>
        <IconImage class="text-neutrals-l30" />
      </button> -->
      <slot name="actions-after" />
    </div>
  {/if}
  <div class="flex flex-grow">
    <slot name="input-before" />

    <Input
      isEmojiPickerOpen={isMediaInputVisible}
      {placeholder}
      {rows}
      canGrow
      class={large ? 'chat-input-large' : 'bg-neutrals-d00'}
      {areButtonsHidden}
      bind:this={inputEl}
      bind:send
      on:input={(event) => {
        inputHasText = event.target.value.length > 0;
        areButtonsHidden = hideButtonsWhileTyping && inputHasText;
      }}
      on:message={(event) => {
        dispatch('message', event.detail);
        isMediaInputVisible = false;
        inputHasText = false;
        areButtonsHidden = false;
        inputEl.focus();
      }}
      on:arrowUp
      on:pasteImage={({ detail }) => {
        // console.log('pasted:', detail.event);
        // TODO-2.1: Hook-up: Do something with pasted image
        // openImageUpload();
      }}
      on:mediaInput:emoji={({ detail }) => {
        if (detail?.fromKeyboard) {
          isMediaInputFromKeyboard = true;
        }
        toggleMediaInput(mediaInputTabs.emoji);
      }}
    />
  </div>

  {#if hasSendButton && inputHasText}
    <button class="send flex xl:hidden ml-2" on:click={send}>
      <IconSend />
    </button>
  {/if}
</article>

<ImageUpload bind:isVisible={isImageUploadVisible} on:message />
<MediaInput
  activeTab={mediaInputTab}
  bind:isVisible={isMediaInputVisible}
  offset={mediaInputOffset}
  on:select:emoji={({ detail }) => {
    // When opening the MediaInput with a keyboard shortcut ":", we need to
    // remove the inserted colon after the message is sent.
    if (isMediaInputFromKeyboard) {
      inputEl.removeLastChar();
      isMediaInputFromKeyboard = false;
    }
    inputEl.append(detail.value);
    inputEl.focus(true);
  }}
  on:select:gif={({ detail }) => {
    dispatch('message', { delta: [{ insert: { gif: detail.value } }] });
  }}
  on:close={() => {
    inputEl.focus();
  }}
/>

<style>
  :global(.chat-input-large) {
    @apply text-base border-transparent bg-transparent;
    &:focus {
      @apply bg-transparent border-transparent;
    }
    &:hover {
      @apply bg-transparent;
    }
  }
  .input-buttons {
    & button {
      @apply bg-neutrals-d00 rounded-md flex justify-center items-center;
      @apply transition-colors ease-in-out duration-200;
      width: 40px;
      height: 40px;
      &:hover {
        @apply bg-brands-metafy bg-opacity-20;
        & :global(svg) {
          @apply text-functional-r50;
        }
      }
      &:focus {
        @apply outline-none;
      }

      & :global(svg) {
        @apply transition-colors ease-in-out duration-200;
      }
    }
  }

  button.reveal {
    @apply flex;
    width: 23px;
    height: 40px;
    &:focus {
      @apply outline-none;
    }

    & :global(svg) {
      @apply text-neutrals-l30 my-auto;
      @apply transition-colors ease-in-out duration-200;
    }

    &:hover :global(svg) {
      @apply text-functional-r50;
    }
  }

  button.send {
    @apply flex-shrink-0 rounded-lg;
    background-color: #be3434;
    width: 40px;
    height: 40px;
    &:focus {
      @apply outline-none;
    }

    & :global(svg) {
      @apply m-auto;
    }
  }
</style>
