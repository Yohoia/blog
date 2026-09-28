import { THEME_STORAGE_KEY, type ThemePreference } from '../config/theme';

let currentPreference: ThemePreference = 'system';
let initialized = false;

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return currentPreference;
  }
}

export function applyTheme(
  preference: ThemePreference = currentPreference,
): void {
  const dark =
    preference === 'dark' ||
    (preference === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(
    new CustomEvent('theme:change', { detail: { preference, theme } }),
  );
}

export function getThemePreference(): ThemePreference {
  return currentPreference;
}

export function setThemePreference(preference: ThemePreference): void {
  currentPreference = preference;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // 存储不可用时，当前会话内仍可切换主题。
  }
  applyTheme();
}

export function initializeTheme(): void {
  if (initialized) return;
  initialized = true;
  currentPreference = readPreference();
  applyTheme();

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => applyTheme());
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      currentPreference = readPreference();
      applyTheme();
    }
  });
  document.addEventListener('astro:after-swap', () => applyTheme());
}
