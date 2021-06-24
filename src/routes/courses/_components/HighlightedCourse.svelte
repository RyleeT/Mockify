<!-- TODO: This component should probably be a carousel -->
<script lang="ts">
  import Image from '@metafy/components/Image.svelte';
  import type { IHighlightedCourse } from '@metafy/lib/mock';
  import KnowMoreButton from './KnowMoreButton.svelte';
  import BackgroundDecoration from '@metafy/assets/svgs/background_decoration_light_1.svg';

  let className = '';
  export { className as class };
  export let course: IHighlightedCourse;
</script>

<div class="{className} highlighted-course flex px-5 py-6 md:p-8 xl:p-10 relative rounded-xl">
  <!-- Main Content -->
  <div class="flex flex-col w-2/3">
    <p
      class="font-bold leading-none mb-4 sm:mb-6 text-neutrals-d03 text-xs md:text-sm uppercase tracking-0.12 "
    >
      {course.instructor.name} <span class="text-neutrals-l02">//</span>
      {course.category}
    </p>
    <h3
      class="leading-7.8 md:leading-10.5 xl:leading-12 mb-5 sm:mb-3 text-2xl md:text-3.5xl xl:text-4xl text-neutrals-d03 tracking-0.01 z-2"
    >
      {course.title.en}
    </h3>
    <p class="line-clamp-2 mb-5 text-neutrals-l03 xs:hidden z-2">
      {course.description}
    </p>
    <KnowMoreButton />
  </div>

  <!-- Background Image and Decoration -->
  <BackgroundDecoration class="absolute w-full h-full top-0 left-0" />
  <Image
    class="absolute bottom-0 max-h-9/10 max-w-9/20 pointer-events-none right-0 rounded-br-xl z-1"
    src={course.instructor.picture}
    alt={course.title.en}
  />
</div>

<style>
  .highlighted-course {
    background: linear-gradient(94.87deg, #b8dcfe 0.47%, #ffbeb0 94.4%);
  }
</style>
