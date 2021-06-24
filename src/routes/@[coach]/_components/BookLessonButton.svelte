<script>
  import Button from '@metafy/components/Button.svelte';
  import BookLesson from '@metafy/assets/svgs/book_lesson.svg';

  export let coachProfile;
  let className = '';
  export { className as class };
  export let text = 'Book a Lesson';
  export let icon = true;
  export let size = 'h-12';
  export let padding = 'px-5';
  export let textSize = 'text-sm';
  export let uppercase = 'uppercase';
  export let fontWeight = 'font-semibold';
  export let letterSpacing = 'tracking-0.08';
  export let hasShine = true;
</script>

{#if !coachProfile.coachAvailability.afkMode}
  <Button
    kind="primary"
    href="/@{coachProfile.slug}/schedule"
    on:click
    class="book-lesson overflow-hidden relative self-start whitespace-nowrap {letterSpacing} {uppercase} {className}"
    {size}
    {fontWeight}
    {textSize}
    {padding}
  >
    {#if hasShine}
      <div class="shineContainer">
        <div class="shine flex flex-auto">
          <div class="shineInner" />
        </div>
      </div>
    {/if}
    <div class="relative z-10 flex justify-center items-center">
      {#if icon}
        <BookLesson class="mr-3" />
      {/if}
      {text}

      <slot />
    </div>
  </Button>
{:else}
  <div class="afk text-sm text-functional-l40 self-start rounded-lg py-4 px-8">
    Currently Unavailable
  </div>
{/if}

<style>
  .afk {
    background: repeating-linear-gradient(
      -63deg,
      rgb(128, 140, 166, 0.2),
      rgb(128, 140, 166, 0.2) 1px,
      transparent 1px,
      transparent 6px
    );
  }

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
