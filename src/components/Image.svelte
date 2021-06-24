<script>
  import { resizeImage } from '@metafy/lib/utils';

  export let src = null;
  export let alt = '';
  export let lazy = true;
  let className = '';
  export { className as class };
  export let size = '';
  export let fit = 'contain';
  export let gravity = '';
  export let border = '';
  export let rounded = '';
  export let align = 'self-start';

  $: resized = resizeImage(src, size, { fit, gravity, sharpen: '1', quality: '100' });
</script>

<img
  src={resized.src || src}
  srcset={resized.srcset || ''}
  sizes={resized.sizes || ''}
  {...resized.attributes}
  {alt}
  loading={lazy ? 'lazy' : 'eager'}
  class="{className} {size} {align} {border} {border !== ''
    ? 'box-content'
    : ''} {rounded} flex-shrink-0"
  on:error
/>
