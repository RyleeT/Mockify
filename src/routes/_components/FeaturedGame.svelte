<script>
  import Image from '@metafy/components/Image.svelte';

  export let game = {};
  export let small = false;
</script>

<a
  href="/{game.slug}"
  class="featured-game flex text-left bg-neutrals-d10 rounded-3xl overflow-hidden focus:outline-none"
  class:small
>
  <div class="flex relative w-full h-full bg-neutrals-d10 rounded-3xl">
    <!-- Background artwork -->
    <Image
      class="artwork absolute top-0 left-0 w-full h-full opacity-15 object-cover object-center"
      size="w-[440px] xl:w-[469px] h-full"
      rounded="rounded-3xl"
      src={game.artwork}
      alt={game.title.en}
    />

    <div class="gradient-overlay relative z-10 flex w-full rounded-3xl">
      <Image
        class="{!small ? 'hidden' : ''} object-cover rounded-2xl mr-5"
        size="w-[140px] h-[140px]"
        fit="crop"
        src={game.poster}
        alt={game.title.en}
      />

      <div class="flex flex-col rounded-3xl {small ? 'p-0' : 'pt-4 px-4 xl:pt-8 xl:px-6'}">
        <p
          class="category xl:text-xs font-medium text-functional-b10 uppercase leading-none tracking-0.12 mb-2 xl:mb-4"
        >
          {game.category}
        </p>
        <h3
          class="title text-xl xl:text-1.5xl font-medium text-neutrals-l00 leading-normal mb-4 xl:mb-6"
        >
          {game.title.en}
        </h3>
        <div class="badges flex">
          <div
            class="badge text-xs xl:text-base text-neutrals-l00 text-opacity-90 bg-neutrals-d10 -tracking-0.01 leading-none border border-neutrals-l40 border-opacity-25 rounded-md p-2 xl:p-3 mr-2 xl:mr-3"
          >
            <span class="font-medium">{game.featuredCoachCount}</span>
            Coach{game.featuredCoachCount > 1 || game.featuredCoachCount === 0 ? 'es' : ''}
          </div>
        </div>
      </div>
    </div>

    <div
      class="red-gradient-overlay absolute top-0 left-0 w-full h-full rounded-3xl opacity-0 transition-opacity ease-linear duration-200"
    />

    <!-- Logotype -->
    <Image
      class="logotype absolute z-20 object-contain object-center"
      src={game.logotype}
      alt={game.title.en}
      size="w-[70px] h-6.5 left-4 bottom-4 xl:w-[108px] xl:h-[39px] left-6 bottom-11.5"
    />
    <!-- Gradient overlay -->
    <div class="bottom-gradient-overlay xl:hidden absolute w-full bottom-0 left-0 rounded-t-3xl" />
    <!-- Cutout -->
    <Image
      class="cutout absolute z-10 bottom-0 xl:right-0 object-contain object-center xl:object-bottom rounded-br-3xl"
      size="w-full h-[166px] xl:w-[246px] xl:h-[200px]"
      src={game.cutout}
      alt={game.title.en}
    />
  </div>
</a>

<style>
  .featured-game {
    width: 230px;
    height: 322px;
    padding: 1px;
    @apply bg-center bg-cover transition-colors ease-in-out duration-200;

    @screen xl {
      width: 100%;
      height: 480px;
    }

    &.small {
      width: 100%;
      height: 172px;

      & .category {
        @apply mt-2 mb-2;
      }
      & .title {
        @apply text-xl mb-5;
      }
      & .badges {
        @apply mt-auto;
      }
      & .badge {
        @apply text-xs py-2;
      }

      & .gradient-overlay {
        @apply px-4 my-auto;
      }
      & .red-gradient-overlay {
        z-index: 11;
      }

      & :global(.artwork),
      & :global(.logotype),
      & :global(.cutout) {
        @apply hidden;
      }
    }

    &:hover {
      background: linear-gradient(
        46.33deg,
        rgba(190, 52, 52, 0) 3.72%,
        #be3434 51.18%,
        rgba(190, 52, 52, 0) 98.74%
      );

      & .red-gradient-overlay {
        opacity: 1;
      }
    }
  }
  .category {
    font-size: 10px;
  }
  a :global(.artwork) {
    filter: grayscale(1);
  }
  .gradient-overlay {
    background: linear-gradient(180deg, #181a1e 0%, rgba(24, 26, 30, 0) 103.16%);
  }
  .red-gradient-overlay {
    z-index: 9;
    background: linear-gradient(
      269.94deg,
      rgba(48, 82, 107, 0.16) -8.83%,
      rgba(190, 51, 51, 0.0512) 46.3%,
      rgba(40, 63, 84, 0.16) 106.38%
    );
  }
  .bottom-gradient-overlay {
    z-index: 11;
    height: 92px;
    background: linear-gradient(180deg, #030404 0%, rgba(24, 26, 30, 0) 100%);
    transform: rotate(-180deg);
  }
</style>
