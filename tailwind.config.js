/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── CSS-variable-driven brand colors ──────────────────────
        // Change the values in app/globals.css (:root) to rebrand.
        bg:      'var(--c-bg)',       // page background
        surface: 'var(--c-surface)',  // section background (alt rows)
        card:    'var(--c-card)',     // card background
        accent:  'var(--c-accent)',   // primary CTA colour
        'accent-dark': 'var(--c-accent-dark)',
        gold:    'var(--c-gold)',     // secondary accent
        muted:   'var(--c-muted)',    // body / secondary text
        // ── Legacy aliases (kept so admin page still works) ───────
        navy: {
          DEFAULT: '#0F1E3C',
          light:   '#162248',
          dark:    '#091428',
        },
        'brand-red': '#C0392B',
      },
      fontFamily: {
        sans:  ['var(--font-inter)',     'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)',  'Georgia',   'serif'],
      },
      borderColor: {
        DEFAULT: 'var(--c-border)',
      },
    },
  },
  plugins: [],
}
