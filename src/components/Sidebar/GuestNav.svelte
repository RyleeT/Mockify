<script>
  import ArrowExternal from '@metafy/assets/svgs/arrow_external.svg';

  const PAGES = [
    {
      href: '/gift-cards',
      label: 'Gift Cards'
    },
    {
      href: 'https://form.typeform.com/to/Wr6mNRlH',
      label: 'Become a Coach'
    },
    {
      href: 'https://metafy.gg/careers',
      label: 'Careers'
    },
    {
      href: 'https://medium.com/metafy',
      label: 'Blog'
    },
    {
      href: 'mailto:support@metafy.gg',
      label: 'Support'
    }
  ];

  const isExternal = (url) => url.includes('https://');
</script>

<nav>
  <ul class="flex flex-col space-y-4">
    {#each PAGES as { href, label } (href)}
      <li class="flex">
        <a
          class="flex w-full py-4 text-base leading-none text-neutrals-l00"
          rel={isExternal(href) ? 'noopener noreferrer' : 'preload'}
          target={isExternal(href) ? '_blank' : '_self'}
          {href}
        >
          {label}
          {#if isExternal(href)}
            <ArrowExternal class="w-1 h-1" />
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</nav>
