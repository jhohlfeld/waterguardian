import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import tailwindcssRadixColors from 'tailwindcss-radix-colors'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [typography, tailwindcssRadixColors],
}
export default config
