import path from 'path';
import preprocess from 'svelte-preprocess';
import svg from '@netulip/rollup-plugin-svg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svg'],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      defaults: { style: 'postcss' },
      postcss: true
    })
  ],

  kit: {
    // hydrate the <div id="mockify-app"> element in src/app.html
    target: '#mockify-app',
    vite: {
      plugins: [svg.default({ enforce: 'pre' })],
      resolve: {
        alias: {
          '@metafy': path.resolve('./src')
        }
      }
    }
  }
};

export default config;
