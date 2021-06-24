<svelte:options accessors />

<script context="module">
  // Emoji matching regex. See: https://medium.com/@thekevinscott/emojis-in-javascript-f693d0eb79fb
  const emojiRe = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  const splitter = new GraphemeSplitter();
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import GraphemeSplitter from 'grapheme-splitter';

  import FormControl from '@metafy/components/FormControl.svelte';
  import IconEmoji from '@metafy/assets/svgs/chat/emoji.svg';

  const dispatch = createEventDispatcher();

  export let value = '';
  export let placeholder = 'Type your message';
  export let rows = 1;
  export let canGrow = false;
  // Used for editing messages with images or GIFs in them:
  // The (sub)delta passed in through `prependDelta` will be added to the final dispatched message.
  export let prependDelta = null;
  export let focus = null;
  export let hasEmojiPicker = true;
  export let isEmojiPickerOpen = false;
  export let canPasteImages = true;
  let className = 'bg-neutrals-d00';
  export { className as class };
  export let areButtonsHidden;

  $: grown = canGrow && value.length > 48;

  export function send() {
    let message = { delta: [] };
    let words = '';
    // Use GraphemeSplitter to correctly split the message into "characters", where
    // each character is either a simple ASCII char, or an emoji (even if the emoji is composed of 1, 2, or 6 code points,
    // it only takes up one char) so we can correctly iterate over them.
    for (const char of splitter.splitGraphemes(value)) {
      // It's just a string
      if (!char.match(emojiRe)) {
        words = words.concat(char);
        continue;
      }

      // It's an emoji
      // First add the previously gathered words, if any
      if (words !== '') {
        message.delta.push({ insert: words });
        words = '';
      }

      // An emoji can be composed of multiple codePoints, iterate over all of them,
      // convert to hex, and gather into a single string.
      // ES6 iteration correctly iterates over codePoints.
      let emoji = '';
      for (const codePoint of char) {
        emoji += '0x' + codePoint.codePointAt(0).toString(16);
      }
      message.delta.push({ insert: { emoji } });
    }
    if (words !== '') {
      message.delta.push({ insert: words });
    }

    if (prependDelta !== null) {
      message.delta.unshift(prependDelta);
    }
    dispatch('message', message);
    value = '';
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowUp' && (!value || value.length === 0)) {
      dispatch('arrowUp');
      // Prevent event from bubbling up, because once the up arrow is pressed,
      // the latest message starts to get edited, and if we don't cancel this event the up arrow
      // will move the cursor to the start of the line.
      event.preventDefault();
      return;
    }
    if (event.key === 'Escape') {
      dispatch('cancelEdit');
      return;
    }
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (value) {
      send();
      event.target.value = '';
    }
  }

  export function append(v) {
    value = value.concat(v);
  }

  // When opening the MediaInput with a keyboard shortcut ":", we need to
  // remove the inserted colon after the message is sent.
  export function removeLastChar() {
    value = value.slice(0, -1);
  }

  function handlePaste(event) {
    if (!canPasteImages) {
      return;
    }

    // event.preventDefault();
    // console.log('pasted:', event);
    // TODO: Hook-up: Only pass what's needed
    // dispatch('pasteImage', { event });
  }
</script>

<div class="relative flex w-full" class:grown class:areButtonsHidden>
  <FormControl
    type="textarea"
    class="chat-input-box {className} block resize-none"
    rows={grown ? 3 : rows}
    {placeholder}
    bind:value
    bind:focus
    on:input
    on:keydown={handleKeydown}
    on:paste={handlePaste}
  />

  {#if hasEmojiPicker}
    <button
      class="emoji absolute flex focus:outline-none"
      class:active={isEmojiPickerOpen}
      on:click={() => dispatch('mediaInput:emoji')}
    >
      <IconEmoji class="text-neutrals-l30 transition-colors ease-in-out duration-200 m-auto" />
    </button>
  {/if}
</div>

<style>
  :global(.chat-input-box) {
    @apply text-sm px-3 py-2;
    padding-right: 40px;
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .grown {
    position: absolute;
    width: calc(100% - 96px);
    bottom: 16px;
    &.areButtonsHidden {
      width: calc(100% - 110px);
    }
  }
  .emoji {
    width: 40px;
    height: 40px;
    right: 0;
  }
  .emoji:hover :global(svg) {
    @apply text-functional-r50;
  }
  .emoji.active :global(svg) {
    @apply text-functional-r50;
  }
</style>
