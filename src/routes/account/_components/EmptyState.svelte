<script>
  import Button from '@metafy/components/Button.svelte';
  import Image from '@metafy/components/Image.svelte';

  export let vertical = false;
  // Note: `large` mode only tested in combination with `vertical`.
  export let large = false;

  export let title = '';
  export let subtitle = '';
  export let illustration = null;
  let className = '';
  export { className as class };
  export let illustrationSize = 'w-[250px] md:w-[300px]';
  export let illustrationClass = '';
  export let hasButton = true;
  export let buttonText = '';
  export let disabled = false;
  export let minHeight = `min-h-[320px] ${!vertical ? 'md:min-h-[240px]' : ''}`;
</script>

<article
  class="relative overflow-hidden bg-neutrals-d10 rounded-2xl"
  class:vertical
  class:large
  class:hasButton
>
  <div class="content relative flex flex-col justify-end p-5 {className} {minHeight}">
    {#if illustration}
      <img
        class="trail pointer-events-none absolute right-0 w-full h-full opacity-5"
        src={illustration}
        alt={title}
      />
      <Image
        class="illustration absolute z-1 pointer-events-none {illustrationClass}"
        size={illustrationSize}
        src={illustration}
        alt={title}
      />
    {/if}

    <h1 class="text-sm text-white leading-normal mb-3">{title}</h1>
    <p class="w-full text-xs text-neutrals-l40 leading-normal {hasButton ? 'mb-4' : ''}">
      {subtitle}
    </p>

    <slot>
      {#if hasButton}
        <Button
          kind="gradient"
          {disabled}
          class="self-start"
          textSize="text-xs"
          size="h-10"
          padding="px-4"
          on:click
        >
          {buttonText}
        </Button>
      {/if}
    </slot>
  </div>

  <slot name="bottom" />
</article>

<style>
  article {
    & :global(.illustration) {
      top: -10%;
    }
  }
  .trail {
    transform: scale(2.5) translateX(12%) translateY(-123px);
  }

  article:not(.vertical) {
    & .content {
      @apply md:justify-center md:px-16;
    }
    @screen md {
      & :global(.illustration) {
        top: 50%;
        transform: translateY(-50%);
        @apply right-4;
      }
      & .trail {
        transform: scale(2.5) translateX(19%) translateY(-16px);
      }
      & h1 {
        @apply text-base leading-none;
      }
      & p {
        @apply w-1/3;
      }
      &.hasButton p {
        @apply mb-6;
      }
    }
  }
  article.large {
    max-width: 656px;

    & .content {
      @apply px-5 md:p-10;
    }

    & :global(.illustration) {
      right: 0;
    }
    & .trail {
      transform: scale(1.5) translateX(12%) translateY(-223px);
    }
    & h1 {
      @apply text-xl font-medium mb-5;
      //md:text-1.5xl
    }
    & p {
      @apply md:w-2/3 text-sm md:text-base mb-8;
    }
  }
</style>
