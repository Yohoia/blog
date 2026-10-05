// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { i18nConfig } from './src/config/i18n.ts';

/** @type {import('vite').Plugin} */
const dependencyCache = {
  name: 'yohoia:dependency-cache',
  config(config, { command }) {
    // Astro check / sync 的临时 Vite 服务不能改写正在使用的浏览器依赖。
    const scope =
      command === 'serve' && !config.server?.middlewareMode ? 'dev' : 'tooling';
    return {
      cacheDir: fileURLToPath(
        new URL(`./node_modules/.vite/${scope}/`, import.meta.url),
      ),
    };
  },
};

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
  // 站内链接不带尾斜杠；仍接受两种输入，保证未知地址进入自定义 404。
  trailingSlash: 'ignore',
  redirects: {
    '/projects': '/project',
    '/skills': '/skill',
    '/en/projects': '/en/project',
    '/en/skills': '/en/skill',
  },
  i18n: i18nConfig,
  integrations: [
    react(),
    mdx(),
    ...(site
      ? [
          sitemap({
            // 错误页和设计预览可直接访问，但不提交给搜索引擎。
            filter: (page) =>
              !/^\/(?:en\/)?[45]\d{2}\/?$/.test(new URL(page).pathname) &&
              !/^\/footer-explorer\/?$/.test(new URL(page).pathname) &&
              !/^\/design-explorations(?:\/|$)/.test(new URL(page).pathname),
          }),
        ]
      : []),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  vite: {
    plugins: [tailwindcss(), dependencyCache],
    // 提前预构建动画入口，避免首页加载中发现新依赖使缓存失效。
    optimizeDeps: {
      include: ['motion', 'motion/mini'],
    },
  },
});
