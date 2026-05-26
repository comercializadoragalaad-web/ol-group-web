export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        black:          '#0A0A0A',
        gold:           '#C9A027',
        'gold-light':   '#DDB94A',
        cream:          '#FAF6EE',
        carbon:         '#1C1C1C',
        'carbon-light': '#2A2A2A',
        muted:          '#9B9080',
        success:        '#4CAF50',
        error:          '#E53E3E',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
