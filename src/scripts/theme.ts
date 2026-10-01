import { THEME_STORAGE_KEY, type ThemePreference } from '@/config/theme';
import { motionTokens } from '@/config/motion';
import { NativeAnimation } from 'motion';

let currentPreference: ThemePreference = 'system';
let initialized = false;

interface ThemeTransition {
  transition: ViewTransition;
  root: HTMLElement;
  update: () => void;
  animations: NativeAnimation<string>[];
}

let activeTransition: ThemeTransition | undefined;

function stopThemeTransition(): void {
  const run = activeTransition;
  if (!run) return;
  // 快照尚未就绪时也提交已请求的主题，避免连续点击丢失切换。
  run.update();
  activeTransition = undefined;
  run.transition.skipTransition();
  for (const animation of run.animations) animation.cancel();
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
export async function toggleTheme(): Promise<void> {
  stopThemeTransition();
  const root = document.documentElement;
  const preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
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
  const run: ThemeTransition = {
    root,
    transition: document.startViewTransition(update),
    update,
    animations: [],
  };
  activeTransition = run;
  try {
    await run.transition.ready;
    if (activeTransition !== run) return;
    const options = {
      element: root,
      pseudoElement: '::view-transition-new(root)',
      duration: motionTokens.theme.revealDuration * 1000,
      ease: motionTokens.theme.revealEase,
    };
    run.animations.push(
      new NativeAnimation({
        ...options,
        name: 'clipPath',
        keyframes: [
          'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ],
      }),
      new NativeAnimation({
        ...options,
        name: 'filter',
        keyframes: motionTokens.theme.blur.map((value) => `blur(${value}px)`),
        times: [0, 0.5, 1],
      }),
    );
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
