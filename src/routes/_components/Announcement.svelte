<script>
  import IconAnnouncementArrow from '@metafy/assets/svgs/home/announcement_arrow.svg';

  export let text = '';
  export let url = '#';
</script>

<a
  href={url}
  target="_blank"
  class="flex self-start bg-neutrals-d10 bg-opacity-80 rounded-lg px-4 py-3 mb-6"
>
  <span class="text-sm leading-none text-neutrals-l00 mr-3">{text}</span>
  <div class="announcement-separator w-px h-full flex-shrink-0 bg-neutrals-l50 bg-opacity-35" />
  <span class="flex items-center text-sm text-functional-b10 font-medium leading-none ml-3">
    Read more
    <IconAnnouncementArrow class="ml-3" />
  </span>
</a>
