// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://keboss11.github.io',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
