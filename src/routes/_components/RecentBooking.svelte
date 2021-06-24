<script>
	import Button from '@metafy/components/Button.svelte';
	import Avatar from '@metafy/components/Avatar.svelte';
	import Image from '@metafy/components/Image.svelte';

	export let booking = {};

	let lowestPrice = Infinity;
	$: {
		for (const coachGame of booking.coach.coachProfile.coachGames) {
			for (const lesson of coachGame.lessons) {
				lowestPrice = Math.min(lowestPrice, lesson.baseRateCents / 100);
			}
		}
	}
</script>

<a
	class="recent-booking group flex flex-col bg-neutrals-d30 rounded-3xl p-3 pb-5 mx-auto"
	href="/@{booking.coach.coachProfile.slug}"
>
	<div class="booking-content flex relative rounded-t-3xl px-2">
		<Image
			class="artwork absolute top-0 left-0 object-cover object-center rounded-t-3xl"
			size="w-[256px] h-full"
			src={booking.game.artwork}
			alt={booking.game.title.en}
		/>
		<div class="background-gradient absolute w-full h-full top-0 left-0" />
		<Image
			class="logotype absolute top-4 right-4"
			size="h-12"
			src={booking.game.logotype}
			alt={booking.game.title.en}
		/>

		<div class="info flex items-center mt-auto">
			<Avatar
				user={booking.coach}
				name={booking.coach.coachProfile.name}
				rounded="rounded-lg"
				class="mr-5"
				size="w-[72px] h-[72px]"
			/>
			<div>
				<h2 class="font-medium text-xl text-neutrals-l00 -tracking-0.01 mb-2">
					{booking.coach.coachProfile.name}
				</h2>
				{#if lowestPrice !== Infinity}
					<p class="text-base text-neutrals-l40 leading-none">
						Starting at
						<span class="font-medium text-functional-r50"
							>{#if lowestPrice > 0}${lowestPrice}{:else}Free{/if}</span
						>
					</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="px-2">
		<Button
			href="/@{booking.coach.coachProfile.slug}"
			kind="basic"
			class="booking-button w-full group-hover:text-functional-r50 mt-6"
			border="border border-neutrals-l50 border-opacity-15 group-hover:border-functional-r50"
			fontWeight="font-normal"
			padding="py-3">Book a Lesson</Button
		>
	</div>
</a>

<style>
	.recent-booking {
		width: 280px;
	}
	.booking-content {
		width: 256px;
		height: 180px;

		& :global(.artwork) {
			z-index: 1;
			filter: grayscale(1);
		}
		& .background-gradient {
			z-index: 2;
			background: linear-gradient(
				180deg,
				rgba(3, 4, 4, 0.64) 0%,
				rgba(3, 4, 4, 0.9) 53.16%,
				#030404 85.42%
			);
			/* Chrome bug: In this specific situation, having a linear gradient over an image doesn't completely cover the image,
        sometimes leaving 1px lines on the sides, so we work around it with an absolute div which is a bit bigger than the image. */
			width: calc(100% + 2px);
			margin-left: -1px;
		}
		& :global(.logotype) {
			z-index: 3;
		}
	}
	.info {
		z-index: 2;
	}
	.recent-booking :global(.booking-button) {
		/* @apply bg-neutrals-d30; */
	}
</style>
