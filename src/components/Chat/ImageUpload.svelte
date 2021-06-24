<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  import Modal from '@metafy/components/Modal.svelte';
  import Button from '@metafy/components/Button.svelte';
  import Input from './Input.svelte';

  import Cross from '@metafy/assets/svgs/cross.svg';

  const dispatch = createEventDispatcher();

  export let isVisible = false;
  export let image =
    'https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fA==&w=1000&q=80';
  export let filename = 'mountains.jpg';

  let message;

  function sendMessage() {
    let delta = [{ insert: { image } }];
    if (message) {
      delta.push({ insert: message });
    }
    dispatch('message', { delta });
    close();
  }

  function close() {
    isVisible = false;
  }
</script>

<Modal
  bind:isVisible
  portalTarget="body"
  class="image-upload-container bg-neutrals-d20 shadow"
  closeButton={false}
  widthClass=""
  rounded="rounded-lg"
>
  <div class="p-5" transition:fly|local={{ y: 100, duration: 200 }}>
    <div class="flex">
      <h3 class="font-medium text-neutrals-l00 leading-none">Post Image</h3>
      <button class="ml-auto" on:click={close}>
        <Cross />
      </button>
    </div>

    <div class="flex flex-col items-center mt-8 mb-10 mx-auto">
      <img src={image} class="image object-cover rounded-md mb-4" alt="Upload preview" />
      <p class="text-sm leading-none text-neutrals-l30">{filename}</p>
    </div>

    <Input
      bind:value={message}
      on:message={sendMessage}
      placeholder="Add an optional message"
      rows={2}
      canPasteImages={false}
      hasEmojiPicker={false}
    />

    <div class="flex space-x-3 mt-4">
      <Button
        on:click={close}
        kind="basic"
        class="w-1/2"
        textSize="text-xs"
        fontWeight="font-normal"
        padding="px-8 py-3"
      >
        Cancel
      </Button>
      <Button
        on:click={sendMessage}
        kind="primary"
        class="w-1/2"
        textSize="text-xs"
        fontWeight="font-semibold"
        padding="px-8 py-3"
      >
        Upload
      </Button>
    </div>
  </div>
</Modal>

<style>
  :global(.image-upload-container) {
    width: 384px;
  }
  .image {
    width: 240px;
    height: 156px;
  }
</style>
