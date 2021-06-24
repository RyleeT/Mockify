<script lang="ts">
  import Image from '@metafy/components/Image.svelte';
  import type { ISpotlight } from '@metafy/lib/mock';

  let className = '';
  export { className as class };
  export let coach: ISpotlight;
</script>

<!-- TODO: Finish this component-->
<a class="{className} spotlight bg-neutrals-d10 flex p-3 relative rounded-xl" href="/">
  <div class="flex flex-col">
    <p
      class="border border-neutrals-d03 font-semibold leading-none mb-3 px-3 py-2 rounded text-neutrals-d03 text-tiny tracking-0.12 uppercase"
    >
      Spotlight
    </p>
    <h3 class="font-semibold leading-7.8 text-2xl text-neutrals-d03 tracking-0.02">
      {coach.name}
    </h3>
  </div>
</a>

<style>
  .spotlight {
    background: linear-gradient(78.89deg, #e2fbe4 2.43%, #ffc0b3 92.58%);
  }
</style>
