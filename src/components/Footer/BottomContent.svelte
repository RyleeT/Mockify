<script>
  // import SocialLinks from './SocialLinks.svelte';
</script>

<!-- <div class="lg:hidden mt-5 xl:mt-6">
  <SocialLinks />
</div> -->
<div class="separator h-0.5 opacity-65 rounded mt-6 md:mt-8 xl:mt-12" />
<div
  class="flex flex-col md:flex-row text-sm md:text-base text-neutrals-l40 text-opacity-97 leading-none pt-5 xl:pt-8"
>
  <div class="flex items-center space-x-3">
    <a href="/legal/privacy">Privacy</a>
    <div class="w-1 h-1 bg-functional-r10 rounded-full" />
    <a href="/legal/terms">Terms</a>
    <div class="w-1 h-1 bg-functional-r10 rounded-full" />
    <a href="mailto:support@metafy.gg">Contact</a>
  </div>

  <p class="mt-6 md:mt-0 md:ml-auto">© {new Date().getFullYear()} Metafy, Inc.</p>
</div>

<style>
  .separator {
    background: linear-gradient(
      90.52deg,
      rgba(48, 82, 107, 0.04) 0.51%,
      rgba(48, 82, 107, 0.75) 48.04%,
      rgba(48, 82, 107, 0.04) 99.6%
    );
  }
</style>
