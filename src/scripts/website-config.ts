import { initializeLanguageNavigation } from '@/scripts/language';
import { toggleTheme } from '@/scripts/theme';

let initialized = false;

/** 首页 website config 提供语言与明暗模式入口；语言仍是 URL 驱动的普通链接。 */
export function registerWebsiteConfig(): void {
  initializeLanguageNavigation();
  if (initialized) return;
  initialized = true;

  const syncThemeState = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    document
      .querySelectorAll<HTMLButtonElement>('[data-website-theme]')
      .forEach((button) => {
        const isDarkOption = button.dataset.websiteTheme === 'dark';
        button.setAttribute('aria-pressed', String(isDarkOption === dark));
      });
  };

  document.addEventListener('theme:change', syncThemeState);
  document.addEventListener('astro:page-load', syncThemeState);
  syncThemeState();

  document.addEventListener('click', (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
      '[data-website-theme]',
    );
    if (!button || button.disabled) return;
    const preference = button.dataset.websiteTheme;
    if (preference !== 'light' && preference !== 'dark') return;
    void toggleTheme(preference);
  });
}
