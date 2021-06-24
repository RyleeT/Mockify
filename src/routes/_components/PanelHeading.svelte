<script>
  let className = '';
  export { className as class };
  export let fontWeight = 'font-medium';
</script>

<h4 class="inline-flex space-x-2 items-center leading-none {className}">
  <span class="text-xs {fontWeight} uppercase text-neutrals-l40 tracking-0.08">
    <slot />
  </span>

  <slot name="extra" />
</h4>
