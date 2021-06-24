<script>
  import { getContext } from 'svelte';
  import { displayLiveSessionState, formatDate, humanizeDurationHours } from '@metafy/lib/utils';
  import { LIVE_SESSION_STATUS_COLORS } from '@metafy/lib/constants';

  import Avatar from '@metafy/components/Avatar.svelte';
  import GamePoster from '@metafy/components/GamePoster.svelte';

  import IconLesson from '@metafy/assets/svgs/sessions/lesson.svg';

  //   const { account } = getContext('app');

  export let session = {};
  export let isLarge = false;
  export let sessionsCount = 0;
  export let isHero = false;
  export let isTeam = false;
  let className = '';
  export { className as class };

  // TODO: Coaching 3.0:
  // Currently for team sessions we show only the student and the coach, but it could show all the team members assigned to the session.
  // Otherwise show the other person.
  const isCoach = false;
  //   const isCoach = $account.data.session.id === session.coach.id;
  const other = isCoach ? session.student : session.coach;
  const otherName = isCoach ? other.name : other.coachProfile.name;
  const participants = [session.student, session.coach];

  const isSingle = (isHero && isLarge) || sessionsCount === 1;
  const isCouple = (isHero && !isLarge) || sessionsCount === 2;
  const MAX_USERS_TO_SHOW = Math.min(participants.length, 2);

  $: title = isTeam
    ? `${participants[0].name} with ${participants[1].coachProfile.name}`
    : session.lessonPlan
    ? (session.lessonPlan.lessons.find((m) => m.booking?.id === session.id)?.title ||
        session.lessonPlan.title) +
      ' with ' +
      otherName
    : 'Live Session with ' + otherName;
  //   $: dateTimeFormatted = formatDate(session.scheduledAt, $account.data.session.timezone);

  function getMessage() {
    switch (session.state) {
      case 'completed':
      case 'confirmed':
      case 'pending':
      case 'disputed':
        return session.coachQuestionAnswers.length > 0
          ? session.coachQuestionAnswers[0].answer
          : '';
      case 'rescheduling':
        return session.rescheduledMessage || '';
      case 'canceled':
        return session.canceledMessage || '';
      default:
        return '';
    }
  }
</script>

<a
  href="/account/session/{session.id}"
  sveltekit:prefetch
  class="flex flex-col items-stretch bg-neutrals-d10 bg-opacity-80 hover:bg-opacity-100 rounded-2xl p-3 pt-3.5 md:px-5 {isSingle
    ? 'md:pb-5'
    : 'md:pb-4'} {isCouple || isLarge ? 'space-y-4' : 'space-y-2.5'} transition-colors {className}"
  class:row-span-2={isLarge && !isSingle && !isCouple}
  class:xl:col-span-2={isSingle}
>
  <div
    class="flex justify-between items-center pb-2.5 border-b border-neutrals-l50 border-opacity-15"
  >
    <span class="font-medium leading-none text-white {isSingle ? 'text-sm' : 'text-xs'}">
      <!-- <span>{dateTimeFormatted}</span> -->
      <span class="text-neutrals-l40">({humanizeDurationHours(session.duration / 60)})</span>
    </span>
    <span
      class="inline-flex items-center px-2 font-medium leading-none rounded text-xxs h-5 bg-opacity-15 {LIVE_SESSION_STATUS_COLORS[
        session.state
      ]}"
    >
      {displayLiveSessionState(session.state)}
    </span>
  </div>

  <div class="flex flex-1 items-stretch space-x-6">
    {#if isSingle}
      <div class="hidden w-44 h-44 relative flex-shrink-0 rounded-2xl md:block bg-neutrals-d60">
        <GamePoster
          game={session.game}
          link={false}
          class="opacity-65"
          size="w-44 h-44"
          rounded="rounded-2xl"
        />
      </div>
    {/if}

    <div class="flex flex-col flex-1 space-y-4 w-full">
      <div class="flex items-center space-x-3" class:pt-1={isSingle}>
        {#if isTeam}
          <div class="flex items-center -mt-1 -ml-1 -space-x-6.5">
            {#each { length: MAX_USERS_TO_SHOW } as _, i (i)}
              <Avatar
                user={participants[i]}
                class="bg-neutrals-d10"
                size="w-11.5 h-11.5"
                border="border-3 border-neutrals-d10"
                rounded="rounded-xl"
              />
            {/each}
          </div>
        {:else}
          <Avatar
            user={other}
            class="bg-neutrals-d10"
            size="w-11.5 h-11.5"
            border="border-3 border-neutrals-d10"
            rounded="rounded-xl"
          />
        {/if}
        <div class="flex flex-col space-y-2 min-w-0">
          <span class="text-sm leading-none text-white truncate">{title}</span>
          <div class="flex items-center">
            {#if session.lessonPlan}
              <IconLesson class="text-neutrals-l40 h-3 w-3 mr-1.5" />
            {/if}
            <span class="text-xs leading-none text-neutrals-l40 truncate">
              {session.lessonPlan ? session.lessonPlan.title : session.game.title['en']}
            </span>
          </div>
        </div>
      </div>

      {#if isSingle || isCouple || isLarge}
        <p class="flex-1 text-xs leading-normal text-neutrals-l40 opacity-65 line-clamp-3">
          {getMessage()}
        </p>
      {/if}
    </div>
  </div>
</a>
