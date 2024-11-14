const config = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  darkMode: ['class'],
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
    fontFamily: {
      sans: ["Public Sans", 'sans-serif'],
      mono: ['Public Sans Mono', 'monospace']
    },
    borderRadius: {
      full: '100%',
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' }
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' }
      }
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out'
    },
    extend: {
      zIndex:{
        '-10': '-1'
      },
      fontSize: {
        'heading-1': '3rem',    // 48px
        'heading-2': '2.5rem',  // 40px
        'heading-3': '2rem',    // 32px
        'heading-4': '1.5rem',  // 24px
        'body-large-1': '1.25rem', // 20px Bold
        'body-large-2': '1.25rem', // 20px Semibold
        'body-large-3': '1.25rem', // 20px Medium
        'body-large-4': '1.25rem', // 20px Regular
        'body-base-1': '1rem',     // 16px Bold
        'body-base-2': '1rem',     // 16px Semibold
        'body-base-3': '1rem',     // 16px Medium
        'body-base-4': '1rem',     // 16px Regular
        'body-small-1': '0.75rem', // 12px Bold
        'body-small-2': '0.75rem', // 12px Semibold
        'body-small-3': '0.75rem', // 12px Medium
        'body-small-4': '0.75rem', // 12px Regular
        'body-xs-1': '0.625rem',   // 10px Bold
        'body-xs-2': '0.625rem',   // 10px Semibold
        'body-xs-3': '0.625rem',   // 10px Medium
        'body-xs-4': '0.625rem',   // 10px Regular
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
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)', // Black
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)', // White
        'text-tetiary': 'hsl(var(--text-tetiary) / <alpha-value>)', // Light-gray
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

module.exports = config;
