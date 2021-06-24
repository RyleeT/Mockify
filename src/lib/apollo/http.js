import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { API_URL, INTERNAL_API_URL } from '../constants';
import { fetch } from '../utils';

const httpLink = new BatchHttpLink({
  uri: process.browser ? `${API_URL}/graphql` : `${INTERNAL_API_URL}/graphql`,
  fetch,
  includeExtensions: true,
  batchMax: process.browser ? 10 : 1,
});

export default httpLink;
