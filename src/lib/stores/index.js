import { writable } from 'svelte/store';
import { QUERY_PARAMS_KEY, BOOKING_STATE_KEY } from '../constants';

import { createRemovableStore } from './removable';
import { createPersistedStore } from './persisted';
export { createRemovableStore, createPersistedStore };

/**
 * @typedef {object} ToastAction
 * @property {string} content - Content of the toast action
 * @property {function} func - Function to execute on action click
 */
/**
 * @typedef {object} Toast
 * @property {'info' | 'attention' | 'error' | 'success'} kind - The kind of
 * Toast to display
 * @property {string} content - The content of the Toast
 * @property {'left' | 'right' | 'center'} placement - The placement of the Toast
 * @property {[ToastAction]} actions - Actions to be included on the Toast
 * @property {function} onClose - Function to run when the Toast is closed.
 */
/** @type {Writable<Toast>} */
export const Toasts = createRemovableStore();

// Token store. This holds the users `access_token` & `refresh_token`.
export const authTokens = writable({});

// Pusher
export const pusherChannel = writable(null);
export const pusherBeam = writable(null);
export const onlineUsers = writable([]);

// Bookins
export const booking = writable({
  liveBookings: [],
  replayBookings: [],
  payment: { totalCents: 0 }
});

// Chat
export const chatState = writable({
  instance: null,
  enabled: true,
  participants: {},
  conversation: null,
  expanded: false,
  hasUnread: false
});

// Dashboard Sidebar
export const dashboardState = writable({
  selectedTeamId: null,
  mobileVisible: false,
  sidebarIsExpanded: true
});
export const dashboardType = writable(null);

// Promo codes
export const promoCode = createPersistedStore('mfy_promo_code', null);
