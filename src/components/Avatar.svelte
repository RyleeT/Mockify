<script>
  import Image from './Image.svelte';

  export let user = null;
  let className = '';
  export { className as class };
  export let size = '';
  export let rounded = 'rounded-2xl';
  export let border = '';
  export let preview = null;
  export let name = null;

  // Prioritize the preview for updated avatars
  $: avatar =
    preview ||
    (user?.avatar && typeof user.avatar === 'string' && user.avatar) ||
    'https://static.metafy.gg/avatars/1.jpg';
</script>

<Image
  src={avatar}
  alt={name || user?.name}
  class="{className} {border} object-cover"
  {rounded}
  {size}
  fit="crop"
/>
