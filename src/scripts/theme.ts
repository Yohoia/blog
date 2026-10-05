import { THEME_STORAGE_KEY, type ThemePreference } from '@/config/theme';
import { motionTokens } from '@/config/motion';

let currentPreference: ThemePreference = 'system';
let initialized = false;

interface ThemeTransition {
  transition: ViewTransition;
  root: HTMLElement;
  update: () => void;
}

let activeTransition: ThemeTransition | undefined;

function stopThemeTransition(): void {
  const run = activeTransition;
  if (!run) return;
  // 快照尚未就绪时也提交已请求的主题，避免连续点击丢失切换。
  run.update();
  activeTransition = undefined;
  run.transition.skipTransition();
  run.root.style.removeProperty('--theme-transition-duration');
  run.root.style.removeProperty('--theme-transition-easing');
  run.root.style.removeProperty('--theme-transition-blur-start');
  run.root.style.removeProperty('--theme-transition-blur-middle');
  run.root.style.removeProperty('--theme-transition-blur-end');
  delete run.root.dataset.themeTransition;
}

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

function commitPreference(preference: ThemePreference): void {
  currentPreference = preference;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // 存储不可用时，当前会话内仍可切换主题。
  }
  applyTheme();
}

export function setThemePreference(preference: ThemePreference): void {
  stopThemeTransition();
  commitPreference(preference);
}

/** 仅主动点击播放；系统变化、语言切换与初次载入即时应用主题。 */
export async function toggleTheme(
  target?: Exclude<ThemePreference, 'system'>,
): Promise<void> {
  stopThemeTransition();
  const root = document.documentElement;
  const preference =
    target ?? (root.dataset.theme === 'dark' ? 'light' : 'dark');
  const nextTheme = preference === 'dark' ? 'dark' : 'light';
  if (root.dataset.theme === nextTheme) return;
  if (
    !document.startViewTransition ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.visibilityState !== 'visible'
  ) {
    commitPreference(preference);
    return;
  }

  let applied = false;
  const update = () => {
    if (applied) return;
    applied = true;
    commitPreference(preference);
  };
  root.dataset.themeTransition = '';
  root.style.setProperty(
    '--theme-transition-duration',
    `${motionTokens.theme.revealDuration}s`,
  );
  root.style.setProperty(
    '--theme-transition-easing',
    `cubic-bezier(${motionTokens.theme.revealEase.join(', ')})`,
  );
  root.style.setProperty(
    '--theme-transition-blur-start',
    `${motionTokens.theme.blur[0]}px`,
  );
  root.style.setProperty(
    '--theme-transition-blur-middle',
    `${motionTokens.theme.blur[1]}px`,
  );
  root.style.setProperty(
    '--theme-transition-blur-end',
    `${motionTokens.theme.blur[2]}px`,
  );

  const run: ThemeTransition = {
    root,
    transition: document.startViewTransition(update),
    update,
  };
  activeTransition = run;
  try {
    await run.transition.finished;
  } catch {
    // 快速连点、导航或浏览器跳过快照时，主题仍须正确应用。
    update();
  } finally {
    if (activeTransition === run) stopThemeTransition();
  }
}

export function initializeTheme(): void {
  if (initialized) return;
  initialized = true;
  currentPreference = readPreference();
  applyTheme();

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      stopThemeTransition();
      applyTheme();
    });
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      stopThemeTransition();
      currentPreference = readPreference();
      applyTheme();
    }
  });
  document.addEventListener('astro:after-swap', () => applyTheme());
  document.addEventListener('astro:before-preparation', stopThemeTransition);
  window.addEventListener('pagehide', stopThemeTransition);
  window.addEventListener('resize', stopThemeTransition);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') stopThemeTransition();
  });
  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', (event) => {
      if (event.matches) stopThemeTransition();
    });
}
