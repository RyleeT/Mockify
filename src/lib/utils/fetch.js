import { browser } from '$app/env';
import { get } from 'svelte/store';
import { afterLogout } from './logout';
import { authTokens, Toasts } from '../stores';
import { BASE_APP_URL } from '../constants';

// Use the fetch function for the specific environment context that we are in.
// eslint-disable-next-line @typescript-eslint/no-var-requires

/** Headers to pass to `fetch` */
let headers = { 'content-type': 'application/json' };
if (!browser) {
  // This unique header is used to bypass rate limiting when executing from our server
  // TODO: Anyway for us to forward the IP here? Need to get request object from server somehow.
  headers = { ...headers, 'x-metafy-client': 1 };
}

let refreshInFlight = false;
/**
 * Refresh the JWT token for the authenticated user.
 * @returns {Promise<void>}
 */
export async function refreshToken() {
  // If another request is attempting to refresh the authentication token then
  // wait for it to finish.
  if (refreshInFlight) {
    await new Promise((resolve) => {
      // Check every 50ms if the request has finished.
      setInterval(() => {
        if (!refreshInFlight) {
          resolve();
        }
      }, 50);
    });
    // return as we don't want to refresh an already refreshed token. We can
    // to the original context as the auth tokens have been updated.
    return;
  }

  try {
    refreshInFlight = true;
    const { access_token, refresh_token } = get(authTokens);
    const response = await fetch(`${BASE_APP_URL}/auth/proxy/refresh.json`, {
      method: 'post',
      body: JSON.stringify({ refresh_token }),
      headers: { ...headers, authorization: `Bearer ${access_token}` }
    });

    // Request failed. Reset the session and throw an error
    if (response.status >= 400) {
      authTokens.set({});
      throw new Error('Unauthenticated');
    }

    // Success! 🚀 Update the tokens in our global store.
    const json = await response.json();
    authTokens.set({
      access_token: json.access_token,
      refresh_token: json.refresh_token
    });
  } catch (error) {
    // Unknown error?
    if (error.message !== 'Unauthenticated') {
      console.error(error);
    }
    throw error;
  } finally {
    refreshInFlight = false;
  }
}

/**
 * Fetch proxy that handles refreshing an invalid auth token, and rate limiting.
 * @param {string} endpoint - Endpoint to fetch.
 * @param {object} [options={}] - Options to pass to the internal fetch function.
 * @returns {Promise<Response>}
 */
export async function customFetch(endpoint, options = {}) {
  const fetchHeaders = { ...headers, ...options.headers };
  const { access_token } = get(authTokens);

  // add authorization header
  if (!fetchHeaders.authorization && access_token) {
    fetchHeaders.authorization = `Bearer ${access_token}`;
  }

  // Do the request!
  const response = await fetch(endpoint, {
    ...options,
    headers: fetchHeaders
  });

  if (response.status >= 400) {
    try {
      // Attempt to refresh our access_token if we have an expired one.
      // Clone the response so we don't consume the buffer on the original
      // that we will return to the caller.
      const clone = response.clone();
      const text = await clone.text();
      if (text.includes('expired JWT access token')) {
        // Refresh our access token and retry the request
        await refreshToken();
        return fetch(endpoint, options);
      }
    } catch (error) {
      if (browser && error.message === 'Unauthenticated') {
        afterLogout();
        return window.location.assign('/auth/account/login');
      } else {
        console.error(error);
      }
      return response;
    }
  } else if (response.status === 429) {
    // Handle rate limit
    Toasts.push({
      kind: 'attention',
      content:
        "You've been rate limited by our API. Please wait a few minutes and try again."
    });
  }

  // It was a good response! 🔥
  return response;
}
