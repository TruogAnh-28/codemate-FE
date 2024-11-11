const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{vue,ts}',
    './components/**/*.{vue,ts}',
    './app/**/*.{vue,ts}',
    './src/**/*.{vue,ts}',
  ],
  theme: {
    extend: {
      zIndex:{
        '-10': '-1'
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
      colors: {
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-variant': 'hsl(var(--primary-variant) / <alpha-value>)',
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        'secondary-variant': 'hsl(var(--secondary-variant) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        'on-primary': 'hsl(var(--on-primary) / <alpha-value>)',
        'on-secondary': 'hsl(var(--on-secondary) / <alpha-value>)',
        'on-background': 'hsl(var(--on-background) / <alpha-value>)',
        'on-surface': 'hsl(var(--on-surface) / <alpha-value>)',
        'on-error': 'hsl(var(--on-error) / <alpha-value>)',

        // Additional colors
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)',
        'text-tetiary': 'hsl(var(--text-tetiary) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
      }
    }
  },
  plugins: []
};

module.exports = config;
