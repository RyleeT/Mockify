<script>
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { booking, chatState, dashboardState } from '@metafy/lib/stores';
  import { pluralize, humanizeDurationHours } from '@metafy/lib/utils';

  import Avatar from '@metafy/components/Avatar.svelte';
  import Button from '@metafy/components/Button.svelte';
  import Image from '@metafy/components/Image.svelte';
  import ProgressBar from '@metafy/components/ProgressBar.svelte';

  import IconPack from '@metafy/assets/svgs/account/pack--gradient.svg';
  import IconMessageBubble from '@metafy/assets/svgs/chat/message_bubble.svg';

  export let bundle = {};
  let className = '';
  export { className as class };
  export let breakpoint = 600;

  //   const { account } = getContext('app');

  let clientWidth;
  $: isLarge = clientWidth > breakpoint;

  const { lesson } = bundle;

  $: remainingSubTitle =
    bundle.type === 'live' &&
    humanizeDurationHours((bundle.remaining * bundle.lesson.duration) / 60, true);

  //   async function handleRedeem(bundle) {
  //     $booking.coachGame = bundle.lesson.coachGame;
  //     $booking.lesson = bundle.lesson;
  //     $booking.bundle = { quantity: 1, percentOff: 0 };
  //     $booking.bookingType = bundle.lesson.type;
  //     await goto(`/@${bundle.lesson.coachGame.account.coachProfile.slug}/schedule`);
  //   }

  function onChat() {
    if ($chatState.enabled && $chatState.instance) {
      $chatState.instance.createConversation(bundle.lesson.coachGame.account.coachProfile);
    }
  }
</script>

<div bind:clientWidth>
  {#if !!clientWidth}
    <div class="flex flex-col p-4 space-y-3.5 rounded-lg bg-neutrals-d60 {className}">
      <div class="flex items-center">
        <div class="relative flex-shrink-0 {isLarge ? 'mr-4.5' : 'mr-3'}">
          <Avatar
            user={bundle.lesson.coachGame.account}
            name={bundle.lesson.coachGame.account.coachProfile.name}
            size={isLarge ? 'w-12 h-12' : 'w-10 h-10'}
            rounded="rounded-lg"
          />
          <Image
            class="absolute bottom-0 right-0 object-cover p-0.5 -m-0.5 bg-neutrals-d60"
            src={bundle.lesson.coachGame.game.poster}
            alt={bundle.lesson.coachGame.game.title.en}
            size={isLarge ? 'w-7 h-7' : 'w-6 h-6'}
            rounded="rounded-md"
          />
        </div>

        <div class="min-w-0 mr-auto">
          <p class="text-sm text-white truncate">
            {bundle.lesson.coachGame.account.coachProfile.name}
          </p>
          <p class="flex items-center text-xs truncate text-neutrals-l40">
            <span>
              {#if lesson.type === 'live'}
                {humanizeDurationHours(lesson.duration / 60, true)} live session
              {:else if lesson.type === 'replay'}
                replay review
              {/if}
            </span>
            {#if isLarge}
              <span class="w-1 h-1 mx-2 rounded-full bg-neutrals-l40 bg-opacity-65" />
              <span>
                {bundle.lesson.coachGame.game.title.en}
              </span>
            {/if}
          </p>
        </div>

        <Button
          kind="outline"
          padding={isLarge ? 'px-3' : ''}
          rounded="rounded-2xl"
          size={isLarge ? 'h-10' : 'w-10 h-10'}
          class="inline-flex items-center justify-center flex-shrink-0 space-x-2 text-white border-neutrals-l40 bg-neutrals-l40"
          on:click={() => onChat()}
        >
          <IconMessageBubble class="w-4" />
          {#if isLarge}
            <span>{bundle.lesson.coachGame.account.coachProfile.name}</span>
          {/if}
        </Button>
      </div>

      <div
        class="p-3 rounded-lg bg-neutrals-d80 flex {isLarge ? 'space-x-12' : 'flex-col space-y-4'}"
      >
        <div class="flex flex-col justify-between flex-1">
          <div
            class="flex items-center justify-between mb-2 leading-none text-white text-xxs tracking-0.01"
          >
            <span class="text-white {isLarge ? 'text-sm' : 'text-xs'}">
              <span>
                {pluralize('session', bundle.remaining)} remaining
              </span>

              {#if remainingSubTitle}
                <span class="text-neutrals-l40">
                  ({remainingSubTitle})
                </span>
              {/if}
            </span>
          </div>

          <ProgressBar
            kind="skewed"
            total={bundle.total}
            value={bundle.remaining}
            height="h-1.5"
            barBackgroundColor="bg-functional-g40"
          />
        </div>

        <Button
          kind="gradient"
          padding="px-4"
          size="h-10"
          rounded="rounded-lg"
          textSize="text-xs"
          backgroundColor="bg-neutrals-d80"
          class="inline-flex justify-center items-center whitespace-nowrap {!isLarge
            ? 'w-full'
            : ''}"
          on:click={() => console.log('handleRedeem(bundle)')}
        >
          <IconPack class="mr-2" />
          <span>Schedule a session</span>
        </Button>
      </div>
    </div>
  {/if}
</div>
