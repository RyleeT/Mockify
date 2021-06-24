import { browser } from '$app/env';
import { get } from 'svelte/store';
import { pusherBeam } from '../stores';

// This function is run after the logout button has been clicked and just before
// we reload the browser for a clean slate.
export function afterLogout() {
  if (browser) {
    // Analytics
    if (window.analytics) {
      window.analytics.track('Logged Out');
      window.analytics.reset();
    }

    // Intercom
    if (window.Intercom) {
      window.Intercom('shutdown');
    }

    // Stop Push Notifications for this user
    const pushClient = get(pusherBeam);
    if (pushClient) {
      pushClient.stop().catch((error) => {
        console.error(error);
      });
    }
  }
}
