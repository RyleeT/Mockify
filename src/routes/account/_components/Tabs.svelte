<script>
  import Tabs from '@metafy/components/Tabs.svelte';
  import Tab from '@metafy/components/Tab.svelte';

  export let tabs = [];
  export let activeTab;
  export let hrefPrefix = '';
</script>

<div class="overflow-auto dashboard-tabs-root xs:pb-1">
  <Tabs>
    {#each tabs as { label, path, icon } (path)}
      <Tab active={path === activeTab} href="{hrefPrefix}/{path}" class="mr-6" padding="py-3 px-1">
        <span class="inline-flex space-x-1.5">
          <span class="whitespace-nowrap">{label}</span>
          {#if icon?.count}
            <span
              class="inline-flex items-center h-4 text-xxs px-1 rounded bg-opacity-15 {icon?.classes}"
            >
              {icon?.count}
            </span>
          {/if}
        </span>
      </Tab>
    {/each}
  </Tabs>
</div>

<style>
  .dashboard-tabs-root {
    & :global(ul) {
      @apply flex items-end min-w-min xs:px-5;
      box-shadow: inset 0px -1px 0px rgba(142, 148, 154, 0.16);
    }
    & :global(li) {
      @apply text-xs;
      &.active,
      &:hover {
        @apply text-white;
      }
      &:not(:last-child) {
        margin-right: 30px;
      }
    }

    & :global(li > button) {
      @apply flex items-center font-normal px-0;
    }

    & :global(li.active > button) {
      @apply font-medium;
      &:hover {
        @apply bg-transparent;
      }
    }

    & :global(li .icon) {
      padding: 0 5px;
      height: 15px;
      font-size: 10px;
    }
  }
</style>
