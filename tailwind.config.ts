import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssRadixColors from 'tailwindcss-radix-colors'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          a1: 'var(--gray-a1)',
          a2: 'var(--gray-a2)',
          a3: 'var(--gray-a3)',
          a4: 'var(--gray-a4)',
          a5: 'var(--gray-a5)',
          a6: 'var(--gray-a6)',
          a7: 'var(--gray-a7)',
          a8: 'var(--gray-a8)',
          a9: 'var(--gray-a9)',
          a10: 'var(--gray-a10)',
          a11: 'var(--gray-a11)',
          a12: 'var(--gray-a12)',
        },
        gray: {
          1: 'var(--gray-1)',
          2: 'var(--gray-2)',
          3: 'var(--gray-3)',
          4: 'var(--gray-4)',
          5: 'var(--gray-5)',
          6: 'var(--gray-6)',
          7: 'var(--gray-7)',
          8: 'var(--gray-8)',
          9: 'var(--gray-9)',
          10: 'var(--gray-10)',
          11: 'var(--gray-11)',
          12: 'var(--gray-12)',
        },
        accent: {
          1: 'var(--accent-1)',
          2: 'var(--accent-2)',
          3: 'var(--accent-3)',
          4: 'var(--accent-4)',
          5: 'var(--accent-5)',
          6: 'var(--accent-6)',
          7: 'var(--accent-7)',
          8: 'var(--accent-8)',
          9: 'var(--accent-9)',
          10: 'var(--accent-10)',
          11: 'var(--accent-11)',
          12: 'var(--accent-12)',
        },
      },
      spacing: {
        header: '60px',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--gray-12)',
            '--tw-prose-headings': 'var(--gray-12)',
            '--tw-prose-lead': 'var(--gray-8)',
            '--tw-prose-links': 'var(--accent-a11)',
            '--tw-prose-bold': 'var(--gray-12)',
            '--tw-prose-counters': 'var(--gray-12)',
            '--tw-prose-bullets': 'var(--gray-11)',
            '--tw-prose-hr': 'var(--gray-4)',
            '--tw-prose-quotes': 'var(--gray-12)',
            '--tw-prose-quote-borders': 'var(--gray-4)',
            '--tw-prose-captions': 'var(--gray-8)',
            '--tw-prose-code': 'var(--accent-a11)',
            '--tw-prose-pre-code': 'var(--gray-2)',
            '--tw-prose-pre-bg': 'var(--gray-9)',
            '--tw-prose-th-borders': 'var(--gray-4)',
            '--tw-prose-td-borders': 'var(--gray-3)',
          },
        },
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [typography, tailwindcssRadixColors, tailwindcssAnimate],
}
export default config
