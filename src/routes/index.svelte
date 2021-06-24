<!-- <script context="module">
	import { client, query } from '@metafy/lib/apollo';
	import { HOME_PAGE } from '@metafy/graphql/queries';

	export async function preload() {
		const { data } = await client.query({ query: HOME_PAGE });
		return { cache: data };
	}
</script> -->
<script>
  import { fly } from 'svelte/transition';
  // import { countUp } from '@metafy/lib/transitions';
  // import { coachTestimonials } from './_helpers/data';
  import { BREAKPOINTS, STATIC_URL } from '@metafy/lib/constants';

  import MetaTags from '@metafy/components/MetaTags.svelte';
  // import { Slider, Slide } from '@metafy/components/Slider.svelte';
  import Button from '@metafy/components/Button.svelte';
  // import Image from '@metafy/components/Image.svelte';
  // import GamePoster from '@metafy/components/GamePoster.svelte';
  // import Footer from '@metafy/components/Footer/Footer.svelte';
  // import JoinDiscordButton from '@metafy/components/JoinDiscordButton.svelte';
  import { open as openBrowseGames } from '@metafy/components/BrowseGamesModal.svelte';
  import OnIntersect from '@metafy/components/OnIntersect.svelte';
  // import Announcement from './_components/Announcement.svelte';
  import FeaturedCoach from './_components/FeaturedCoach.svelte';
  import FeaturedGame from './_components/FeaturedGame.svelte';
  // import MoreGamesButton from './_components/MoreGamesButton.svelte';
  import Session from './_components/Session.svelte';
  // import RecentBooking from './_components/RecentBooking.svelte';
  // import FlippablePosters from './_components/FlippablePosters.svelte';
  // import TwitterTestimonial from './_components/TwitterTestimonial.svelte';
  import { topGames } from '@metafy/lib/mock/topGames';

  // import IconCoaches from '@metafy/assets/svgs/home/coaches.svg';
  // import IconGames from '@metafy/assets/svgs/home/games.svg';

  // export let cache = {};
  // const response = query({ query: HOME_PAGE, data: cache });

  let innerWidth;
  let gameBadgeCount;

  $: isDesktop = innerWidth >= BREAKPOINTS.xl;
  // // $: games = ($response.data?.games?.edges || []).map((e) => e.node);
  // $: {
  // 	// 15 badges on mobile.
  // 	gameBadgeCount = 15;
  // 	if (innerWidth >= BREAKPOINTS.md) {
  // 		// 20 badges on tablet.
  // 		gameBadgeCount = 20;
  // 	}
  // }
</script>

<svelte:window bind:innerWidth />

<MetaTags
  pageTitle="Play and Learn from the Best Pro Gamers in the World"
  description="Learn from the world's best players"
/>

