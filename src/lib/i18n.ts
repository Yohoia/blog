import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '@/config/i18n';

/** URL 决定语言，刷新与普通链接跳转无需客户端翻译或存储。 */
export function getLocale(pathname: string): Locale {
  return /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'zh';
}

export function unlocalizedPath(pathname: string): string {
  const path = pathname.replace(/^\/en(?:\/|$)/, '/');
  return `${path.replace(/\/+$/, '')}/`;
}

export function localizePath(pathname: string, locale: Locale): string {
  return getRelativeLocaleUrl(
    locale,
    unlocalizedPath(pathname).replace(/^\/|\/$/g, ''),
  );
}
