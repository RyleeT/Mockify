<script>
  import Modal from '@metafy/components/Modal.svelte';

  export let isVisible = false;
  export let delta;
</script>

<Modal
  bind:isVisible
  class="bg-transparent"
  modalZindex="z-higher-modal"
  backgroundZindex="z-higher-modal-backdrop"
  widthClass="w-11/12 xl:w-auto"
  closeButton={false}
>
  {#if delta}
    {#if 'image' in delta.insert}
      <img src={delta.insert.image} class="rounded-md" alt="Preview" loading="lazy" />
    {:else if 'gif' in delta.insert}
      <video
        class="object-cover rounded-md"
        src={delta.insert.gif}
        muted
        autoplay
        loop
        playsinline
      />
    {/if}
  {/if}
</Modal>
