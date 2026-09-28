import { localeMetadata, type Locale } from '@/config/i18n';
import { siteConfig } from '@/config/site';
import {
  errorActions,
  errorPages,
  type ErrorCode,
} from '@/features/errors/config';

let initialized = false;

/** 静态托管常把所有未知地址交给同一份 404.html，根据实际 URL 补齐语言。 */
function syncErrorPage(doc: Document, pathname: string): void {
  const page = doc.querySelector<HTMLElement>('[data-error-code]');
  if (!page) return;
  const code = Number(page.dataset.errorCode);
  const isErrorCode = (value: number): value is ErrorCode =>
    value in errorPages;
  if (!isErrorCode(code)) return;

  const locale: Locale = /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'zh';
  const home = locale === 'en' ? '/en/' : '/';
  const content = errorPages[code].content[locale];
  const title = `${code} · ${content.heading} | ${siteConfig.name}`;

  doc.documentElement.lang = localeMetadata[locale].language;
  doc.title = title;
  for (const selector of [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
  ])
    doc.querySelector(selector)?.setAttribute('content', title);
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ])
    doc.querySelector(selector)?.setAttribute('content', content.description);
  doc
    .querySelector('meta[property="og:locale"]')
    ?.setAttribute('content', localeMetadata[locale].ogLocale);

  const setText = (selector: string, value: string) => {
    const element = doc.querySelector(selector);
    if (element) element.textContent = value;
  };
  setText('[data-error-heading]', content.heading);
  setText('[data-error-description]', content.description);
  setText('[data-error-home-label]', errorActions[locale].home);
  page
    .querySelector('[data-error-illustration]')
    ?.setAttribute('alt', `${code} · ${content.heading}`);
  page.querySelector('[data-error-home]')?.setAttribute('href', home);
}

export function initializeErrorPage(): void {
  if (initialized) return;
  initialized = true;
  document.addEventListener('astro:before-swap', (event) => {
    syncErrorPage(event.newDocument, event.to.pathname);
  });
  document.addEventListener('astro:page-load', () => {
    syncErrorPage(document, window.location.pathname);
  });
  syncErrorPage(document, window.location.pathname);
}
