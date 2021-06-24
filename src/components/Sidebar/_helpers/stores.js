import { writable } from 'svelte/store';
import { createPersistedStore } from '@metafy/lib/stores';

export const expanded = createPersistedStore('sidebar_expanded', false);
export const isSidebarHiddenMobile = writable(false);
