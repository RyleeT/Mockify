<script context="module">
  export const height = 64; // px
</script>

<script>
  import InlineSVG from 'svelte-inline-svg';
  import { STATIC_URL } from '@metafy/lib/constants';
  import BrowseGamesButton from '@metafy/components/BrowseGamesButton.svelte';
  import MetafySymbol from '@metafy/assets/svgs/metafy_symbol.svg';
</script>

<div class="container relative z-guest-navbar hidden xl:block" style="height: {height}px">
  <nav class="flex items-center pt-6">
    <a href="/" sveltekit:prefetch>
      <InlineSVG class="w-11.5 h-10 text-brands-metafy mr-8" src={MetafySymbol} />
    </a>
    <BrowseGamesButton />

    <ul class="flex items-center text-neutrals-l00 leading-none space-x-10 ml-auto mr-10">
      <li><a href="/gift-cards" sveltekit:prefetch>Gift Cards</a></li>
      <li>
        <a href="https://form.typeform.com/to/Wr6mNRlH" rel="noopener noreferrer">Become a Coach</a>
      </li>
    </ul>

    <a href="/auth/account/login" class="mr-4" sveltekit:prefetch>
      <button
        class="w-[88px] h-10 font-medium text-neutrals-l00 text-xs uppercase tracking-0.08 border border-neutrals-l50 border-opacity-35 rounded-md leading-none"
      >
        Login
      </button>
    </a>
    <a href="/auth/account/create" sveltekit:prefetch>
      <button
        class="w-[88px] h-10 font-medium text-functional-r50 text-xs uppercase tracking-0.08 border border-functional-r50 rounded-md leading-none"
      >
        Sign up
      </button>
    </a>
  </nav>
</div>
