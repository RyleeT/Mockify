import { from, ApolloClient, gql } from '@apollo/client/core';
import { readable } from 'svelte/store';
import { BASE_APP_URL } from '../constants';
import cache from './cache';
import errorLink from './error';
import httpLink from './http';
import persistedLink from './persisted';

// Config for ApolloClient v3.
// TODO:
//    - Enable Persistent Queries (Build step)
const client = new ApolloClient({
  name: 'metafy-client',
  version: '2.0',
  cache,
  queryDeduplication: process.browser,
  link: from([errorLink, persistedLink, httpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: process.browser ? 'cache-first' : 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: process.browser ? 'cache-first' : 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Local wrapper of Apollo query so we can convert the ObservableQuery into a
// Svelte readable store and also handle SSR/Client hydration decently.
export function query(options = {}) {
  // Extract passed in data from the options object.
  const { data } = options;
  delete options.data;

  if (process.browser) {
    // We're in the browser, so it's likely that we have preload data passed in
    // that we want to write to apollo's cache for future queries.
    if (data) {
      client.writeQuery({ ...options, data });
    }
    // ... fall through
  } else {
    // If we're in the server context (SSR) then we can just return a readable
    // store that wraps the data returned from the preload function directly (if
    // it exists). We don't want to run a query that won't resolve by the time
    // the response is sent to the client.
    return readable({ data, loading: false, error: null, query: null }, () => {});
  }

  // Watch the query and subscribe to the result in a readable svelte store
  const observable = client.watchQuery({ ...options });
  return readable({ data: data || null, loading: !data, error: null, query: observable }, set => {
    const subscription = observable.subscribe(value => {
      set({ ...value, query: observable });
    });
    return () => subscription.unsubscribe();
  });
}

// Local wrapper of Apollo mutation
export function mutate(options = {}) {
  return client.mutate({ ...options });
}

export { client, cache, gql };
