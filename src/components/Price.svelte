<script>
  export let currency = '$';
  export let figure = 0;
  let className = '';
  export { className as class };
  export let textColor = 'text-white';
  export let lineHeight = 'leading-none';
  export let isDebit = false;

  $: [whole, decimal = 0] = `${(figure / 100).toFixed(2)}`.split('.');
  $: formattedWhole = parseInt(whole).toLocaleString();
  $: formattedDecimal = `.${decimal}`.padEnd(3, '0');
  $: isWhite = textColor === 'text-white';
</script>

<span class="inline-flex text-right tracking-0.02 {lineHeight} {className}">
  {#if isDebit}<span class={textColor}>- </span>{/if}
  <span
    class="font-normal {isWhite ? 'text-neutrals-l40' : textColor}"
    class:text-opacity-40={!isWhite}
  >
    {currency}
  </span>
  <span class={textColor}>{formattedWhole}</span>
  <span class={isWhite ? 'text-neutrals-l40' : textColor} class:text-opacity-40={!isWhite}
    >{formattedDecimal}</span
  >
</span>
