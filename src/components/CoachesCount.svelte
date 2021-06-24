<script>
  import { fly, fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import { pluralize } from '@metafy/lib/utils';

  import Scrollable from '@metafy/components/Scrollable.svelte';
  import Dropdown from '@metafy/components/Dropdown.svelte';
  import Avatar from '@metafy/components/Avatar.svelte';

  export let coaches = [];
  export let withAvatars;
  let className = '';
  export { className as class };

  let isVisible;
  let isScrolling;

  function lowestPrice(coach) {
    let lowestPrice = Infinity;
    for (const coachGame of coach.coachGames) {
      for (const lesson of coachGame.lessons) {
        lowestPrice = Math.min(lowestPrice, lesson.baseRateCents / 100);
      }
    }
    return lowestPrice;
  }
</script>

<Dropdown
  placement="right-start"
  containerClass={className}
  contentClass="bg-neutrals-d10 rounded-3xl shadow-lg overflow-hidden"
  {isVisible}
  offset={[-10, -30]}
  minWidth={300}
  trigger="mouseenter"
>
  <div slot="trigger">
    {#if withAvatars}
      <button
        class="relative z-10 inline-flex items-center h-8 pl-px pr-4 text-xs font-medium leading-none rounded-lg bg-neutrals-d80 text-neutrals-l40"
      >
        <ul class="flex mr-2 -space-x-3">
          {#each coaches.slice(0, 2) as user}
            <li>
              <Avatar
                {user}
                size="w-7.5 h-7.5"
                border="border-3 border-neutrals-d80"
                rounded="rounded-md"
              />
            </li>
          {/each}
        </ul>

        <span>
          {#if coaches.length >= 4}
            +4 experts
          {:else}
            {pluralize('expert', coaches.length)}
          {/if}
        </span>
      </button>
    {:else}
      <button
        class="relative z-10 inline-flex items-center h-8 px-3 text-sm font-medium leading-none rounded-lg bg-neutrals-d80 text-neutrals-l40"
      >
        {pluralize('expert', coaches.length)}
      </button>
    {/if}
  </div>

  <div slot="content" class="">
    <Scrollable height="max-h-64" onScroll={(event) => (isScrolling = event.target.scrollTop > 0)}>
      <ul class="group flex flex-col p-3 space-y-2">
        {#each coaches as coach, idx}
          <li class="overflow-hidden transition-opacity group-hover:opacity-65 hover:!opacity-100">
            <a
              in:fly|local={{ duration: 300, y: -40, delay: 50 * idx, easing: cubicInOut }}
              href="/@{coach.slug}"
              class="flex items-center p-2 space-x-3 rounded-lg bg-neutrals-d80"
            >
              <Avatar user={coach.account} size="w-12 h-12" rounded="rounded-lg" />
              <div class="flex flex-col space-y-1.5">
                <span class="text-sm text-white">{coach.name}</span>
                <span class="text-xs leading-none text-neutrals-l40">
                  <span>Starting at</span>
                  <span class="text-white"
                    >{lowestPrice(coach) > 0 ? `$${lowestPrice(coach)}` : 'Free'}</span
                  >
                </span>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </Scrollable>
    {#if coaches.length > 3 && !isScrolling}
      <div
        transition:fade
        class="absolute inset-x-0 bottom-0 pointer-events-none h-18 bg-gradient-to-t from-neutrals-d10 to-transparent"
      />
    {/if}
  </div>
</Dropdown>
