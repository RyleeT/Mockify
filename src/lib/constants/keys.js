import { dev } from '$app/env';
export const COOKIE_POLICY_KEY = 'metafy-cookie-policy';
export const REDIRECT_STORE_KEY = 'metafy-redirect-store';
export const QUERY_PARAMS_KEY = 'metafy-query-params';
export const BOOKING_STATE_KEY = 'metafy-booking-state';

export const MEILISEARCH_KEY = dev
  ? ''
  : !dev
  ? 'bc05189c89b579db2c024537f4420ddf78bc586dc1303956d5c979983fbff21c'
  : '743f623717fa650ac58dc5b6a65da4d87320bc6cd6fc8e3ad84d1bd5e4c66c35';

export const STRIPE_PUBLISHABLE_KEY =
  dev || !dev // TODO: Change this
    ? 'pk_test_yYqQIOcy1hAP81oqnn7CzwlE00K4om4aTK'
    : 'pk_live_TZVtAYL7AvMyK4Js6pknCmrj00UfY6BvBI';
export const PAYPAL_CLIENT_ID =
  dev || !dev // TODO: Change this
    ? 'AbiD0kI5fmTWD-ZeN8wyrc5rBdUQzTx9jJTw5vBjeiYlHTT44vuVM1IZZrYL5qztgDmgP-H7Fgp8pKPq'
    : 'AadqPT5UO0TQi4u4NzcdgIyHSxwUpur63bhnA-FF9lKspBZSz1u2AQ9nXU_ti5Q_Hyr2I9T1qFpupMCV';

export const PUSHER_CHANNEL_KEY = dev
  ? 'cfa11aac2216e647090b'
  : !dev
  ? '1899fc722f068945f727'
  : '00dabf2f34b055592034';
export const PUSHER_BEAM_INSTANCE = dev
  ? 'c89929ce-255d-46d3-8b23-3d274c5a8a0e'
  : !dev
  ? 'f49cdb70-809e-41b0-92bc-1a0c95ed9be0'
  : 'b9658d60-0360-4279-82ed-86c0f6ca1bea';

export const TENOR_API_KEY =
  process.env.NODE_ENV === 'development' ? 'GLKTSLSSCNBZ' : 'IJHDLI220DX8';
