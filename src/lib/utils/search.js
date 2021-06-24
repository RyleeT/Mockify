import { browser } from '$app/env';
import { MeiliSearch } from 'meilisearch';
import { SEARCH_URL, MEILISEARCH_KEY } from '../constants';

const MAX_RETRY_ATTEMPTS = 2;
let retryAttempts = 0;
let client;

/**
 * @param {string} index - The index to search
 * @param {string} query - The search query
 * @param {object} options - Search filter options
 * @returns {object} Search results
 */
export async function searchIndex(index, query = '', options = {}) {
  try {
    if (!browser) {
      throw new Error('Search can only be invoked from the browser');
    }

    if (!index) {
      throw new Error('Must provide an index');
    }

    if (!client) {
      client = new MeiliSearch({ host: SEARCH_URL, apiKey: MEILISEARCH_KEY });
    }

    try {
      return client.index(index).search(query, options);
    } catch (error) {
      // Search server was unreachable for some reason. Retry the search again.
      if (error?.type === 'MeiliSearchCommunicationError') {
        if (retryAttempts < MAX_RETRY_ATTEMPTS) {
          retryAttempts += 1;
          const value = await searchIndex(index, query, options);
          if (value) {
            retryAttempts = 0;
            return value;
          }
        }
      } else {
        console.error(error, { extra: { retryAttempts } });
      }
    } finally {
      retryAttempts = 0;
    }
  } catch (error) {
    if (!error?.message?.includes?.('Operation not supported')) {
      console.error(error);
    }
    return {};
  }
}
