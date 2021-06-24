<script>
  import Button from '@metafy/components/Button.svelte';
  import Arrow from '@metafy/assets/svgs/arrow.svg';

  let className = '';
  export { className as class };
  export let text = 'Know More';
  export let icon = true;
  export let size = 'h-10 sm:h-12';
  export let padding = 'px-6';
  export let textSize = 'text-xs sm:text-sm';
  export let uppercase = 'uppercase';
  export let fontWeight = 'font-semibold';
  export let letterSpacing = 'tracking-0.08';
  export let backgroundColor = 'bg-neutrals-d03';
  export let hasShine = true;
</script>

<Button
  kind="primary"
  href="/"
  on:click
  class="overflow-hidden relative self-start whitespace-nowrap z-2 {letterSpacing} {uppercase} {className}"
  {size}
  {fontWeight}
  {textSize}
  {padding}
  {backgroundColor}
>
  {#if hasShine}
    <div class="shineContainer">
      <div class="shine flex flex-auto">
        <div class="shineInner" />
      </div>
    </div>
  {/if}
  <div class="relative z-10 flex justify-center items-center">
    {text}
    {#if icon}
      <Arrow class="ml-3" />
    {/if}
    <slot />
  </div>
</Button>

<style>
  .shineContainer {
    position: absolute;
    top: -50%;
    bottom: 0;
    right: 0;
    left: -50%;
    animation-delay: 0s;
    animation-duration: 10s;
    animation-name: Shine;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    color: rgba(255, 255, 255, 0.1);
  }

  .shine {
    background-color: currentColor;
    height: 300%;
    position: relative;
    top: -100%;
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg);
    width: 56px;
  }

  .shineInner {
    @apply h-full w-4 bg-current;
  }

  @keyframes Shine {
    0% {
      transform: translate3d(-50%, 0, 0);
    }
    20% {
      transform: translate3d(200%, 0, 0);
    }
    100% {
      transform: translate3d(200%, 0, 0);
    }
  }
</style>
