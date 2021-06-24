<script>
  // Button state
  let className = '';
  export { className as class };
  export let type = 'button';
  export let disabled = false;
  export let loading = false;
  export let href = null;
  export let target = null;
  export let rel = null;
  export let preload = false;
  // Button style
  export let kind = 'basic';
  export let padding = 'px-12 py-2';
  export let border = '';
  export let rounded = 'rounded-md';
  export let fontWeight = 'font-medium';
  export let textSize = 'text-sm';
  export let backgroundColor = '';
  export let size = '';

  const kindClasses = {
    default:
      'appearance-none text-center focus:outline-none transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',
    basic: 'bg-neutrals-d20 text-neutrals-l40 border border-neutrals-l30 border-opacity-20',
    primary: 'bg-functional-r20 text-neutrals-l00 hover:bg-functional-r30',
    'primary-outline': 'text-functional-r50',
    destructive:
      'bg-transparent text-neutrals-l40 border border-neutrals-l30 border-opacity-25 hover:border-opacity-50',
    outline:
      'border border-opacity-25 leading-none bg-opacity-0 hover:bg-opacity-10 hover:border-opacity-35 transition-colors',
    'blue-outline':
      'text-functional-b10 border border-neutrals-l50 border-opacity-25 leading-none bg-opacity-0 hover:bg-opacity-10 hover:border-opacity-35 transition-colors',
    gradient: 'relative z-0 overflow-hidden text-neutrals-l00'
  };
  if (kind === 'primary-outline') {
    border = 'border border-functional-r50 border-opacity-25 hover:border-opacity-50';
  } else if (kind === 'gradient') {
    if (backgroundColor === '') {
      backgroundColor = 'bg-neutrals-d10';
    }
  }

  let klass;
  $: {
    const commonClasses = `${padding} ${border} ${rounded} ${fontWeight} ${textSize} ${backgroundColor} ${size} ${className}`;
    if (kind !== 'custom') {
      klass = `${kindClasses.default} ${kindClasses[kind]} ${commonClasses}`;
    } else {
      klass = `${kindClasses.default} ${commonClasses}`;
    }
  }
  $: isDisabled = disabled || loading;
</script>

{#if href}
  <a
    class="inline-flex justify-center items-center {klass}"
    {href}
    {target}
    {rel}
    {disabled}
    role="button"
    class:spinner={loading}
    class:gradientBorder={kind === 'gradient'}
    on:click
    on:mouseenter
    on:mouseleave
    {...preload ? { sveltekit: 'prefetch' } : {}}
  >
    {#if kind === 'gradient'}
      <span class="absolute inset-0 w-full h-full -z-1 {backgroundColor}" />
    {/if}

    <slot />
  </a>
{:else}
  <button
    {type}
    class={klass}
    class:spinner={loading}
    class:gradientBorder={kind === 'gradient'}
    disabled={isDisabled}
    on:click
    on:mouseenter
    on:mouseleave
  >
    {#if kind === 'gradient'}
      <span class="absolute inset-0 w-full h-full -z-1 {backgroundColor}" />
    {/if}
    <slot />
  </button>
{/if}

<style>
  .gradientBorder {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
      linear-gradient(
        to right,
        theme('colors.functional.r50'),
        theme('colors.functional.b10'),
        theme('colors.functional.r50')
      );
    background-size: 200% 200%;
    background-origin: border-box;
    background-clip: content-box, border-box;
    border: 1px solid transparent;
  }
  .gradientBorder.spinner {
    animation: gradient 4s ease infinite;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
