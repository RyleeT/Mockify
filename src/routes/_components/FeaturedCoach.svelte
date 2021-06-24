<script>
  import { tooltip } from '@metafy/lib/directives/tooltip';
  import { resizeImage } from '@metafy/lib/utils';

  export let slug;
  export let name;
  export let image;
  export let bio;
  export let startingPrice;

  const html = `
    <div class="flex items-center mb-4">
      <img src="${
        resizeImage(image, 'w-8 h-8', { fit: 'crop', sharpen: '1', quality: '100' }).src
      }" class="w-8 h-8 object-cover object-top rounded-lg mr-3" width="36" height="36" />
      <div class="flex-col">
        <h3 class="text-sm font-medium leading-none mb-1">
          ${name}
        </h3>
        <p class="text-xs text-neutrals-l40 leading-none">
          Starting at <span class="font-medium text-functional-r50">$${startingPrice}</span>
        </p>
      </div>
    </div>
    <p class="text-sm text-neutrals-l30 leading-normal mb-4">
      ${bio}
    </p>
    <a href="/@${slug}" class="text-xs font-medium text-functional-r50 uppercase tracking-0.08 leading-none" sveltekit:prefetch>
      See full profile
    </a>
  `;
</script>

<a
  href="/@{slug}"
  class="text-neutrals-l00 hover:text-functional-r50 underline italic whitespace-nowrap"
  use:tooltip={{
    content: html,
    allowHTML: true,
    theme: 'blue',
    placement: 'bottom',
    arrow: false,
    disableMobile: true,
    interactive: true
  }}>{name}</a
>
