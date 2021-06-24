<script>
  import { dashboardState } from '@metafy/lib/stores';
  import Scrollable from '@metafy/components/Scrollable.svelte';

  export let title = '';
  let className = '';
  export { className as class };
</script>

<Scrollable
  height="h-full"
  kind="light"
  class="pb-6 sm:pb-8 px-5 sm:px-8 lg:px-10 transition-spacing {className} {$dashboardState.sidebarIsExpanded
    ? 'xl:mr-84'
    : 'xl:mr-16'}"
>
  <div class="max-w-[920px] mx-auto">
    <div class="sticky top-0 z-1 bg-neutrals-d30 {title.length > 0 ? 'pt-6 sm:pt-8' : ''}">
      {#if title.length > 0}
        <div
          class="text-base font-medium leading-none text-white sm:leading-6 sm:text-xl -tracking-0.01"
        >
          {title}
        </div>
      {/if}
      <slot name="tabs" />
    </div>
    <slot name="content" />
  </div>
  <slot name="outer" isExpanded={$dashboardState.sidebarIsExpanded} />
</Scrollable>
