const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--mat-sys-primary)',
          container: 'var(--mat-sys-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--mat-sys-secondary)',
          container: 'var(--mat-sys-secondary-container)',
        },
        error: {
          DEFAULT: 'var(--mat-sys-error)',
          container: 'var(--mat-sys-error-container)',
        },
        surface: {
          DEFAULT: 'var(--mat-sys-surface)',
          container: 'var(--mat-sys-surface-container)',
          dim: 'var(--mat-sys-surface-dim)',
        },
        outline: 'var(--mat-sys-outline)',
      },
    },
  },
  plugins: [],
}
