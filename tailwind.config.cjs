const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles');

const config = {
  mode: 'aot',
  purge: {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    options: {
      defaultExtractor: (content) => [
        // If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        )
      ]
    },
    safelist: [/^svelte-[\d\w]+$/]
  },
  theme: {
    extend: {
      colors: {
        brands: {
          discord: 'rgba(114,137,218)',
          metafy: 'rgba(184,47,54)',
          'metafy-alt': 'rgba(255, 190, 176)'
        },
        functional: {
          b10: 'rgba(125,193,244)',
          g20: 'rgba(23,202,105)',
          r10: 'rgba(219,58,58)',
          r20: 'rgba(190,52,52)',
          r50: 'rgba(241,67,67)'
        },
        neutrals: {
          d00: 'rgba(33,37,42)',
          d10: 'rgba(24,26,30)',
          d20: 'rgba(26,30,35)',
          d30: 'rgba(3,4,4)',
          d60: 'rgba(33,36,42)',
          l00: 'rgba(255,255,255)',
          l30: 'rgba(130,147,164)',
          l40: 'rgba(121,134,148)',
          l50: 'rgba(142,148,154)',

          // TODO: Find out correct names for these colors, current ones are arbitrary

          d01: 'rgba(26, 29, 37)',
          d02: 'rgba(38, 43, 57)',
          d03: 'rgba(17, 18, 22)',
          l01: 'rgba(109, 129, 153)',
          l02: 'rgba(164, 173, 172)',
          l03: 'rgba(87, 105, 126)'
        }
      },
      // Please don't judge me for these quick and dirty increments hahaha
      fontSize: {
        xxs: '.6rem',
        tiny: '.6875rem',
        '2.5xl': '1.75rem',
        '3.5xl': '2rem'
      },
      letterSpacing: {
        0.01: '.01em',
        0.02: '.02em',
        0.08: '.08em',
        0.12: '.12em'
      },
      lineHeight: {
        5.6: '1.4rem',
        7.8: '1.95rem',
        9.75: '2.4375rem',
        10.5: '2.625rem',
        12: '3rem',
        13: '3.5rem'
      },
      maxHeight: {
        '9/10': '90%'
      },
      maxWidth: {
        '9/20': '45%'
      },
      opacity: {
        15: '0.15',
        35: '0.35',
        65: '0.65'
      },
      screens: {
        xs: { max: '639px' }
      },
      spacing: {
        8.5: '2.125rem',
        29: '7.25rem'
      },
      zIndex: {
        1: 1,
        2: 2,
        'guest-navbar': 5,
        10: 10,
        sidebar: 41,
        49: 49,
        'modal-backdrop': 50,
        modal: 60,
        60: 60,
        toast: 10000
      }
    }
  },
  variants: {
    extend: { zIndex: ['hover'] }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};

module.exports = config;
