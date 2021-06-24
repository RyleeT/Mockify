<script>
  import { chatState } from '@metafy/lib/stores';

  import Button from '@metafy/components/Button.svelte';
  import EmptyInbox from '@metafy/assets/svgs/chat/empty_inbox.svg';
</script>

<div class="flex flex-col text-center w-3/4 mx-auto mt-28">
  <div class="ml-4">
    <EmptyInbox class="mx-auto" />
  </div>
  <h3 class="font-medium text-neutrals-l00 leading-none mt-6 mb-3">It’s empty here</h3>
  <p class="text-xs text-neutrals-l40 leading-normal mb-5">
    {#if $chatState.participants.myself.roles.includes('coach')}
      You don’t have any ongoing conversations, you’ll see messages when a student books one of your
      lesson.
    {:else}You don’t have any ongoing conversations, start chatting with a coach now.{/if}
  </p>
</div>
