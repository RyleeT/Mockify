<script>
  import { query } from '@metafy/lib/apollo';
  import { GET_PACKS } from '@metafy/graphql/queries';
  import { dashboardState } from '@metafy/lib/stores';

  import PanelHeading from './PanelHeading.svelte';
  import BundleCard from './BundleCard.svelte';

  let className = '';
  export { className as class };
  export let title = 'Your Bundles';

  // Always request the latest pack data
  $: response = query({
    query: GET_PACKS,
    variables: { teamId: $dashboardState.selectedTeamId },
    fetchPolicy: 'network-only'
  });

  $: bundles = ($response.data?.accountPackages || []).filter((p) => p.remaining > 0);
</script>

{#if bundles.length}
  <div class={className}>
    <PanelHeading class="mb-4">{title}</PanelHeading>
    <div class="space-y-4">
      {#each bundles as bundle (bundle.id)}
        <BundleCard {bundle} />
      {/each}
    </div>
  </div>
{/if}
