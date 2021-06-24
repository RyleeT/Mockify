<script>
  import { ordinalSuffix, getAchievementIconURL } from '@metafy/lib/utils';

  export let achievement = {};

  const COLORS = {
    1: '#FAC640',
    2: '#FFFFFF',
    3: '#DA9B74'
  };

  let color = '#DB3A3A';
  $: if (achievement.type === 'tournament') {
    if (achievement.placement in COLORS) {
      color = COLORS[achievement.placement];
    }
  }
  $: iconUrl = getAchievementIconURL(achievement);
</script>

<div class="relative flex items-center px-4 rounded-lg py-3.5 bg-neutrals-d20 text-neutrals-l00">
  <div class="flex flex-col space-y-3">
    <p class="text-sm text-white">
      {achievement.type === 'tournament' ? achievement.tournamentTitle : achievement.achievement}
    </p>
    {#if achievement.type === 'tournament' || achievement.type === 'season'}
      <div class="flex items-center space-x-2">
        {#if achievement.type === 'tournament'}
          <p class="text-xs leading-none uppercase tracking-0.1" style="color: {color}">
            {ordinalSuffix(achievement.placement)}
            <span>place</span>
          </p>
          <span class="w-1 h-1 rounded-full bg-neutrals-l40" />
        {/if}
        <p class="text-xs leading-none uppercase text-neutrals-l40 tracking-0.1">
          {achievement.year}
        </p>
      </div>
    {/if}
  </div>
  {#if iconUrl}
    <div class="relative z-10 flex-shrink-0 block ml-auto">
      <img src={iconUrl} alt="Achievement" width="46" height="54" />
    </div>
  {/if}
</div>
