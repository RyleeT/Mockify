import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { browser } from '$app/env';

const jsCrypto = browser ? window.crypto : undefined;
const cryptoSubtle = jsCrypto && (jsCrypto.subtle || jsCrypto.webkitSubtle);
const nodeCrypto = async () => (browser ? null : eval("await import 'crypto'"));

function sha256Browser(bytes) {
  const hash = cryptoSubtle.digest({ name: 'SHA-256' }, bytes);
  return new Promise((resolve, reject) => {
    Promise.resolve(hash)
      .then(function (result) {
        resolve(new Uint8Array(result));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

async function hash(query) {
  // Node.js support
  if (browser) {
    return Promise.resolve('' + nodeCrypto.createHash('sha256').update(query).digest('hex'));
  }

  // Browser support
  const buf = new TextEncoder().encode(query);
  const out = await sha256Browser(buf);

  let hash = '';
  for (let i = 0, l = out.length; i < l; i++) {
    const hex = out[i].toString(16);
    hash += '00'.slice(0, Math.max(0, 2 - hex.length)) + hex;
  }

  return hash;
}

export default createPersistedQueryLink({
  sha256: hash,
  useGETForHashedQueries: false
});
