<script>
  import { tooltip } from '@metafy/lib/directives/tooltip';

  import IconCopy from '@metafy/assets/svgs/sessions/copy.svg';
  import IconDiscord from '@metafy/assets/svgs/discord_transparent.svg';

  export let other = {};
  export let backgroundColor = 'bg-neutrals-d10';
  export let isLarge;
  let className = '';
  export { className as class };
</script>

{#if other.discord}
  <div
    class="group {className}"
    use:tooltip={{ content: 'Copied!', placement: 'top', trigger: 'click' }}
  >
    <div
      class="flex items-center pl-3 pr-4 rounded-lg cursor-pointer {backgroundColor} {isLarge
        ? 'h-14'
        : 'h-10'}"
      use:tooltip={{ content: 'Click to copy', disableMobile: true, placement: 'top' }}
      on:click={() => {
        navigator.clipboard.writeText(`${other.discord.username}#${other.discord.discriminator}`);
      }}
    >
      <IconDiscord class={isLarge ? 'w-6 mr-4' : 'w-4.5 mr-3'} />
      <div
        class="inline-flex flex-1 min-w-0 pr-3 font-medium leading-none text-neutrals-l40"
        class:text-sm={!isLarge}
      >
        <span class="text-white">{other.discord.username}</span>
        <span>#{other.discord.discriminator}</span>
      </div>
      <div class="inline-flex items-center">
        <button class="transition-colors text-neutrals-l40 group-hover:text-white">
          <IconCopy class={isLarge ? 'w-4' : 'w-3.5'} />
        </button>
      </div>
    </div>
  </div>
{:else}
  <h3 class="text-sm text-neutrals-l00 leading-normal">
    This person hasn't provided their Discord contact details yet.
  </h3>
{/if}
