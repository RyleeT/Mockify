<script>
  import { onMount } from 'svelte';
  import { browser, dev } from '$app/env';
  import { page } from '$app/stores';

  const GOOGLE_ID = 'G-NLJYTV81QQ';

  onMount(() => {
    // Initialize GA
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', GOOGLE_ID);
    }
  });

  // Send a page view event
  $: browser &&
    window.gtag &&
    window.gtag('event', 'page_view', {
      page_path: $page.path,
      send_to: GOOGLE_ID
    });
  $: browser && window.analytics && window.analytics.page($page.path);
</script>

<svelte:head>
  <!-- SSR only -->
  {#if !browser && !dev}
    <!-- Segment -->
    <!-- prettier-ignore -->
    <script>
      !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="3BRVSxAfJiK8y3PWrX1Le8lJP6CH2j9l";analytics.SNIPPET_VERSION="4.13.2";
      analytics.load("3BRVSxAfJiK8y3PWrX1Le8lJP6CH2j9l");
      analytics.page();
      }}();
    </script>
    <!-- prettier-ignore -->
    <!-- Google Analytics 4.0 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NLJYTV81QQ">
    </script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
    </script>
  {/if}
</svelte:head>
