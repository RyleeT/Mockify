<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { STATIC_URL } from '@metafy/lib/constants';
  import { booking, dashboardState } from '@metafy/lib/stores';

  import Alert from '@metafy/components/Alert.svelte';
  import Button from '@metafy/components/Button.svelte';
  import Image from '@metafy/components/Image.svelte';
  import CountdownTimer from '@metafy/components/CountdownTimer.svelte';
  import CopyDiscord from '@metafy/components/CopyDiscord.svelte';
  import Price from '@metafy/components/Price.svelte';

  import IconPending from '@metafy/assets/svgs/pending.svg';
  import IconCheckmark from '@metafy/assets/svgs/checkmark_circled.svg';
  import IconCanceled from '@metafy/assets/svgs/sessions/canceled.svg';
  import IconLightning from '@metafy/assets/svgs/lightning.svg';
  import IconTwitter from '@metafy/assets/svgs/twitter.svg';
  import IconReschedule from '@metafy/assets/svgs/sessions/reschedule.svg';

  const { account } = getContext('app');
  const dispatch = createEventDispatcher();

  export let lesson;
  export let plan;
  export let isCoach;
  export let isFloating;

  $: session = plan || lesson;
  $: other = isCoach ? session?.student : session?.coach;
  $: otherName = isCoach ? other.name : other.coachProfile.name;

  $: ALERTS = {
    coach: {
      pending: {
        icon: IconPending,
        title: 'Pending confirmation from you',
        textColor: 'text-functional-y20',
        backgroundColor: 'bg-functional-y20 bg-opacity-[0.12]',
        countdown: 'This request is going to expire in'
      },
      canceled: {
        icon: IconCanceled,
        title: 'This session was cancelled',
        description: session?.canceledMessage ? `"${session.canceledMessage}"` : null,
        textColor: 'text-functional-r50',
        backgroundColor: 'bg-neutrals-d80'
      },
      rescheduling: {
        icon: IconReschedule,
        title: 'Reschedule request is on the way!',
        textColor: 'text-functional-y20',
        backgroundColor: 'bg-functional-y20 bg-opacity-[0.12]',
        countdown: `Time left for ${otherName} to reschedule`
      },
      confirmed: {
        countdown: 'This session starts in'
      }
    },
    student: {
      pending: {
        icon: IconPending,
        title: `Your ${lesson ? 'session ' : ''}request is on the way!`,
        textColor: 'text-functional-y20',
        backgroundColor: 'bg-functional-y20 bg-opacity-[0.12]',
        countdown: `Time left for ${otherName} to respond`
      },
      canceled: {
        icon: IconCanceled,
        title: 'This session was cancelled',
        description: session?.canceledMessage ? `"${session.canceledMessage}"` : null,
        textColor: 'text-functional-r50',
        backgroundColor: 'bg-neutrals-d80'
      },
      rescheduling: {
        icon: IconReschedule,
        title: `${otherName} wants to reschedule`,
        description: lesson?.rescheduledMessage ? `"${lesson.rescheduledMessage}"` : null,
        textColor: 'text-functional-y20',
        backgroundColor: 'bg-neutrals-d80',
        countdown: 'Time left for you to reschedule'
      },
      confirmed: {
        countdown: 'This session starts in'
      }
    }
  };

  $: alert = ALERTS[isCoach ? 'coach' : 'student'][session.state] || {};

  // Don't show main alert in case of canceled twice
  $: hideMainAlert = !isCoach && 'canceled' === session.state && session.canceledPromoCode;
  $: hideMainAlertMobile =
    (isCoach && session.state === 'rescheduling') || (!isCoach && session.state === 'pending');

  $: wideFloating =
    isFloating &&
    ((isCoach && ['pending'].includes(session.state)) ||
      (!isCoach && ['rescheduling'].includes(session.state)));
</script>

<div
  class="flex flex-col w-full
    {isFloating
    ? 'fixed bottom-16 left-1/2 bg-neutrals-d80 max-w-sm px-6 py-4 transform -translate-x-1/2 rounded-t-2xl lg:flex-col lg:rounded-2xl lg:bg-neutrals-d10 lg:p-5 lg:relative'
    : 'flex-col rounded-2xl bg-neutrals-d10 p-4 sm:p-5 relative lg:hidden mt-5 sm:mt-8 lg:mt-0'}
    {wideFloating ? 'md:max-w-2xl md:flex-row justify-between' : 'justify-center'} {isFloating &&
  session.state === 'canceled'
    ? 'hidden lg:flex'
    : ''}
    "