<main>
  <!-- Hero -->
  <section class="hero relative pt-12">
    <div class="container flex">
      <div class="hero-left xl:w-1/2 flex flex-col relative xl:static xl:-mt-4">
        <!-- Announcement -->
        <!-- {#if $response.data.announcement}
						<Announcement
							text={$response.data.announcement.content}
							url={$response.data.announcement.link}
						/>
					{/if} -->

        <h1
          class="text-3xl md:text-3.5xl text-neutrals-l00 font-medium leading-tight md:leading-tight mb-3 md:mb-4 xl:mb-5"
        >
          <span class="font-normal">Get coached by the</span><br />
          Players kicking your ass*
        </h1>
        <h2 class="w-full md:w-4/5 text-base md:text-xl xl:text-1.5xl mb-8 md:mb-10">
          <span class="italic">Metafy</span>
          grants you private 1-on-1 access to champion-level coaches at rates starting out at just $15/
          hour.
        </h2>
        <Button
          kind="primary"
          class="start-winning-more self-start uppercase leading-none tracking-0.08 whitespace-nowrap"
          on:click={openBrowseGames}
          fontWeight="font-semibold"
          textSize="text-sm md:text-base"
          padding="pt-1">Start winning more</Button
        >

        <!-- Static Content -->
        <p
          class="w-11/12 md:w-full xl:w-2/3 text-center md:text-left text-sm md:text-base leading-normal text-neutrals-l30 mt-4 md:mt-5 mx-auto md:mx-0"
        >
          *We’re talking...
          <FeaturedCoach
            slug="mew2king"
            name="Mew2King"
            image="{STATIC_URL}/home/mew2king.jpg"
            startingPrice="80"
            bio="Widely considered best overall Smash Bros. player. World Record holder for most tournaments won in eSports. Forbes 30-under-30. Melee God."
          />,
          <FeaturedCoach
            slug="insaynehayne"
            name="InsayneHayne"
            image="{STATIC_URL}/home/insaynehayne.jpg"
            startingPrice="84"
            bio="2012 Rookie of the Year, Inaugural MPL player, 3 PT t8s, PT Avacyn Champion and 5-time GP Champion"
          />,
          <FeaturedCoach
            slug="countlive"
            name="GM Cristian Chirilă"
            image="{STATIC_URL}/home/countlive.jpg"
            startingPrice="110"
            bio="Head Coach at the University of Missouri & Former Coach of World's #2 player Fabiano Caruana. Let's take your game to the next level!"
          />, and more.
        </p>
      </div>

      <div
        class="absolute-video-container absolute w-full h-full xl:w-auto xl:h-auto left-0 top-0 xl:top-auto"
      >
        <video
          class="object-cover flex-shrink-0"
          src="https://static.metafy.gg/home/hero_video.mp4"
          loop
          autoplay
          playsinline
          muted
        />
        <!-- Gray overlay -->
        <div class="overlay absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-65" />
        <div class="gradient-overlay absolute z-10 top-0 left-0 w-full h-full xl:hidden" />
      </div>
    </div>
  </section>

  <!-- Featured games -->
  <OnIntersect>
    <section class="pt-52 md:pt-36 xl:pt-36" in:fly|local={{ y: 50, duration: 600 }}>
      <div class="container">
        <div class="md:text-center mb-6 md:mb-10 xl:mb-16">
          <h2
            class="font-medium text-1.5xl md:text-3.25xl xl:text-3.5xl text-neutrals-l00 leading-relaxed xl:leading-none -tracking-0.01 mb-2 md:mb-3 xl:mb-6"
          >
            Pick your
            <span class="text-functional-b10">poison</span>
          </h2>
          <p class="text-sm md:text-xl text-neutrals-l40 leading-none tracking-0.01">
            <!-- (Choose from
						{$response.data?.homeStats?.games}+ games and counting…) -->
          </p>
        </div>
      </div>
      <div class="grid xl:container">
        <div
          class="grid gap-x-6 xl:gap-x-8 gap-y-16 grid-flow-col xl:grid-flow-row xl:grid-cols-3 xl:gris-rows-2 overflow-x-auto pl-4 md:pl-10 xl:pl-0"
        >
          {#each topGames.slice(0, 5) as game, idx}
            <FeaturedGame {game} small={isDesktop && idx > 2} />
          {/each}
          <!-- <div class="hidden xl:block">
            <MoreGamesButton on:click={openBrowseGames} />
          </div> -->
        </div>
      </div>
      <!-- <div class="container xl:hidden mt-5 md:mt-8">
				<MoreGamesButton on:click={openBrowseGames} />
			</div> -->
    </section>
  </OnIntersect>

  <!-- Flexible learning -->
  <OnIntersect>
    <section
      class="flexible-learning container pt-16 md:pt-28 xl:pt-44 pb-32"
      in:fly|local={{ y: 50, duration: 600 }}
    >
      <div class="flex flex-col-reverse xl:flex-row">
        <Session />
        <div class="xl:w-1/2 md:text-center xl:text-left">
          <h1
            class="font-medium text-neutrals-l00 text-1.5xl md:text-3.25xl xl:text-3.5xl leading-normal md:leading-relaxed xl:leading-relaxed -tracking-0.01 mb-3 md:mb-4"
          >
            Book your first session<br />
            <span class="text-functional-b10">(in less than 3-minutes)</span>
          </h1>
          <p
            class="text-sm md:text-xl text-neutrals-l40 leading-normal md:leading-normal mb-6 md:mb-14 xl:mb-10"
          >
            With Metafy you book your sessions, instantly, and chat<br class="hidden md:block" />
            with coaches in real time
            <span class="italic">(without breaking the bank).</span>
          </p>

          <div
            class="flex flex-col md:flex-row xl:flex-col space-y-1 md:space-y-0 xl:space-y-2 mb-12 md:mb-20 xl:mb-0"
          >
            <div class="flex md:flex-col xl:flex-row items-center">
              <div
                class="step flex bg-functional-r20 rounded-full flex-shrink-0"
                style="animation-delay: 0.5s;"
              >
                <p
                  class="font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto"
                >
                  1
                </p>
              </div>
              <p
                class="text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8"
              >
                Choose your game.
              </p>
            </div>
            <div class="step-separator" />
            <div class="flex md:flex-col xl:flex-row items-center">
              <div
                class="step flex bg-functional-r20 rounded-full flex-shrink-0"
                style="animation-delay: 1s;"
              >
                <p
                  class="font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto"
                >
                  2
                </p>
              </div>
              <p
                class="text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8"
              >
                Choose your Coach.
              </p>
            </div>
            <div class="step-separator" />
            <div class="flex md:flex-col xl:flex-row items-center">
              <div
                class="step flex bg-functional-r20 rounded-full flex-shrink-0"
                style="animation-delay: 1.5s;"
              >
                <p
                  class="font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto"
                >
                  3
                </p>
              </div>
              <p
                class="text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8"
              >
                Choose a time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex xl:w-1/2 xl:ml-auto mt-10 md:mt-16">
        <Button
          kind="primary"
          class="book-here self-start uppercase leading-none tracking-0.08 whitespace-nowrap mx-auto xl:mx-0"
          on:click={() => console.log('openBrowseGames')}
          fontWeight="font-semibold"
          textSize="text-sm md:text-base"
          padding="pt-1">Book, here.</Button
        >
      </div>
    </section>
  </OnIntersect>

  <!-- Recent bookings -->
  <OnIntersect>
    <section
      class="recent-bookings relative pt-8 md:pt-14 xl:pt-24"
      in:fly|local={{ y: 50, duration: 600 }}
    >
      <div class="background absolute top-0 left-0 w-full bg-neutrals-d10" />
      <div class="container flex flex-col relative z-10">
        <div class="md:text-center mb-10 md:mb-14 xl:mb-16">
          <h1
            class="font-medium text-1.5xl md:text-3.25xl xl:text-3.5xl text-neutrals-l00 -tracking-0.01 leading-tight mb-4"
          >
            While you’ve been reading,<br />
            <span class="font-medium">your competition has been busy</span>
          </h1>
          <p
            class="md:w-3/4 xl:w-1/2 text-sm md:text-xl text-neutrals-l40 leading-normal tracking-0.01 md:mx-auto"
          >
            Here are the coaches your rivals have been training under while you’ve been scrolling
            this page.
          </p>
        </div>

        <!-- {#if $response.data.recentBookings.length > 1}
					<Slider
						loop
						navigation
						grabCursor
						slidesPerView={1}
						breakpoints={{
							[BREAKPOINTS.md]: { slidesPerView: 2 },
							[BREAKPOINTS.xl]: { slidesPerView: 3 },
							1367: { slidesPerView: 4 }
						}}
					>
						{#each $response.data.recentBookings as booking (booking.id)}
							<Slide>
								<RecentBooking {booking} />
							</Slide>
						{/each}
					</Slider>
				{:else}
					{#each $response.data.recentBookings as booking (booking.id)}
						<RecentBooking {booking} />
					{/each}
				{/if} -->

        <div class="flex flex-col mx-auto mt-8 xl:mt-14">
          <Button
            kind="primary"
            class="find-a-coach self-start uppercase leading-none tracking-0.08 whitespace-nowrap mx-auto"
            on:click={() => console.log('openBrowseGames')}
            fontWeight="font-semibold"
            textSize="text-sm md:text-base"
            padding="pt-1">Find a Coach</Button
          >
          <p
            class="w-2/3 md:w-full text-center text-neutrals-l40 italic mt-4 md:mt-5 mx-auto md:mx-0"
          >
            <!-- Did we mention we have {$response.data?.homeStats?.coaches}+ coaches to choose from? -->
          </p>
        </div>
      </div>
    </section>
  </OnIntersect>
</main>

<!-- <Footer /> -->
<style>
  .hero {
    @screen xl {
      padding-top: 112px;
    }

    & .hero-left {
      z-index: 25;
    }

    & h1 {
      @screen xl {
        font-size: 50px;
        line-height: 130%;
      }
    }
    & h2 {
      line-height: 160%;
    }
    & :global(.start-winning-more) {
      width: 100%;
      height: 56px;
      @screen md {
        width: 282px;
        height: 64px;
      }
    }

    & .absolute-video-container {
      @apply xl:right-0;
      @screen xl {
        left: 53%;
      }
      @media (min-width: 2000px) {
        width: 910px;
        right: auto;
      }
    }

    & video {
      width: 100%;
      @media (min-width: 2000px) {
        max-width: 910px;
      }
    }
    & video,
    & .overlay {
      @screen xl {
        border-radius: 20px 0 0 20px;
      }
      @media (min-width: 2000px) {
        border-radius: 20px;
      }
    }
    & .gradient-overlay {
      background: linear-gradient(90deg, #000000 14.06%, rgba(0, 0, 0, 0) 70.05%);
    }

    & video,
    & .overlay,
    & .gradient-overlay {
      height: 480px;
      @screen xl {
        height: 420px;
      }
    }

    & .hero-testimonial {
      @screen xl {
        width: 384px;
        top: 438px;
        left: 57%;
      }
    }
  }

  .flexible-learning {
    & .step {
      width: 32px;
      height: 32px;
      animation: bounceIn 5s infinite;
      @screen md {
        width: 40px;
        height: 40px;
      }
    }
    & .step-separator {
      @apply w-full border-l border-neutrals-l40 ml-4;
      @apply md:border-l-0 md:border-t md:mx-5 md:mt-5;
      @apply xl:border-l xl:border-t-0 xl:ml-5 xl:mr-0 xl:mt-2;
      height: 20px;
      @screen md {
        height: 1px;
      }
      @screen xl {
        height: 32px;
      }
    }
    & :global(.book-here) {
      width: 250px;
      height: 56px;
      @screen md {
        height: 64px;
      }
    }
  }

  @keyframes bounceIn {
    from,
    30%,
    40%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      transform: scale3d(1, 1, 1);
    }
    10% {
      transform: scale3d(1.2, 1.2, 1.2);
    }
    15% {
      transform: scale3d(1, 1, 1);
    }
    to {
      transform: scale3d(1, 1, 1);
    }
  }

  .recent-bookings {
    & .background {
      height: 414px;
    }
    & :global(.find-a-coach) {
      width: 250px;
      height: 56px;
      @screen md {
        height: 64px;
      }
    }
  }

  .stat .icon-box {
    width: 85px;
    height: 85px;
    @screen xl {
      width: 120px;
      height: 120px;
    }

    & :global(svg) {
      width: 34px;
      height: 30px;
      @screen xl {
        width: 50px;
        height: 45px;
      }
    }
  }

  .social {
    background-image: url('https://static.metafy.gg/home/social_bg.png');
    background-repeat: no-repeat;
    background-size: 610px;
    background-position-x: 255px;
    background-position-y: 0px;
    @screen md {
      background-size: 400px;
      background-position-x: right;
    }
    @screen xl {
      background-size: 520px;
    }
  }

  .coaching-everything {
    height: 600px;
    @screen md {
      height: 985px;
    }

    & video {
      filter: grayscale(1);
      opacity: 0.4;
    }
    & .overlay-gradient-top {
      @apply absolute top-0 left-0 w-full pointer-events-none;
      height: 364px;
      z-index: 1;
      background: linear-gradient(180deg, rgba(3, 4, 4, 0) 0%, #030404 85.03%);
      transform: rotate(-180deg);
    }
    & .overlay-gradient-bottom {
      @apply absolute bottom-0 left-0 w-full pointer-events-none;
      height: 364px;
      z-index: 1;
      background: linear-gradient(180deg, rgba(3, 4, 4, 0) 0%, #030404 89.97%);
    }

    & h2 {
      line-height: 130%;
    }

    & .coaching-card {
      @screen xl {
        height: 460px;
      }
    }
  }

  .game-badges {
    & .game-badges-wrap {
      width: 180%;
      margin-left: -50%;
      @screen xl {
        width: auto;
        margin-left: 0;
      }
    }

    & .overlay-gradient-top {
      background: linear-gradient(
        180deg,
        rgba(3, 4, 4, 0) 21.04%,
        rgba(3, 4, 4, 0.50092) 60.59%,
        #030404 100%
      );
      transform: rotate(-180deg);
      height: 240px;
    }
    & .overlay-gradient-bottom {
      background: linear-gradient(
        180deg,
        rgba(3, 4, 4, 0) 21.04%,
        rgba(3, 4, 4, 0.50092) 60.59%,
        #030404 100%
      );
      height: 240px;
    }
    & :global(.browse-all-games) {
      width: 250px;
      height: 56px;
      @screen md {
        height: 64px;
      }
    }
  }

  .coach-testimonials {
    & :global(.wanna-coach) {
      @apply bg-transparent text-functional-r50 border border-functional-r50;
      width: 250px;
      height: 56px;
      @screen md {
        height: 64px;
      }
    }

    & .testimonials {
      height: 720px;
      @screen md {
        height: 500px;
      }
    }

    & .coach-tweets {
      height: 400px;
      @screen md {
        height: 100%;
      }

      & :global(.swiper-container) {
        width: 100%;
      }
    }
  }
  /* Unused for now */
  /* 
  .student-testimonials {
    & .background {
      filter: grayscale(1);
    }
  } */
</style>
