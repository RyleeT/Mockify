<script>
  import { onMount } from 'svelte';
  import { dayjs } from '@metafy/lib/utils';

  export const COLORS = {
    pending: {
      via: 'via-functional-y20',
      text: 'text-functional-y20',
      background: 'bg-functional-y20'
    },
    rescheduling: {
      via: 'via-functional-y20',
      text: 'text-functional-y20',
      background: 'bg-functional-y20'
    },
    confirmed: {
      via: 'via-functional-g20',
      text: 'text-functional-g20',
      background: 'bg-functional-g20'
    }
  };

  export let date;
  export let label = 'Time left for you to reschedule';
  export let type = 'pending';

  const dateInst = dayjs(date);

  let days;
  let hours;
  let minutes;
  let seconds;

  function timer() {
    const diff = dayjs.duration(dateInst.diff(dayjs()));
    days = diff.asDays() > 0 ? diff.format('DD') : '00';
    hours = diff.asHours() > 0 ? diff.format('HH') : '00';
    minutes = diff.asMinutes() > 0 ? diff.format('mm') : '00';
    seconds = diff.asSeconds() > 0 ? diff.format('ss') : '00';
    return diff.asSeconds() > 0;
  }
  timer();

  onMount(() => {
    const interval = window.setInterval(() => {
      // Run timer function, clear interval if countdown has finished.
      if (!timer()) {
        window.clearInterval(interval);
      }
    }, 1000);
    return () => {
      window.clearInterval(interval);
    };
  });
</script>

<div class="lg:relative rounded-2xl {COLORS[type].text}">
  <div
    class="absolute inset-0 opacity-[0.07] lg:opacity-100 bg-gradient-to-r from-transparent {COLORS[
      type
    ].via} to-transparent rounded-2xl"
  />
  <div class="absolute inset-0 hidden m-px lg:block bg-neutrals-d10 rounded-2xl" />
  <div
    class="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent {COLORS[type]
      .via} to-transparent rounded-2xl opacity-5"
  />

  <div class="relative flex flex-col items-center pb-5 text-center lg:px-5 lg:pt-4 lg:pb-10">
    <span class="mb-3 text-sm text-white tracking-0.01">
      {label}
    </span>

    <span class="flex items-center font-semibold leading-none text-1.5xl tracking-0.08">
      <span class="relative w-16">
        <span>{days}</span>
        <span
          class="absolute mt-2 leading-none uppercase transform -translate-x-1/2 left-1/2 top-full text-xxs text-neutrals-l40 tracking-0.08"
        >
          days
        </span>
      </span>

      <span class="flex flex-col opacity-15 animate-pulse space-y-1.5">
        <span class="w-1 h-1 rounded-full {COLORS[type].background}" />
        <span class="w-1 h-1 rounded-full {COLORS[type].background}" />
      </span>

      <span class="relative w-16">
        <span>{hours}</span>
        <span
          class="absolute mt-2 leading-none uppercase transform -translate-x-1/2 left-1/2 top-full text-xxs text-neutrals-l40 tracking-0.08"
        >
          hrs
        </span>
      </span>

      <span class="flex flex-col opacity-15 animate-pulse space-y-1.5">
        <span class="w-1 h-1 rounded-full {COLORS[type].background}" />
        <span class="w-1 h-1 rounded-full {COLORS[type].background}" />
      </span>

      <span class="relative w-16">
        <span>{minutes}</span>
        <span
          class="absolute mt-2 leading-none uppercase transform -translate-x-1/2 left-1/2 top-full text-xxs text-neutrals-l40 tracking-0.08"
        >
          mins
        </span>
      </span>

      <span class="flex flex-col opacity-15 animate-pulse space-y-1.5">
        <span class="w-1 h-1 rounded-full {COLORS[type].background}" />
        <span class="w-1 h-1 rounded-full {COLORS[type].background}" />
      </span>

      <span class="relative w-16">
        <span>{seconds}</span>
        <span
          class="absolute mt-2 leading-none uppercase transform -translate-x-1/2 left-1/2 top-full text-xxs text-neutrals-l40 tracking-0.08"
        >
          secs
        </span>
      </span>
    </span>
  </div>
</div>
