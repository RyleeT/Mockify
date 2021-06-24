<script lang="ts">
  import Image from '@metafy/components/Image.svelte';
  import type { ICourse } from '@metafy/lib/mock/courses';

  let className = '';
  export { className as class };
  export let course: ICourse;
</script>

<!-- TODO: Add hover state -->
<a
  class="{className} bg-neutrals-d01 flex flex-col justify-between overflow-hidden px-5 py-6 md:p-8 xl:pt-10 rounded-xl relative "
  href="/"
>
  <!-- Gradient & Background-->
  <div class="absolute top-1/2 right-0 bg-gradient-to-b from-neutrals-d01 w-full h-1/2" />
  <Image
    class="absolute top-1/2 right-0 w-full h-full object-cover object-center"
    size="w-[440px] xl:w-[469px] h-full"
    rounded="rounded-xl"
    src={course.bgPoster}
    alt={course.bgPoster}
  />

  <!-- Main Content -->
  <p
    class="font-bold leading-none mb-4 xl:mb-8 text-brands-metafy-alt text-xs md:text-sm tracking-0.12 uppercase"
  >
    {course.category}
  </p>
  <h3
    class="leading-7 md:leading-9.75 mb-5 md:mb-6 xl:mb-8.5 text-neutrals-l00 text-xl md:text-2.5xl tracking-0.02 z-1"
  >
    {course.title.en}
  </h3>
  <div class="flex z-1">
    <Image
      class="mr-5 object-cover rounded-xl w-10 md:w-14 h-10 md:h-14"
      src={course.instructor.picture}
      alt={course.title.en}
    />
    <div class="flex flex-col justify-between mt-0.5 md:mt-2.5 mb-0.5 md:mb-1">
      <p class="leading-none text-base text-neutrals-l00 tracking-0.01">
        {course.instructor.name}
      </p>
      <p class="leading-none text-neutrals-l01 text-sm md:text-base tracking-0.01">
        {course.lessonCount} lessons
      </p>
    </div>
  </div>
</a>
