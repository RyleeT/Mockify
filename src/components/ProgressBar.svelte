<script>
  const kinds = {
    DEFAULT: 'default',
    STEPS: 'steps',
    SKEWED: 'skewed'
  };

  export let kind = kinds.DEFAULT;
  export let value = 0;
  export let total = 0;
  // `confirmed` can be used in `steps` mode to show which of the steps are "active" (but not completed yet).
  export let confirmed = 0;

  let className = '';
  export { className as class };
  export let height = 'h-1';
  export let backgroundColor = 'bg-functional-b10';
  export let borderColor = 'border-functional-b10';
  export let barBackgroundColor = 'bg-white';

  const stepWidth = (i) =>
    !Number.isInteger(value) && i === Math.floor(value) ? 'w-1/2' : 'w-full';
</script>

{#if kind === kinds.SKEWED}
  {#if total > 10}
    <!-- Show bars with lots of steps as a line. -->
    <span class="flex w-full rounded-full bg-opacity-15 {height} {backgroundColor} {className}">
      <span
        class="h-full rounded-full {barBackgroundColor}"
        style="width: {(value * 100) / total}%"
      />
    </span>
  {:else}
    <div
      class="p-px rounded-full border border-opacity-30 bg-opacity-15 {backgroundColor} {borderColor} {className}"
    >
      <div class="overflow-hidden rounded-full">
        <div
          class="grid -mx-0.5 transform {height}"
          style="--tw-skew-x: -40deg; gap: 3px; grid-template-columns: repeat({Math.ceil(
            total
          )}, 1fr)"
        >
          {#each { length: Math.ceil(value) } as _, i (i)}
            <span class="inline-flex h-full {barBackgroundColor} bg-opacity-15">
              <span class="h-full {barBackgroundColor} {stepWidth(i)}" />
            </span>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{:else if kind === kinds.STEPS}
  <div class="flex items-center space-x-1 w-full sm:space-x-2">
    {#each { length: total } as _, i (i)}
      {#if i < value}
        <span
          class="inline-flex justify-center items-center w-3 h-3 border-2 border-functional-g30 rounded-full"
        />
      {:else if i <= confirmed}
        <span
          class="inline-flex justify-center items-center w-3 h-3 border-2 border-functional-r50 rounded-full"
        />
      {:else}
        <span
          class="inline-flex justify-center items-center w-3 h-3 border-2 border-opacity-60 border-neutrals-l40 rounded-full"
        />
      {/if}

      {#if i < total - 1}
        <span
          class="flex-1 flex-shrink-0 h-px rounded-full {i < value
            ? 'bg-functional-g30'
            : i < confirmed
            ? 'bg-functional-r50'
            : 'bg-neutrals-l40 bg-opacity-25'}"
        />
      {/if}
    {/each}
  </div>
{:else}
  <span class="flex w-full rounded-full bg-opacity-15 {height} {backgroundColor} {className}">
    <span class="h-full rounded-full {barBackgroundColor}" style="width: {value}%" />
  </span>
{/if}
