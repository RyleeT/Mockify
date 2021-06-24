<script>
  import Button from '@metafy/components/Button.svelte';
  import DiscordTransparent from '@metafy/assets/svgs/discord_transparent.svg';

  export let margin = 'ml-auto';
</script>

<Button
  kind="default"
  href="https://discord.mfy.gg"
  target="_blank"
  class="button-join-discord self-start bg-brands-discord bg-opacity-5 text-brands-discord {margin} lg:ml-0"
  textSize="text-xs xl:text-base whitespace-nowrap"
  fontWeight="font-normal"
  padding="px-3 md:pl-5 md:pr-6 py-3"
>
  <DiscordTransparent class="h-4 mr-4 w-5.5" />
  Join our Discord
</Button>
