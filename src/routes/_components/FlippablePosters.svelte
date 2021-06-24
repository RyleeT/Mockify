<script>
	import GamePoster from '@metafy/components/GamePoster.svelte';

	export let games = [];
</script>

<div
	class="flippable-posters flex justify-center xl:justify-start relative space-x-3 md:space-x-6 xl:space-x-8 -mt-24 md:-mt-40 xl:mt-0"
>
	<!-- Hidden >= xl -->
	<div class="poster left xl:hidden relative my-auto">
		<GamePoster
			class="front"
			game={games[1]}
			size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
			square={false}
			rounded="rounded-2xl"
		/>
		<GamePoster
			class="back absolute top-0"
			game={games[0]}
			size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
			square={false}
			rounded="rounded-2xl"
		/>
	</div>

	<!-- Shown always -->
	<div class="flex flex-col space-y-3 md:space-y-6 xl:space-y-8 xl:-mt-20">
		<div class="poster center-top">
			<GamePoster
				class="front"
				game={games[3]}
				size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
				square={false}
				rounded="rounded-2xl"
			/>
			<GamePoster
				class="back absolute top-0"
				game={games[2]}
				size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
				square={false}
				rounded="rounded-2xl"
			/>
		</div>
		<div class="poster center-bottom">
			<GamePoster
				class="front"
				game={games[5]}
				size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
				square={false}
				rounded="rounded-2xl"
			/>
			<GamePoster
				class="back absolute top-0"
				game={games[4]}
				size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
				square={false}
				rounded="rounded-2xl"
			/>
		</div>
	</div>
	<div class="poster right my-auto">
		<GamePoster
			class="front"
			game={games[7]}
			size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
			square={false}
			rounded="rounded-2xl"
		/>
		<GamePoster
			class="back absolute top-0"
			game={games[6]}
			size="w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px]"
			square={false}
			rounded="rounded-2xl"
		/>
	</div>
</div>

<style>
	.flippable-posters {
		height: 100%;

		& .poster {
			/* @apply w-[76px] h-[106px] md:w-[136px] md:h-[189px] xl:w-[200px] xl:h-[280px] flex-shrink-0; */
			perspective: 1000px;

			& :global(img) {
				backface-visibility: hidden;
				animation-duration: 10s;
				animation-iteration-count: infinite;
			}
			& :global(.front img) {
				animation-name: flipHide;
			}
			& :global(.back img) {
				animation-name: flipReveal;
			}

			&.center-top {
				top: -72px;
				left: 0;
			}
			&.center-bottom {
				bottom: -68px;
				left: 0;
			}
			&.right {
				top: 87px;
				right: 0;
			}
		}
	}

	@keyframes flipHide {
		0% {
			transform: rotateY(0deg);
		}
		40% {
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(180deg);
		}
		90% {
			transform: rotateY(180deg);
		}
		100% {
			transform: rotateY(0deg);
		}
	}

	@keyframes flipReveal {
		0% {
			transform: rotateY(180deg);
		}
		40% {
			transform: rotateY(180deg);
		}
		50% {
			transform: rotateY(0deg);
		}
		90% {
			transform: rotateY(0deg);
		}
		100% {
			transform: rotateY(180deg);
		}
	}
</style>
