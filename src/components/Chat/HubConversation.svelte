<script>
  import { getContext } from 'svelte';
  import { chatState } from '@metafy/lib/stores';
  import { dayjs } from '@metafy/lib/utils';

  import { renderEmoji } from './Message.svelte';
  import HubEntry from './HubEntry.svelte';

  // import IconImage from '@metafy/assets/svgs/chat/hub_image.svg';
  import IconGIF from '@metafy/assets/svgs/chat/hub_gif.svg';
  import IconControllerTiny from '@metafy/assets/svgs/chat/controller_tiny.svg';
  // import IconSystemCalendar from '@metafy/assets/svgs/chat/system_calendar.svg';

  export let conversation = {};
  export let separatorTop = true;
  export let separatorBottom = true;

  const { account } = getContext('app');

  $: partner = conversation?.participants?.find?.(
    (p) => p.id !== $chatState.participants.myself.id
  );
  $: isUnread = conversation?.unreadMessageCount > 0;
  $: latestIsMine = conversation?.latestMessage?.sender?.id === $chatState.participants.myself.id;
  // $: hasImage = conversation.latestMessage?.delta?.some?.(d => typeof d.insert === 'object' && 'image' in d.insert);
  $: hasGIF = conversation?.latestMessage?.delta?.some?.(
    (d) => typeof d.insert === 'object' && 'gif' in d.insert
  );

  let dateFormatted;
  $: if (conversation?.latestMessage) {
    const d = dayjs(conversation.latestMessage.createdAt).tz($account.data.session.timezone);
    const format = d.diff(dayjs(), 'day') <= -1 ? 'MMM M' : 'h:mm a';
    dateFormatted = d.format(format);
  }
</script>

<HubEntry account={partner} {isUnread} {separatorTop} {separatorBottom} on:click>
  <div slot="header" class="w-full flex items-center">
    {#if $chatState.participants.myself.roles.includes('coach') && partner?.roles?.includes?.('coach')}
      <div class="coach-badge rounded flex items-center justify-center ml-2">
        <IconControllerTiny />
      </div>
    {/if}
    {#if dateFormatted?.isValid}
      <span class="date text-tiny text-neutrals-l40 leading-none ml-auto" class:isUnread>
        {dateFormatted}
      </span>
    {/if}
  </div>
  <p class="latest-message text-xs text-neutrals-l30 mt-2" class:isUnread>
    {#if conversation?.latestMessage?.isSystem}
      <!-- TODO-2.1 -->
      <div />
      <!-- {:else if hasImage}
      <div class="flex items-center">
        <IconImage />
        <span class="text-xs italic leading-tight ml-2"
          >{latestIsMine ? 'You sent an image' : 'Sent you an image'}
        </span>
      </div> -->
    {:else if hasGIF}
      <div class="flex items-center">
        <IconGIF />
        <span class="text-xs italic leading-tight ml-2"
          >{latestIsMine ? 'You sent a GIF' : 'Sent you a GIF'}</span
        >
      </div>
    {:else if conversation?.latestMessage}
      <!-- Render text and emojis -->
      {#each conversation.latestMessage?.delta as d}
        {#if typeof d?.insert === 'string'}
          <span class="text-xs leading-tight">{d.insert}</span>
        {:else if typeof d?.insert === 'object'}
          {#if 'emoji' in d.insert}<span class="emoji">{renderEmoji(d.insert.emoji)}</span>{/if}
        {/if}
      {/each}
    {/if}
  </p>
</HubEntry>

<style>
  .coach-badge {
    width: 19px;
    height: 16px;
    background-color: #b82f36;

    & :global(svg) {
      width: 11px;
      height: 7px;
    }
  }
  .date {
    letter-spacing: 0.06em;
    &.isUnread {
      @apply text-neutrals-l00;
    }
  }
  .latest-message {
    /* Clamp to 2 lines:  */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    &.isUnread {
      @apply text-neutrals-l00;
    }
  }
  .emoji {
    font-family: emoji;
  }
</style>
