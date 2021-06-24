<script>
  import { browser } from '$app/env';
  import { page } from '$app/stores';
  import { BASE_APP_URL } from '@metafy/lib/constants';

  let siteName = 'Metafy';
  let siteUrl = 'https://metafy.gg';
  let imageFallback = 'https://static.metafy.gg/meta/home-cover-alt.jpg';

  export let pageTitle = undefined;
  export let title = pageTitle === undefined ? siteName : `${pageTitle} - ${siteName}`;
  export let url = `${BASE_APP_URL}${$page.path}` || siteUrl;
  export let description = undefined;
  export let image = imageFallback;
  export let imageAlt = siteName;

  $: metaTags = !browser && {
    'twitter:site': '@TryMetafy',
    'og:type': 'website',
    'og:url': url,
    'twitter:url': url,
    'og:title': title || '',
    'twitter:title': title || '',
    ...(description
      ? {
          description: description || '',
          'og:description': description || '',
          'twitter:description': description || ''
        }
      : {}),
    'og:image': image || imageFallback,
    'twitter:image': image || imageFallback,
    'twitter:image:alt': imageAlt || '',
    'og:locale': 'en_US'
  };
</script>

<svelte:head>
  <title>{title}</title>
  <!-- Meta tags don't need to be updated on the client. Only the initial SSR response. -->
  {#if !browser}
    {#each Object.entries(metaTags) as [property, content]}
      {#if property === 'description'}
        <meta name={property} {content} />
      {:else}
        <meta {property} {content} />
      {/if}
    {/each}
    <link rel="canonical" href={url} />
  {/if}
</svelte:head>
