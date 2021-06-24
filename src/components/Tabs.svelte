<script>
  let className = '';
  export { className as class };
</script>

<nav class="bg-neutrals-d30 {className}">
  <ul class="list-none">
    <slot />
  </ul>
</nav>
