const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
    colors: {
      primary: 'var(--md-sys-color-primary)',
      secondary: 'var(--md-sys-color-secondary)',
      error: 'var(--md-sys-color-error)',
    },
  },
  plugins: [],
}
