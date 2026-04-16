export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
        },
        aqua: '#22d3ee',
        skysoft: '#60a5fa',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(34, 211, 238, 0.15)',
      },
    },
  },
  plugins: [],
};
