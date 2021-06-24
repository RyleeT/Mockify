<script lang="ts">
  import Image from '@metafy/components/Image.svelte';
  import type { ICourse } from '@metafy/lib/mock/courses';

  export let course: ICourse;
</script>

<a class="course-container pop-transition bg-neutrals-d01 flex p-3 rounded-xl" href="/">
  <Image
    class="mr-5 object-cover pointer-events-none rounded-xl w-29 h-29"
    src={course.poster}
    alt={course.title.en}
  />

  <div class=" flex flex-col justify-between my-3">
    <p class="font-bold leading-none text-brands-metafy-alt text-xs tracking-0.12 uppercase">
      {course.category}
    </p>
    <h3 class="font-semibold line-clamp-2 text-base text-neutrals-l00 tracking-0.02">
      {course.title.en}
    </h3>
    <p class="leading-none text-neutrals-l01 text-sm tracking-0.01">
      {course.instructor.name} • {course.lessonCount} lessons
    </p>
  </div>
</a>

<style>
  .course-container {
    min-width: 357.33px;
  }
</style>
