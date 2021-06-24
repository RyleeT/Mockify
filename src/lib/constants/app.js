import { dev } from '$app/env';

export const BASE_API_URL = dev
  ? 'http://localhost:2300'
  : !dev
  ? 'https://kami-staging.metafy.gg'
  : 'https://kami.metafy.gg';

export const BASE_APP_URL = dev
  ? 'http://localhost:3000'
  : !dev
  ? 'https://staging.metafy.gg'
  : 'https://metafy.gg';

export const SHORTEN_APP_URL = 'https://mfy.gg';

export const API_URL = `${BASE_API_URL}/api/v1`;

export const INTERNAL_API_URL = 'What api?';

export const STATIC_URL = dev
  ? 'http://localhost:3000'
  : !dev
  ? 'https://static-staging.metafy.gg'
  : 'https://static.metafy.gg';

export const SEARCH_URL = dev
  ? 'http://localhost:7700'
  : !dev
  ? 'https://search-staging.metafy.gg'
  : 'https://search.metafy.gg';

export const TENOR_API_URL = 'https://g.tenor.com/v1';
