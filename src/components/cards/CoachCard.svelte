<script>
  import { fly, fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import Scrollable from '@metafy/components/Scrollable.svelte';
  import Dropdown from '@metafy/components/Dropdown.svelte';
  import Avatar from '@metafy/components/Avatar.svelte';
  import GameTag from '@metafy/components/GameTag.svelte';

  import IconMedal from '@metafy/assets/svgs/medal.svg';
  import Achievement from '@metafy/components/Achievement.svelte';

  export let coach = {};
  export let idx = 0;
  export let showAchievements = false;
  export let showGames = false;
  export let allowedGames = [];
  export let hasDelay = true;

  let className = '';
  export { className as class };

  let isVisible;
  let isScrolling;
  let achievements = [0, 0, 0]; // First - Second - Third

  $: coachAchievements =
    (showAchievements &&
      coach?.coachAchievements
        .filter(({ placement }) => !!placement && placement <= 3)
        .sort((a, b) => a.placement - b.placement)
        .map((achievement) => {
          const { placement } = achievement;
          if (placement <= 3) {
            achievements[placement - 1]++;
          }
          return achievement;
        })) ||
    [];
  $: coachGames = showGames
    ? !!allowedGames.length
      ? coach.coachGames.filter(({ game }) => allowedGames.includes(game.slug))
      : coach.coachGames
    : [];

  let lowestPrice = Infinity;
  $: {
    for (const coachGame of coach.coachGames) {
      for (const lesson of coachGame.lessons) {
        lowestPrice = Math.min(lowestPrice, lesson.baseRateCents / 100);
      }
    }
  }

  function shortGameTitle(game) {
    return game.title.en
      .replace('Super Smash Bros. Melee', 'Melee')
      .replace('Smash Ultimate', 'Ultimate');
  }

  function getPlacementColors(placement) {
    if (placement === 1)
      return { text: 'text-[#966803]', medal: '--primaryColor: #C0880E; --accentColor: #FAC640;' };
    if (placement === 2)
      return { text: 'text-[#797E80]', medal: '--primaryColor: #797E80; --accentColor: #E3E3E3;' };
    return { text: 'text-[#9B5A48]', medal: '--primaryColor: #9B5A48; --accentColor: #E5C0A9;' };
  }
</script>

<a
  class="relative block transition-all duration-300 ease-in-out pointer-events-none group transform-gpu bg-neutrals-d10 rounded-3xl hover:bg-neutrals-d00 hover:-translate-y-1.5 hover:z-10 {className}"
  href="/@{coach.slug}"
  sveltekit:prefetch
  in:fly|local={{ duration: 400, y: -40, delay: hasDelay ? 100 * idx : 0, easing: cubicInOut }}
>
  <div
    class="absolute -top-9 md:-top-11.5 left-4 md:left-6 xl:left-8 w-[80px] h-[80px] md:w-[96px] md:h-[96px] rounded-[20px] pointer-events-auto"
  >
    <Avatar
      user={coach.account}
      size="w-[80px] h-[80px] md:w-[96px] md:h-[96px]"
      rounded="rounded-[20px]"
    />
    {#if !!coachAchievements.length}
      <div
        class="absolute bottom-0 p-2 pb-3 text-white transform -translate-x-5 translate-y-2 left-full rounded-t-2xl"
      >
        <!-- fix flashing issue on hover -->
        <div
          class="absolute top-0 left-0 w-6 transition-colors bottom-2 rounded-tl-2xl rounded-br-2xl bg-neutrals-d10 group-hover:bg-neutrals-d00"
        />
        <Dropdown
          placement="right-start"
          containerClass=""
          contentClass="bg-neutrals-d10 rounded-3xl shadow-lg overflow-hidden"
          {isVisible}
          offset={[-10, -30]}
          minWidth={300}
          trigger="mouseenter"
        >
          <ul slot="trigger" class="relative flex items-center space-x-2">
            {#each achievements as achievementCount, idx (idx)}
              {#if achievementCount > 0}
                <li class="relative w-5.5">
                  <span
                    class="text-xs font-semibold leading-none"
                    style={getPlacementColors(idx + 1).medal}
                  >
                    <IconMedal />
                    <span
                      class="absolute top-0 left-0 inline-flex items-center justify-center w-full h-5.5 {getPlacementColors(
                        idx + 1
                      ).text}"
                    >
                      <span class="flex items-end">
                        <span class="text-[8px] opacity-65">x</span>
                        <span>{achievementCount}</span>
                      </span>
                    </span>
                  </span>
                </li>
              {/if}
            {/each}
          </ul>

          <div slot="content" class="">
            <Scrollable
              height="max-h-64"
              onScroll={(event) => (isScrolling = event.target.scrollTop > 0)}
            >
              <ul class="flex flex-col p-3 space-y-2 group">
                {#each coachAchievements || [] as achievement, idx}
                  <li
                    class="overflow-hidden"
                    in:fly|local={{ duration: 300, y: -40, delay: 50 * idx, easing: cubicInOut }}
                  >
                    <Achievement {achievement} />
                  </li>
                {/each}
              </ul>
            </Scrollable>
            {#if coachAchievements.length > 3 && !isScrolling}
              <div
                transition:fade|local
                class="absolute inset-x-0 bottom-0 pointer-events-none h-18 bg-gradient-to-t from-neutrals-d10 to-transparent"
              />
            {/if}
          </div>
        </Dropdown>
      </div>
    {/if}
  </div>

  {#if lowestPrice !== Infinity}
    <div
      class="absolute top-0 right-0 inline-flex items-center h-8 px-2 m-3 rounded-lg pointer-events-auto md:h-10 md:px-3 -z-1 bg-neutrals-d80 text-neutrals-l40"
    >
      {#if lowestPrice > 0}
        <span class="hidden md:inline lg:hidden xl:inline mr-1.5">Starting at</span><span
          class="text-sm font-medium text-white md:text-base">${lowestPrice}</span
        ><span class="md:hidden lg:inline xl:hidden ml-1.5">+</span>
      {:else}
        <span class="text-sm md:text-base">Free</span>
      {/if}
    </div>
  {/if}

  <div
    class="p-4 md:px-6 md:pb-5 xl:px-8 xl:pb-6 pt-16 md:pt-[74px] xl:pt-[82px] space-y-3 md:space-y-4 pointer-events-auto"
  >
    <h3 class="text-xl font-medium leading-none text-white md:text-1.5xl">{coach.name}</h3>

    {#if coach.summary}
      <p class="text-sm md:text-base text-neutrals-l30 line-clamp-3">
        {coach.summary}
      </p>
    {/if}

    {#if showGames && !!coachGames.length}
      <div>
        <ul class="flex flex-wrap -mb-3 -mr-3">
          {#each coachGames as { game } (game.id)}
            <li class="mb-3">
              <GameTag {game} link={false} title={shortGameTitle(game)} />
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</a>

<style>
  .group:hover {
    box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.25);
  }
</style>
