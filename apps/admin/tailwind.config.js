const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      // Essential
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // Angular Material M3 tokens
      primary: {
        DEFAULT: 'var(--mat-sys-primary)',
        container: 'var(--mat-sys-primary-container)',
        on: 'var(--mat-sys-on-primary)',
      },
      secondary: {
        DEFAULT: 'var(--mat-sys-secondary)',
        container: 'var(--mat-sys-secondary-container)',
        on: 'var(--mat-sys-on-secondary)',
      },
      surface: {
        DEFAULT: 'var(--mat-sys-surface)',
        container: 'var(--mat-sys-surface-container)',
        dim: 'var(--mat-sys-surface-dim)',
        bright: 'var(--mat-sys-surface-bright)',
      },
      outline: {
        DEFAULT: 'var(--mat-sys-outline)',
        variant: 'var(--mat-sys-outline-variant)',
      },
      background: 'var(--mat-sys-surface)',

      // Text colors from M3
      muted: 'var(--mat-sys-on-surface-variant)',

      // Semantic colors
      error: {
        DEFAULT: 'var(--mat-sys-error)',
        container: 'var(--mat-sys-error-container)',
        on: 'var(--mat-sys-on-error-container)',
      },
      warning: {
        DEFAULT: 'var(--app-warning)',
        container: 'var(--app-warning-container)',
        on: 'var(--app-on-warning-container)',
      },
      success: {
        DEFAULT: 'var(--app-success)',
        container: 'var(--app-success-container)',
        on: 'var(--app-on-success-container)',
      },
    },
  },
  plugins: [],
}