>
  {#if alert.title && !hideMainAlert}
    <div
      class="mb-4 {hideMainAlertMobile ? 'hidden lg:block' : isFloating ? 'hidden lg:block' : ''}"
    >
      <Alert
        icon={alert.icon}
        title={alert.title}
        description={alert.description}
        textColor={alert.textColor}
        backgroundColor={alert.backgroundColor}
      />
    </div>
  {/if}

  {#if isFloating && ['pending', 'rescheduling', 'confirmed'].includes(session.state)}
    <div class="lg:mb-5 {wideFloating ? 'md:my-1.5 lg:mt-0' : ''}">
      <CountdownTimer
        type={session.state}
        label={alert.countdown}
        date={session.state === 'confirmed' ? session.scheduledAt : session.expiresAt}
      />
    </div>
  {/if}

  {#if (isCoach && session.state === 'pending') || (!isCoach && session.state === 'rescheduling')}
    <span class="hidden rounded w-0.5 md:flex lg:hidden bg-opacity-15 bg-neutrals-l40" />
  {/if}

  {#if session.state === 'confirmed'}
    {#if isCoach}
      <div
        class="border rounded-lg border-neutrals-l50 border-opacity-15 hover:text-white mt-4.5 lg:mt-0"
      >
        <CopyDiscord {other} backgroundColor="bg-neutrals-d80" />
      </div>
    {:else}
      <Button
        kind="outline"
        rounded="rounded-lg"
        textSize="text-sm"
        class="flex items-center justify-center space-x-3 font-medium text-neutrals-l40 border-neutrals-l50 border-opacity-15 hover:text-white mt-4.5 lg:mt-0"
        size="h-10"
        href="https://twitter.com/intent/tweet?text={encodeURIComponent(
          `Just booked a Metafy session with ${otherName}!`
        )}&hashtags=metafy"
        target="_blank"
      >
        <IconTwitter class="text-white" />
        <span>Share the news</span>
      </Button>
    {/if}
  {/if}

  {#if session.state === 'canceled'}
    {#if isCoach}
      <p class="text-sm leading-normal text-neutrals-l40">
        {#if !session.canceledById}
          This session was cancelled.
        {:else if session.canceledById === other.id}
          {otherName} has cancelled this session.
        {:else}
          You’ve cancelled this session.
        {/if}
      </p>
    {/if}

    {#if !isCoach && !session?.canceledPromoCode}
      <div class="flex items-center mb-5 lg:mt-4">
        <div
          class="illustrations-drop hidden relative flex-shrink-0 mr-6 w-[83px] h-[112px] rounded-2xl bg-neutrals-d80 lg:block"
        >
          <Image
            class="absolute bottom-0 max-w-none"
            src="{STATIC_URL}/illustrations/time.svg"
            size="w-[94px]"
            lazy={false}
          />
        </div>
        <div>
          <p class="text-xs text-neutrals-l40 sm:text-sm lg:text-xs">
            {otherName} was unable to accept your request. The coach may have been busy.
            <strong class="mt-2 font-medium text-white sm:block">
              Try booking again or <a href="mailto:support@metafy.gg"
                >reach out to our support team</a
              >
              for a refund.
              <!-- TODO: Refund to credit -->
              <!-- Try booking again or refund the amount back to your account. -->
            </strong>
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3 sm:space-x-4">
        <!-- TODO: Refund to credit -->
        <!-- <Button
            kind="outline"
            padding="sm:px-4 lg:px-0"
            rounded="rounded-lg"
            textSize="text-sm"
            class="flex-1 flex-shrink-0 font-medium text-white border-neutrals-l40 border-opacity-35 sm:flex-initial lg:flex-1"
            size="h-10"
            on:click={() => dispatch('decline')}
          >
            Refund to Credit
          </Button> -->
        <Button
          kind="gradient"
          backgroundColor="bg-neutrals-d10"
          padding="sm:px-8.5 lg:px-0"
          rounded="rounded-lg"
          size="h-10"
          class="flex-1 flex-shrink-0 text-white sm:flex-initial lg:flex-1"
          on:click={async () => {
            if (plan) {
              $booking.bookingType = 'plan';
              $booking.plan = plan;
            } else if (lesson) {
              $booking.coachGame = session.lesson.coachGame;
              $booking.lesson = session.lesson;
              $booking.bundle = { quantity: 1, percentOff: 0 };
              $booking.bookingType = session.lesson.type;
            }
            await goto(`/@${session.coach.coachProfile.slug}/schedule`);
          }}
        >
          Book again
        </Button>
      </div>
    {/if}

    {#if !isCoach && session?.canceledPromoCode}
      <div
        class="grid grid-cols-[83px,1fr] grid-rows-[auto,1fr] md:grid-rows-[auto,1fr] gap-x-5 md:gap-x-12.5 lg:gap-x-5 gap-y-5.5 md:gap-y-4 lg:gap-y-5.5"
      >
        <Alert
          class="col-span-2 md:col-span-1 lg:col-span-2"
          icon={alert.icon}
          title={alert.title}
          description={alert.description}
          textColor={alert.textColor}
          backgroundColor={alert.backgroundColor}
        />

        <div
          class="relative flex-shrink-0 rounded-2xl bg-neutrals-d80 w-[83px] h-[88px] md:h-[190px] md:col-start-1 md:row-start-1 md:row-span-3 lg:h-[88px] lg:row-span-1"
        >
          <Image
            class="absolute -top-1.5 -left-4.5 max-w-none md:-left-8 md:top-7.5 lg:-left-4.5 lg:-top-1.5"
            src="{STATIC_URL}/illustrations/fly.svg"
            size="w-[111px] md:w-[156px] lg:w-[111px]"
            lazy={false}
          />
        </div>

        <div class="pt-2 md:pt-0 lg:pt-2">
          <p class="text-xs leading-normal md:text-sm lg:text-xs text-neutrals-l40">
            Looks like this coach is not available for coaching.
          </p>
          <p class="text-xs font-medium leading-normal text-white md:text-sm lg:text-xs">
            Here is a <span class="text-functional-g30">10% discount</span>, let us find you another
            coach!
          </p>
        </div>

        <div
          class="flex flex-col items-center justify-between col-span-2 p-4 pt-6 border border-dashed md:p-3 md:pl-5 lg:p-4 lg:pt-6 border-opacity-30 border-functional-g20 rounded-2xl md:col-span-1 md:row-start-3 md:flex-row lg:flex-col lg:col-span-2"
        >
          <span
            class="mb-4 text-xl font-medium leading-none text-transparent uppercase md:mb-0 lg:mb-4 tracking-0.08 bg-clip-text bg-gradient-to-r from-functional-g20 to-functional-b10"
          >
            {session.canceledPromoCode}
          </span>

          <!-- TODO: Not Hooked up -->
          <!-- <Button
              kind="gradient"
              backgroundColor="bg-neutrals-d10"
              padding="px-6 lg:px-0"
              rounded="rounded-lg"
              size="h-10"
              class="w-full md:w-auto lg:w-full"
            >
              Browse coaches
            </Button> -->
        </div>

        <div class="flex items-center col-span-2 pl-1 space-x-4">
          <span class="flex-shrink-0 text-white">
            <IconLightning />
          </span>
          <p class="text-xs leading-normal text-neutrals-l40">
            This discount code is automatically applied while you book your next session with a
            coach.
          </p>
        </div>
      </div>
    {/if}
  {/if}

  {#if isCoach && session.state === 'pending'}
    {#if plan}
      <div class="items-center hidden mb-5 lg:flex">
        <span class="mt-1 text-sm leading-none text-neutrals-l40">You'll make</span>
        <Price figure={plan.priceCents} class="ml-auto text-xl font-medium" />
      </div>
    {/if}
    <div
      class="relative flex flex-row-reverse items-center justify-center mt-5 space-x-3 space-x-reverse md:space-x-0 md:flex-col-reverse md:mt-0 lg:flex-col lg:space-x-0 lg:space-y-5"
    >
      <div class="flex-1 flex-shrink-0 md:flex-shrink md:flex-grow-0 lg:w-full">
        <Button
          kind="custom"
          rounded="rounded-lg"
          padding="md:px-11 lg:p-0"
          textSize="text-sm"
          class="flex items-center justify-center w-full space-x-3 font-medium text-white bg-functional-g30"
          size="h-10"
          on:click={() => dispatch('accept')}
        >
          <IconCheckmark />
          <span>
            <span>Accept</span>
            <span class="hidden md:inline">this request</span>
          </span>
        </Button>
      </div>

      <div
        class="flex-1 flex-shrink-0 w-full md:flex md:items-center md:justify-end lg:justify-center"
      >
        {#if plan}
          <Price
            figure={plan.priceCents}
            class="hidden mr-auto text-xl font-medium md:inline-flex lg:hidden"
          />
        {/if}
        <Button
          kind="outline"
          padding=""
          rounded="rounded-lg"
          textSize="text-sm"
          class="flex items-center justify-center w-full font-medium text-center text-white md:w-auto md:inline-flex border-neutrals-l40 border-opacity-35 md:text-neutrals-l40 hover:underline md:border-none"
          size="h-10 md:h-auto"
          on:click={() => dispatch('decline')}
        >
          {plan ? 'Decline?' : "Can't make it?"}
        </Button>
      </div>
    </div>
  {/if}

  {#if (!isCoach && session.state === 'pending') || (isCoach && session.state === 'rescheduling')}
    <div
      class="grid-cols-[57px,1fr] sm:grid-cols-[91px,1fr] grid-rows-[40px,1fr] md:grid-rows-[48px,1fr] gap-x-5.5 sm:gap-x-8.5 gap-y-4 sm:gap-y-5 lg:gap-x-4 {isFloating
        ? 'hidden lg:grid'
        : 'grid'}"
    >
      {#if !isFloating}
        <Alert
          class="col-span-2 sm:col-span-1"
          icon={alert.icon}
          title={alert.title}
          description={alert.description}
          textColor={alert.textColor}
          backgroundColor={alert.backgroundColor}
        />
      {/if}

      <div
        class="illustrations-drop sm:col-start-1 sm:row-start-1 sm:row-span-2 relative ml-0.5 sm:m-0 rounded-2xl bg-neutrals-d80 w-[57px] h-[88px] sm:w-[91px] sm:h-[142px] lg:w-[83px] lg:h-[130px]"
      >
        <Image
          class="absolute -bottom-1 sm:-bottom-2 -left-1 lg:bottom-0 lg:left-0 max-w-none"
          src="{STATIC_URL}/illustrations/time.svg"
          size="w-[67px] sm:w-[114px] lg:w-[94px]"
          lazy={false}
        />
      </div>

      <div
        class="flex flex-col justify-center space-y-3 sm:justify-start sm:row-span-1 lg:justify-center lg:row-span-2"
      >
        <span class="text-xs font-medium leading-none text-white uppercase tracking-0.08">
          What if time runs out?
        </span>
        <p class="text-xs leading-normal sm:mr-2 lg:m-0 text-neutrals-l40">
          {isCoach
            ? "This session will be cancelled if the student fails to reschedule the session. You'll receive an updated request when the student reschedules to a new time."
            : "We've got you covered! You can try rebooking or we can refund the full session price back to your account."}
        </p>
      </div>
    </div>
  {/if}

  {#if !isCoach && session.state === 'rescheduling'}
    <div class="items-center {isFloating ? 'hidden lg:flex mb-5' : 'flex'}">
      <div
        class="illustrations-drop relative mr-7.5 flex-shrink-0 rounded-2xl bg-neutrals-d80 w-[83px] h-[90px] {!isFloating
          ? 'hidden'
          : ''}"
      >
        <Image
          class="absolute left-0 bottom-1.5 max-w-none"
          src="{STATIC_URL}/illustrations/calendar.svg"
          size="w-[104px]"
          lazy={false}
        />
      </div>

      <div>
        <p class="text-xs text-neutrals-l40 sm:text-sm lg:text-xs">
          {otherName} wants to reschedule this session to a new time.
          <strong class="mt-2 font-medium text-white sm:block">
            This session will be cancelled if you fail to reschedule.
          </strong>
        </p>
      </div>
    </div>

    {#if isFloating}
      <div class="flex items-center mt-4 md:mt-0">
        <Button
          href="/@{session.coach.coachProfile.slug}/reschedule/{session.id}"
          kind="gradient"
          backgroundColor={isFloating
            ? 'bg-gradient-to-r from-[#2d2d32] to-[#282b34] lg:from-transparent lg:to-transparent lg:bg-neutrals-d10'
            : 'bg-neutrals-d10'}
          padding="px-3 sm:px-6"
          rounded="rounded-lg"
          size="h-10"
          class="inline-flex items-center justify-center flex-1 text-white md:flex-initial lg:w-full"
        >
          <IconReschedule class="w-3.5" />
          <span class="ml-2">
            <span>Reschedule</span>
            <span class="hidden lg:inline">the session</span>
          </span>
        </Button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .illustrations-drop :global(img) {
    filter: drop-shadow(-2px 4px 0px rgba(0, 0, 0, 0.12));
  }
</style>
