<script lang="ts">
  import type { IFeaturedCourse } from '@metafy/lib/mock';

  let className = '';
  export { className as class };
  export let course: IFeaturedCourse;
</script>

<!-- TODO: Add hover state or button for clickthrough -->
<a
  class="{className} bg-neutrals-d02 col-span-2 flex flex-col px-5 py-6 md:p-8 xl:p-10 rounded-xl"
  href="/"
>
  <!-- <Image
        class="object-cover rounded-2xl mr-5"
        size="w-[140px] h-[140px]"
        fit="crop"
        src={course.poster}
        alt={course.title.en}
      /> -->
  <p class="font-bold leading-none mb-6 text-neutrals-l00 text-sm tracking-0.12 uppercase">
    Featured
  </p>
  <h3 class="featured-course leading-13 mb-4 text-4xl tracking-0.01">
    {course.title.en}
  </h3>
  <p text-neutrals-l01>
    {course.description}
  </p>
</a>

<style>
  .featured-course {
    background: linear-gradient(98.72deg, #b8dcfe 15.96%, #ffbeb0 83.28%);
    background-clip: text;
    color: transparent;
  }
</style>
