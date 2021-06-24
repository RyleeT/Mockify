<script>
  import { courses, featuredCourse, highlightedCourses, spotlight } from '@metafy/lib/mock';
  import FormControl from '@metafy/components/FormControl.svelte';
  import MetaTags from '@metafy/components/MetaTags.svelte';
  import { BigCourse, Course, FeaturedCourse, HighlightedCourse, Spotlight } from './_components';
</script>

<main class="container py-8 xl:py-10 space-y-6 sm:space-y-8">
  <!-- Header -->
  <div class="flex justify-between">
    <h1 class="font-semibold leading-none text-2xl text-neutrals-l00 tracking-0.01">Courses</h1>
    <!-- TODO: Put searchbar here -->
  </div>
  <!-- TODO: Put tabs here-->

  <!-- Highlighted Courses -->
  <div class="courses flex flex-col xl:flex-row">
    <HighlightedCourse
      class="mb-6 md:mb-8 xl:mb-0 xl:mr-14 xl:w-3/5"
      course={highlightedCourses[0]}
    />
    <BigCourse class="xl:w-2/5" course={courses[0]} />
  </div>

  <!-- Latest Courses -->
  <div class="col-span-3">
    <h2 class="leading-none text-white text-xl tracking-0.02">Latest</h2>
    <!-- TODO: Make this a slider -->
    <div class="grid xl:container">
      <div
        class="grid xs:gap-x-4 gap-x-8 grid-flow-col overflow-x-auto xl:overflow-y-visible xl:pl-0 pt-6"
      >
        {#each courses.slice(1, 4) as course}
          <Course {course} />
        {/each}
      </div>
    </div>
    <div class="flex justify-end">
      <h2
        class="cursor-pointer font-semibold leading-none mt-5 text-brands-metafy-alt tracking-0.02"
      >
        See more courses
      </h2>
    </div>
  </div>

  <!-- Featured & Spotlight Courses -->
  <div class="flex flex-col xl:flex-row">
    <FeaturedCourse class="mb-6 md:mb-8 xl:mb-0 xl:mr-8 xl:w-3/4" course={featuredCourse} />
    <Spotlight class="xl:w-1/4" coach={spotlight} />
  </div>
</main>

<MetaTags pageTitle="Courses" />
