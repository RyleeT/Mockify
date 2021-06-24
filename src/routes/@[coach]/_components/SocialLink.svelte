<script>
  import Twitter from '@metafy/assets/svgs/social_twitter_button.svg';
  import Twitch from '@metafy/assets/svgs/social_twitch_button.svg';
  import Discord from '@metafy/assets/svgs/social_discord_button.svg';
  import Instagram from '@metafy/assets/svgs/social_instagram_button.svg';
  import Facebook from '@metafy/assets/svgs/social_facebook_button.svg';
  import Youtube from '@metafy/assets/svgs/social_youtube_button.svg';
  import Dribbble from '@metafy/assets/svgs/social_dribbble_button.svg';
  import ExternalSite from '@metafy/assets/svgs/social_external_site_button.svg';

  // TODO: Use this component in SocialLinks.svelte

  export let kind;
  export let social;

  const DETAILS = {
    twitter: {
      icon: Twitter,
      name: 'Twitter',
      url: 'https://twitter.com/'
    },
    twitch: {
      icon: Twitch,
      name: 'Twitch',
      url: 'https://twitch.tv/'
    },
    // TODO: Discord isn't a link, just something you copy.
    discord: {
      icon: Discord,
      name: 'Discord',
      url: 'https://'
    },
    instagram: {
      icon: Instagram,
      name: 'Instagram',
      url: 'https://instagram.com/'
    },
    facebook: {
      icon: Facebook,
      name: 'Facebook',
      url: 'https://facebook.com/'
    },
    youtube: {
      icon: Youtube,
      name: 'YouTube',
      url: 'https://youtube.com/'
    },
    dribbble: {
      icon: Dribbble,
      name: 'Dribbble',
      url: 'https://dribbble.com/'
    },
    external_site: {
      icon: ExternalSite,
      name: 'External site',
      url: ''
    }
  };

  function logClick(kind) {
    if (window.analytics) {
      window.analytics.track('Clicked Social Link', { kind });
    }
  }
</script>

<a
  class="social-icon {kind} h-9.5 xl:h-8 flex"
  href="{DETAILS[kind].url}{social}"
  rel="external noopener noreferrer"
  target="_blank"
  on:click={() => logClick(kind)}
>
  <svelte:component this={DETAILS[kind].icon} />
  <span class="social-text">{DETAILS[kind].name}</span>
</a>

<style>
  .social-icon {
    @apply bg-neutrals-d10 items-center justify-center w-full rounded;
    @apply transition-colors ease-in-out duration-200;
    border: 1px solid rgba(122, 161, 183, 0.16);

    & span.social-text {
      @apply hidden text-xs tracking-0.01 ml-3;
      color: #939dab;
    }

    &.twitter {
      & :global(svg) {
        width: 14px;
        height: 12px;
      }
      &:hover {
        @apply bg-brands-twitter;
      }
    }
    &.twitch {
      & :global(svg) {
        width: 14px;
        height: 14px;
      }
      &:hover {
        @apply bg-brands-twitch;
      }
    }
    &.discord {
      & :global(svg) {
        width: 17px;
        height: 12px;
      }
      &:hover {
        @apply bg-brands-discord;
      }
    }
    &.instagram {
      & :global(svg) {
        width: 13px;
        height: 13px;
      }
      &:hover {
        @apply bg-brands-instagram;
      }
    }
    &.facebook {
      & :global(svg) {
        width: 13px;
        height: 13px;
      }
      &:hover {
        @apply bg-brands-facebook;
      }
    }
    &.youtube {
      & :global(svg) {
        width: 17px;
        height: 12px;
      }
      &:hover {
        @apply bg-brands-youtube;
      }
    }
    &.dribbble {
      & :global(svg) {
        width: 14px;
        height: 14px;
      }
      &:hover {
        @apply bg-brands-dribbble;
      }
    }
    &.external {
      & :global(svg) {
        width: 14px;
        height: 14px;
      }
      &:hover {
        @apply bg-brands-metafy;
      }
    }
  }
</style>
