<script>
  import { createEventDispatcher } from 'svelte';
  import { uuidv4 } from '@metafy/lib/utils';
  import Select from 'svelte-select';
  import SelectionComponent from 'svelte-select/src/Selection.svelte';

  const dispatch = createEventDispatcher();

  // Base options
  export let id = `a${uuidv4()}`;
  export let label = null;
  export let type = 'text';
  export let placeholder = '';
  export let help = null;
  export let disabled = false;
  export let required = false;
  export let action = null;
  export let actionLink = false;
  export let actionCustom = false;
  export let value = null;
  export let checked = null;
  let className = '';
  export { className as class };
  let el;
  export function focus(moveCursorToEnd = false) {
    el.focus();
    if (moveCursorToEnd) {
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }

  // Input options
  export let maxlength = undefined;
  export let max = undefined;
  export let min = undefined;
  export let readonly = false;
  // Note that to be able to use `inlineText`, or `isCurrencyInput`, we need to wrap the FormControl
  // in a "relative" div, from outside the component.
  export let inlineText = null;
  export let inlineTextPadding = null;
  export let isCurrencyInput = false;

  // Select options
  export let items = [];
  export let isMulti = false;
  export let isClearable = true;
  export let isCreatable = false;
  export let isSearchable = true;
  export let selectedValue = null;
  export let noOptionsMessage = 'No items found.';
  export let listPlacement = 'auto';
  export let listAutoWidth = true;
  export let loadOptions = undefined;
  export let showIndicator = false;
  export let Selection = SelectionComponent;

  // Icon options
  export let leftIcon = null;
  export let iconProps = {};

  // Textarea options
  export let rows = 2;

  // Toggle options
  export let labelClass = '';
  export let isBigToggle = false;
</script>

{#if label || action}
  <div class="flex flex-row justify-between items-end mb-2 md:mb-3">
    {#if label}
      <label
        for={id}
        class="formcontrol-label text-sm md:text-base leading-none tracking-0.01 text-neutrals-l40 block"
        >{label}</label
      >
    {/if}
    {#if action}
      {#if actionLink}
        <a
          href={actionLink}
          tabindex={-1}
          class="font-semibold text-xs leading-4 text-functional-r00 hover:text-functional-r20 transition-colors
            duration-200 block focus:outline-none"
        >
          {action}
        </a>
      {:else}
        <button
          type="button"
          class="font-semibold text-xs leading-4 text-functional-r00 hover:text-functional-r20 transition-colors
            duration-200 block focus:outline-none"
          on:click={() => dispatch('action')}
        >
          {action}
        </button>
      {/if}
    {:else if actionCustom}
      <slot name="action" />
    {/if}
  </div>
{/if}
{#if type === 'select'}
  <span class="select block text-neutrals-d30 {className}">
    <Select
      {items}
      {placeholder}
      {isClearable}
      {isCreatable}
      {isSearchable}
      {isMulti}
      {noOptionsMessage}
      {selectedValue}
      {listPlacement}
      {listAutoWidth}
      {loadOptions}
      {showIndicator}
      {Selection}
      isDisabled={disabled}
      inputAttributes={{ id, required, disabled }}
      on:select
      on:clear
    />
  </span>
{:else if type === 'textarea'}
  <!-- TODO: Make textarea use on:change too, for consistency. -->
  <textarea
    bind:this={el}
    {id}
    {placeholder}
    {disabled}
    {required}
    {maxlength}
    bind:value
    {rows}
    class="textarea {className}"
    on:input
    on:keyup
    on:keydown
    on:paste
  />
{:else if type === 'checkbox'}
  <input
    bind:this={el}
    {id}
    type="checkbox"
    {placeholder}
    {disabled}
    {required}
    bind:checked
    class="w-6 h-6 text-transparent bg-transparent focus:ring-0 focus:ring-offset-0 border border-neutrals-l50 border-opacity-35 rounded cursor-pointer transition-colors duration-200 {className}"
    on:change
  />
{:else if type === 'toggle'}
  <label for={id} class="toggle-label {labelClass}" class:isBigToggle>
    <input
      bind:this={el}
      {id}
      type="checkbox"
      {placeholder}
      {disabled}
      {required}
      bind:checked
      class="form-toggle cursor-pointer {className}"
      on:change
    />
    <div class="slider" />
  </label>
{:else if type === 'custom'}
  <slot />
{:else}
  {#if leftIcon}
    <span class="absolute left-0 top-1/2 transform -translate-y-1/2 ml-3">
      <svelte:component this={leftIcon} class="w-4 h-4 text-neutrals-l30" {...iconProps} />
    </span>
  {/if}
  {#if isCurrencyInput}
    <span
      class="currency-symbol absolute left-3 pointer-events-none text-base text-neutrals-l40 tracking-0.01 leading-none"
    >
      $
    </span>
  {/if}
  <!-- Compiler won't allow dynamic types... hackish bypass -->
  <input
    {...{ type }}
    bind:this={el}
    {id}
    {placeholder}
    {disabled}
    {required}
    {maxlength}
    {min}
    {max}
    {readonly}
    bind:value
    class="input {className}"
    class:hasInlineText={inlineTextPadding !== null}
    class:isCurrencyInput
    class:pl-10={leftIcon}
    style={inlineTextPadding !== null ? `--inline-text-padding: ${inlineTextPadding}px;` : ''}
    on:input
    on:change
    on:keyup
    on:keydown
    on:blur
    on:paste
  />
  {#if inlineText}<span class="inline-text text-sm text-neutrals-l40 absolute right-4"
      >{inlineText}</span
    >{/if}
{/if}
{#if help}
  <span class="text-xs leading-4 text-neutrals-l30 block mt-2 md:mt-3">{@html help}</span>
{/if}

<style>
  /* Note: The input and textarea styles are located in "src/assets/styles/global.css" */

  /* Custom select */
  /* https://github.com/rob-balfre/svelte-select/blob/master/docs/theming_variables.md */
  .select {
    --background: theme('backgroundColor.neutrals.d10');
    --border: 1px solid theme('borderColor.neutrals.d10');
    --borderFocusColor: theme('borderColor.functional.r20');
    --borderHoverColor: theme('borderColor.neutrals.d10');
    --borderRadius: theme('borderRadius.lg');
    --clearSelectColor: theme('colors.neutrals.l30');
    --clearSelectFocusColor: theme('colors.neutrals.l30');
    --clearSelectHoverColor: theme('colors.neutrals.l30');
    --clearSelectWidth: 16px;
    --disabledBackground: theme('backgroundColor.transparent');
    --disabledBorderColor: rgba(121, 134, 148, 0.15);
    --disabledColor: rgba(255, 255, 255, 0.4);
    --disabledPlaceholderColor: rgba(121, 134, 148, 0.6);
    --errorBorder: 1px solid theme('borderColor.functional.r10');
    --height: 50px;
    --indicatorColor: theme('colors.neutrals.l30');
    --indicatorFill: theme('colors.neutrals.l30');
    --indicatorRight: 16px;
    --inputColor: theme('colors.neutrals.l00');
    --inputFontSize: theme('fontSize.base');
    --inputLetterSpacing: theme('letterSpacing.normal');
    --itemActiveBackground: theme('backgroundColor.neutrals.d20');
    --itemFirstBorderRadius: theme('borderRadius.DEFAULT');
    --itemHoverBG: theme('backgroundColor.neutrals.d20');
    --itemIsActiveBG: theme('backgroundColor.neutrals.d20');
    /* --itemIsActiveColor: theme('colors.functional.r00');  */
    --itemColor: theme('colors.neutrals.l00');
    --listBackground: theme('backgroundColor.neutrals.d00');
    --listBorderRadius: theme('borderRadius.lg');
    /* --listEmptyColor: theme('colors.neutrals.l20'); */
    --listShadow: theme('boxShadow.md');
    --multiClearBG: #0d0f10;
    --multiClearFill: theme('colors.neutrals.l30');
    --multiClearHoverBG: #0d0f10;
    --multiClearHoverFill: theme('colors.neutrals.l30');
    --multiClearRadius: theme('borderRadius.DEFAULT');
    --multiClearTop: 9px;
    --multiItemActiveBG: #0d0f10;
    --multiItemActiveColor: theme('colors.neutrals.l00');
    --multiItemDisabledHoverBg: #0d0f10;
    --multiItemDisabledHoverColor: theme('colors.neutrals.l00');
    --multiItemBG: #0d0f10;
    --multiItemBorderRadius: theme('borderRadius.DEFAULT');
    --multiItemHeight: 32px;
    --multiItemMargin: 10px 10px 0 0;
    --multiLabelMargin: 0 5px 0 0;
    --placeholderColor: rgba(121, 134, 148, 0.6);
    @apply text-neutrals-l00;
    @screen md {
      --inputFontSize: theme('fontSize.base');
      --height: 60px;
      --multiItemMargin: 14px 12px 0 0;
    }

    &:hover {
      /* --background: theme('backgroundColor.neutrals.d00'); */
    }
  }
  :global(.selectContainer.selectContainer.selectContainer) {
    @apply text-sm md:text-base;
    @apply transition-colors ease-in-out duration-200;
  }
  :global(.selectContainer input) {
    &::placeholder {
      @apply text-sm md:text-base opacity-100;
    }
  }
  :global(.selectContainer .multiSelectItem) {
    /* @apply text-neutrals-l00 text-sm; */
  }
  :global(.selectContainer .selectedItem) {
    @apply flex items-center overflow-y-hidden;
  }
  :global(.listContainer) {
    /* @apply border border-neutrals-d10; */
  }

  /* Custom toggle */
  .toggle-label {
    @apply inline-block relative flex-shrink-0;
    width: 34px;
    height: 16px;

    & input.form-toggle {
      @apply hidden;

      &:checked {
        & + .slider {
          @apply bg-functional-r20 border-opacity-0;
        }
        & + .slider:before {
          @apply bg-white;
          transform: translate(calc(34px - 12px - 2px), 2px);
        }
      }
    }
    & .slider {
      @apply absolute top-0 left-0 w-full h-full bg-transparent cursor-pointer;
      /* @apply box-content border border-neutrals-l40 border-opacity-35 rounded-lg; */
      @apply transition-colors duration-300 ease-in-out;

      &:before {
        /* @apply absolute bg-neutrals-l40 rounded-full; */
        @apply transition-all duration-300 ease-in-out;
        content: '';
        height: 12px;
        width: 12px;
        transform: translate(2px, 2px);
      }
    }

    &.isBigToggle {
      width: 48px;
      height: 24px;

      & .slider {
        @apply rounded-2xl;
      }
      & input.form-toggle:checked + .slider:before {
        transform: translate(calc(48px - 18px - 4px), 3px);
      }
      & .slider:before {
        height: 18px;
        width: 18px;
        transform: translate(4px, 3px);
      }
    }
  }
  input.hasInlineText {
    padding-right: var(--inline-text-padding);
  }
  .inline-text {
    bottom: 13.5px;
    @screen md {
      bottom: 18px;
    }
  }
  input.isCurrencyInput {
    --defaultPadding: theme('spacing.3');
    --currencyPadding: 13px;
    padding-left: calc(var(--defaultPadding) + var(--currencyPadding));
    @screen md {
      --defaultPadding: theme('spacing.4');
      --currencyPadding: 9px;
    }
  }
  .currency-symbol {
    bottom: 15px;
    @screen md {
      bottom: 16px;
    }
  }
</style>
