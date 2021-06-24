<script>
  import { onMount } from 'svelte';
  import { FOOTER_GAMES } from '@metafy/graphql/queries';
  import { client } from '@metafy/lib/apollo';
  import { BREAKPOINTS } from '@metafy/lib/constants';

  import { open as openBrowseGames } from '@metafy/components/BrowseGamesModal.svelte';
  import JoinDiscordButton from '@metafy/components/JoinDiscordButton.svelte';
  import BottomContent from './BottomContent.svelte';
  // import SocialLinks from './SocialLinks.svelte';

  import MetafySymbol from '@metafy/assets/svgs/metafy_symbol.svg';
  import MetafyLogotype from '@metafy/assets/svgs/metafy_logotype_bold.svg';
  import ArrowExternal from '@metafy/assets/svgs/arrow_external.svg';

  let innerWidth;
  let games = [];
  let className = '';
  export { className as class };

  onMount(async () => {
    if (innerWidth >= BREAKPOINTS.lg) {
      const { data } = await client.query({ query: FOOTER_GAMES });
      games = data?.topGames || [];
    }
  });
</script>

<svelte:window bind:innerWidth />
<div
  class="footer bg-neutrals-d10 backdrop-filter backdrop-blur-1.5xl bg-opacity-80 pt-5 md:pt-8 xl:pt-12 md:pb-5 xl:pb-8 {className}"
>
  <div class="container flex flex-col h-full">
    <div class="flex">
      <a href="/" sveltekit:prefetch>
        <MetafySymbol class="metafy-symbol text-brands-metafy" />
      </a>

      <div class="flex flex-col w-full ml-4 md:ml-3 xl:ml-6">
        <div class="flex mt-2 md:mt-3 xl:mt-5">
          <div class="flex flex-col w-full lg:w-auto">
            <div class="flex lg:flex-col">
              <div>
                <MetafyLogotype class="metafy-logotype" />
                <p
                  class="text-xs md:text-sm xl:text-xl text-neutrals-l40 mt-2 md:mt-3 xl:mt-4 md:mb-3 xl:mb-5"
                >
                  Start Winning More!
                </p>
              </div>
              <JoinDiscordButton />

              <!-- <div class="hidden lg:block mt-5 xl:mt-6">
                <SocialLinks />
              </div> -->
            </div>
          </div>
          <div class="hidden lg:flex w-2/3 justify-around ml-auto">
            <div class="flex flex-col">
              <h2 class="font-medium text-neutrals-l00 text-opacity-97 leading-none mb-6">
                Product
              </h2>
              <div class="flex flex-col space-y-4">
                <button
                  class="text-left text-neutrals-l40 text-opacity-97 leading-none"
                  on:click={openBrowseGames}>Browse games</button
                >
                <a
                  href="/gift-cards"
                  class="text-neutrals-l40 text-opacity-97 leading-none"
                  sveltekit:prefetch>Gift Cards</a
                >
                <a
                  href="https://form.typeform.com/to/Wr6mNRlH"
                  class="text-neutrals-l40 text-opacity-97 leading-none"
                  rel="noopener noreferrer">Become a coach</a
                >
              </div>
            </div>
            <div class="flex flex-col">
              <h2 class="font-medium text-neutrals-l00 opacity-97 leading-none mb-6">Company</h2>
              <div class="flex flex-col space-y-4">
                <!-- <a href="" class="text-neutrals-l40 text-opacity-97 leading-none">About us</a> -->
                <a
                  href="mailto:metafy@boltpr.com"
                  class="text-neutrals-l40 text-opacity-97 leading-none">Press</a
                >
                <div class="flex">
                  <a
                    target="_blank"
                    href="https://metafy.gg/careers"
                    rel="noopener noreferrer"
                    class="text-neutrals-l40 text-opacity-97 leading-none">Careers</a
                  >
                  <ArrowExternal class="arrow-external" />
                </div>
                <a
                  href="mailto:support@metafy.gg"
                  class="text-neutrals-l40 text-opacity-97 leading-none">Support</a
                >
                <div class="flex">
                  <a
                    target="_blank"
                    href="https://medium.com/metafy"
                    rel="noopener noreferrer"
                    class="text-neutrals-l40 text-opacity-97 leading-none">Blog</a
                  >
                  <ArrowExternal class="arrow-external" />
                </div>
              </div>
            </div>
            {#if games.length > 0}
              <div class="flex flex-col">
                <h2 class="font-medium text-neutrals-l00 opacity-97 leading-none mb-6">
                  Popular Games
                </h2>
                <div class="flex flex-col space-y-4">
                  {#each games as game (game.id)}
                    <a
                      href="/{game.slug}"
                      sveltekit:prefetch
                      class="text-neutrals-l40 text-opacity-97 leading-none">{game.title.en}</a
                    >
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="hidden md:block">
          <BottomContent />
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <BottomContent />
    </div>
  </div>
  <div class="footer-graphic" />
</div>

<style>
  .footer {
    min-height: 259px;
    @screen lg {
      min-height: 266px;
    }
    @screen xl {
      min-height: 386px;
    }
    @apply w-full relative;

    & .footer-graphic {
      @apply hidden xl:block absolute right-0 top-0 h-full bg-no-repeat pointer-events-none;
      background-image: url('https://static.metafy.gg/footer/footer_hexagons.svg');
      width: 270px;
    }
    & :global(.metafy-symbol) {
      width: 38px;
      height: 34px;
      @screen md {
        width: 30px;
        height: 27px;
      }
      @screen xl {
        width: 62px;
        height: 56px;
      }
    }
    & :global(.metafy-logotype) {
      width: 57px;
      height: 10px;
      @screen md {
        width: 45px;
        height: 8px;
      }
      @screen xl {
        width: 93px;
        height: 17px;
      }
    }
    & :global(.arrow-external) {
      margin-top: 4px;
      margin-left: 4px;
    }
  }
</style>
