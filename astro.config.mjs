// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { i18nConfig } from './src/config/i18n.ts';

const { SITE_URL } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);
const site = SITE_URL?.trim() || undefined;

if (site) {
  const url = new URL(site);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'SITE_URL must be an HTTP(S) origin, for example https://your-domain.com.',
    );
  }
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  i18n: i18nConfig,
  integrations: [react(), mdx(), ...(site ? [sitemap()] : [])],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
