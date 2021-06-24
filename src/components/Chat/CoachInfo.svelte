<script>
  import BookLessonButton from '@metafy/routes/@[coach]/_components/BookLessonButton.svelte';
  import Avatar from '@metafy/components/Avatar.svelte';
  import Image from '@metafy/components/Image.svelte';
  import GamePoster from '@metafy/components/GamePoster.svelte';

  export let account = {};
  export let footerBg = 'bg-neutrals-d10 bg-opacity-40';

  $: coach = account.coachProfile;
  let lowestPrice = Infinity;
  $: {
    for (const coachGame of coach.coachGames) {
      for (const lesson of coachGame.lessons) {
        lowestPrice = Math.min(lowestPrice, lesson.baseRateCents / 100);
      }
    }
  }
</script>

<div class="flex flex-col w-2/3 text-center items-center mt-5 mb-6 mx-auto">
  <Avatar user={account} rounded="rounded-md" class="mb-4 self-center" size="w-[88px] h-[88px]" />
  <h3 class="text-neutrals-l00 text-xl font-medium leading-none mb-3">{coach.name}</h3>
  {#if coach.title}
    <p class="font-medium text-neutrals-l30 text-sm uppercase tracking-0.1">{coach.title}</p>
  {/if}
</div>

{#if coach.coachGames.length === 1}
  <div
    class="flex self-start items-center p-1.5 pb-1 pr-2 bg-neutrals-d10 bg-opacity-25 rounded mx-auto"
  >
    <GamePoster game={coach.coachGames[0].game} class="mr-2" rounded="rounded" size="w-5 h-5" />
    <p class="text-sm text-neutrals-l00 font-medium leading-none">
      {coach.coachGames[0].game.title.en}
    </p>
  </div>
{:else if coach.coachGames.length > 1}
  <div class="flex items-center mx-auto">
    <div class="flex mr-3">
      {#each coach.coachGames.slice(0, 6) as coachGame, idx}
        <GamePoster
          class="-ml-3 border-3 {idx === 0 ? 'border-transparent' : 'border-[#16181c]'}"
          game={coachGame.game}
          size="w-8 h-8"
          rounded="rounded"
        />
      {/each}
      {#if coach.coachGames.length > 6}
        <div class="flex bg-functional-r70 w-8 h-8 border-3 border-[#16181c] rounded -ml-3">
          <span class="text-neutrals-l00 text-xs font-medium leading-none tracking-0.1 m-auto"
            >+{coach.coachGames.length - 6}</span
          >
        </div>
      {/if}
    </div>
    <p class="text-neutrals-l00 text-sm font-medium leading-none">
      {coach.coachGames.length} games
    </p>
  </div>
{/if}

{#if lowestPrice !== Infinity}
  <div class="{footerBg} flex rounded-lg p-5 mt-8">
    <div class="flex flex-col">
      <h3 class="text-xs font-medium text-functional-l30 uppercase tracking-0.1 leading-none mb-1">
        Lessons
      </h3>
      <h3 class="text-base text-neutrals-l00 font-semibold leading-none">
        Starting at
        <span class="text-xl font-medium text-functional-r10">
          {#if lowestPrice > 0}${lowestPrice}{:else}Free{/if}
        </span>
      </h3>
    </div>
    <BookLessonButton
      coachProfile={coach}
      text="Book"
      icon={false}
      class="tracking-0.08 ml-auto"
      textSize="text-xs"
      padding="px-8 py-3"
    />
  </div>
{:else}
  <BookLessonButton
    coachProfile={coach}
    text="Book"
    icon={false}
    class="tracking-0.08 mx-auto mt-8"
    textSize="text-xs"
    padding="px-8 py-3"
  />
{/if}
