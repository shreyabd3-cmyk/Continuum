export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Wire the fluid type scale from styles.css into Tailwind's text-* utilities.
      // First value: font-size (references the CSS variables defined in :root).
      // Second value: line-height (pulled from the semantic .t-* classes in styles.css).
      fontSize: {
        sm:   ['var(--t-sm)',   { lineHeight: '1.5'  }],   // 13px fixed · body small
        base: ['var(--t-body)', { lineHeight: '1.5'  }],   // 16 → 17 fluid · .t-body
        lg:   ['var(--t-lg)',   { lineHeight: '1.55' }],   // 20 → 21.76 fluid · .t-body-lg
        xl:   ['var(--t-xl)',   { lineHeight: '1.3'  }],   // 20 → 21.76 fluid · .t-h4
        '2xl':['var(--t-2xl)',  { lineHeight: '1.25' }],   // 25 → 27.85 fluid · .t-h3
        '3xl':['var(--t-3xl)',  { lineHeight: '1.25' }],   // 25 → 27.85 fluid · .t-h3 alias
        '4xl':['var(--t-4xl)',  { lineHeight: '1.15' }],   // 31.25 → 35.65 fluid · .t-h2
        '5xl':['var(--t-5xl)',  { lineHeight: '1.1'  }],   // 39.06 → 45.63 fluid · .t-h1
        '6xl':['var(--t-6xl)',  { lineHeight: '1.1'  }],   // 39.06 → 45.63 fluid · .t-h1 alias
      },
    },
  },
  plugins: [],
}
