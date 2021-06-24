<script>
  import Image from '@metafy/components/Image.svelte';
  import IconTwitter from '@metafy/assets/svgs/home/twitter.svg';

  export let tweet;
</script>

<a
  href={tweet.url}
  class="block h-full text-left xl:opacity-80 xl:hover:opacity-100 border border-neutrals-l50 border-opacity-15 rounded-2xl transition-opacity ease-linear duration-100 p-6 pb-4"
  target="_blank"
>
  <div class="flex items-center">
    <Image class="mr-4" size="w-12 h-12" src={tweet.image} alt={tweet.name} rounded="rounded-lg" />
    <div class="flex flex-col overflow-hidden">
      <h3 class="text-base text-neutrals-l00 font-medium leading-relaxed truncate mb-1">
        {tweet.name}
      </h3>
      <p class="text-sm leading-none text-neutrals-l30">{tweet.handle}</p>
    </div>
    <IconTwitter class="self-start flex-shrink-0 ml-auto" />
  </div>
  <p class="text-sm leading-relaxed mt-6">
    {@html tweet.text}
  </p>
</a>
