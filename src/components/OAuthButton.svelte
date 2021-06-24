<script>
  import { getContext, onDestroy, createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    DISCORD_AUTH_URL,
    TWITCH_AUTH_URL,
    GOOGLE_AUTH_URL,
    AVAILABLE_EXTERNALS,
    API_URL,
    APPLE_CLIENT_ID,
    APPLE_SCOPES,
    APPLE_REDIRECT
  } from '@metafy/lib/constants';
  import { Toasts } from '@metafy/lib/stores';
  import { fetch, includeScript } from '@metafy/lib/utils';
  import { doWork, authenticateWithAPI } from '@metafy/routes/auth/external/[...provider].svelte';
  import { captureException } from '@sentry/browser';

  import Discord from '@metafy/assets/svgs/discord.svg';
  import Twitch from '@metafy/assets/svgs/twitch.svg';
  import Google from '@metafy/assets/svgs/google.svg';
  import Apple from '@metafy/assets/svgs/apple.svg';
  import PayPal from '@metafy/assets/svgs/paypal.svg';
  import Button from './Button.svelte';

  export let provider;
  export let providerParams = [];
  export let redirect;
  export let type = 'login';
  export let accountId = null;
  export let border = undefined;
  export let rounded = undefined;
  export let disabled = false;
  let className = '';
  export { className as class };
  export let transparent = false;

  const dispatch = createEventDispatcher();
  const { refreshSession } = getContext('app');
  let loading = false;
  let popup = null;
  let isWindowOpen = false;

  async function includeAppleJS() {
    try {
      await includeScript(
        'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
      );
    } catch (error) {
      // ...
    }
  }

  async function handleMessage(event) {
    if (!event.data || !event.data.provider) {
      return;
    }

    const { type, provider, status, data } = event.data;
    if (popup) {
      popup.close();
    }

    // 🎉  We got in!!!
    if (status === 'success') {
      if (type !== 'connect') {
        await refreshSession(data.access_token, data.refresh_token);
      }
      if (redirect) {
        return await goto(redirect);
      }
      dispatch('success');
      return;
    }

    // Some kind of failure.. ❌
    Toasts.push({
      kind: data.kind || 'error',
      duration: 0,
      content: data.content,
      actions: data.actions || undefined
    });
    dispatch('error');
  }

  export async function onClick() {
    // Disconnection doesn't require going off-platform
    if (type === 'disconnect') {
      try {
        const body = { provider };
        // There can be multiple google accounts so we need an extra param on the body
        if (provider === 'google') {
          body.google_id = accountId;
        }

        const response = await fetch(`${API_URL}/oauth/disconnect`, {
          method: 'post',
          body: JSON.stringify(body)
        });

        // Good response?
        if (response.status >= 400) {
          throw new Error(response.status);
        }

        const { status } = await response.json();
        if (status === 'no-authentication') {
          throw new Error(status);
        }

        // Exit out
        return;
      } catch (error) {
        if (error.message !== 'no-authentication') {
          captureException(error);
        }
        return;
      }
    }

    // Off to {provider} we go! 🚀
    let endpoint;
    switch (provider) {
      case 'discord':
        endpoint = DISCORD_AUTH_URL(type);
        break;
      case 'twitch':
        endpoint = TWITCH_AUTH_URL(type);
        break;
      case 'google':
        endpoint = GOOGLE_AUTH_URL(type, ...providerParams);
        break;
      case 'apple':
        // Apple is unique! 🤪
        await includeAppleJS();
        if (window.AppleID) {
          window.AppleID.auth.init({
            clientId: APPLE_CLIENT_ID,
            scope: APPLE_SCOPES,
            redirectURI: APPLE_REDIRECT(type),
            state: `mfy-web-oauth-${type}`,
            usePopup: true
          });
          try {
            const data = await window.AppleID.auth.signIn();
            const response = await doWork({
              params: { provider: ['apple', type] },
              query: { code: data['authorization']['id_token'], user: data['user'] }
            });
            await handleMessage({ data: response });
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error(error);
            }
            Toasts.push({
              kind: 'error',
              content: 'There was an issue with Sign in with Apple'
            });
          }
        } else {
          Toasts.push({
            kind: 'error',
            content: 'There was an issue with Sign in with Apple'
          });
        }
        break;
      default:
        break;
    }
    if (endpoint) {
      popup = window.open(
        endpoint,
        `${provider}_metafy_oauth`,
        'resizable,scrollbars,status,width=400,height=600'
      );
      window.addEventListener('message', handleMessage, false);
    }
  }

  onDestroy(() => {
    if (popup) {
      window.removeEventListener('message', handleMessage);
      popup.close();
    }
  });

  $: providerComponent =
    provider === 'discord'
      ? Discord
      : provider === 'twitch'
      ? Twitch
      : provider === 'google'
      ? Google
      : provider === 'apple'
      ? Apple
      : PayPal;
  // We have to explicitly reference the class names so they don't get purged.
  $: providerKlass = transparent
    ? provider === 'discord'
      ? 'bg-transparent hover:bg-brands-discord'
      : provider === 'twitch'
      ? 'bg-transparent hover:bg-brands-twitch'
      : provider === 'google'
      ? 'bg-transparent hover:bg-brands-google'
      : provider === 'apple'
      ? 'bg-transparent hover:bg-brands-apple'
      : 'bg-transparent hover:bg-brands-paypal'
    : provider === 'discord'
    ? 'bg-brands-discord hover:bg-brands-discord'
    : provider === 'twitch'
    ? 'bg-brands-twitch hover:bg-brands-twitch'
    : provider === 'google'
    ? 'bg-brands-google hover:bg-brands-google'
    : provider === 'apple'
    ? 'bg-brands-apple hover:bg-brands-apple'
    : 'bg-brands-paypal hover:bg-brands-paypal';
</script>

<Button
  class="{provider} {providerKlass} {className} oauth-button group flex justify-center items-center"
  {border}
  {rounded}
  {disabled}
  {loading}
  padding=""
  size="h-14"
  on:click={onClick}
>
  <svelte:component
    this={providerComponent}
    class="w-4 sm:w-6 h-4 sm:h-6 transition-transform text-white transform duration-200 group-hover:-translate-y-1"
  />
</Button>
