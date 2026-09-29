import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';
import type { Locale } from '@/config/i18n';
import {
  formatEditionDate,
  formatNewsTime,
  newsContent,
  newsFilters,
  newsTextLanguage,
  newsTitle,
} from '@/features/news/config';
import {
  fetchLatestDaily,
  fetchNewsPage,
  NewsApiError,
  newsRefreshInterval,
} from '@/features/news/providers/aihot';
import type { NewsItem, NewsSnapshot } from '@/features/news/types';

type Filter = (typeof newsFilters)[number];
interface SavedPaper {
  category: Filter;
  search: string;
  appliedKey: string;
  snapshot: NewsSnapshot;
  checkedAt: number;
  dailyCheckedAt: number;
  searchOpen: boolean;
}
// 同一标签内跨语言保留筛选与已加载页；不持久化跨日游标。
let saved: SavedPaper | undefined;
const queryKey = (category: Filter, search: string) => `${category}:${search}`;

export function registerNewsPaper(): void {
  if (customElements.get('news-paper')) return;
  class NewsPaper extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      this.cleanup?.();
      const lifetime = new AbortController();
      const { signal } = lifetime;
      const locale: Locale = this.dataset.locale === 'en' ? 'en' : 'zh';
      const text = newsContent[locale];
      const find = <T extends Element = HTMLElement>(selector: string) => {
        const element = this.querySelector<T>(selector);
        if (!element) throw new Error(`Missing news element: ${selector}`);
        return element;
      };
      const input = find<HTMLInputElement>('[data-news-search]');
      const searchToggle = find<HTMLButtonElement>('[data-news-search-toggle]');
      const searchShell = find('[data-news-search-shell]');
      const searchField = find('[data-news-search-field]');
      const searchClear = find<HTMLButtonElement>('[data-news-search-clear]');
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      let searchAnimation: AnimationPlaybackControls | undefined;
      let tabAnimation: AnimationPlaybackControls | undefined;
      let contentAnimation: AnimationPlaybackControls | undefined;
      const tabs = find('.news-category-tabs');
      const indicator = find('[data-news-tab-indicator]');
      const refresh = find<HTMLButtonElement>('[data-news-refresh]');
      const more = find<HTMLButtonElement>('[data-news-more]');
      const content = find('[data-news-content]');
      const status = find('[data-news-status]');
      const hint = find('#news-search-hint');
      const raw = find<HTMLScriptElement>('[data-news-snapshot]');
      // 初始 JSON 来自本站服务端适配器，外部响应始终经过 Provider 校验。
      const initial: NewsSnapshot = JSON.parse(raw.textContent ?? '{}');
      const state: SavedPaper = saved ?? {
        category: 'all',
        search: '',
        appliedKey: queryKey('all', ''),
        snapshot: initial,
        checkedAt: 0,
        dailyCheckedAt: 0,
        searchOpen: false,
      };
      saved = undefined;
      input.value = state.search;
      searchClear.hidden = !state.search;
      searchShell.dataset.hasQuery = String(!!state.search);
      let active: AbortController | undefined;
      let debounce: ReturnType<typeof setTimeout> | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let dailyActive = false;
      let blockedUntil = 0;

      const announce = (message = '', visible = false) => {
        status.textContent = message;
        status.hidden = !message;
        status.classList.toggle('sr-only', !visible);
      };
      const setSearchOpen = (open: boolean, immediate = false) => {
        searchAnimation?.stop();
        state.searchOpen = open;
        searchToggle.setAttribute('aria-expanded', String(open));
        searchToggle.setAttribute(
          'aria-label',
          open ? text.closeSearch : text.search,
        );
        searchField.inert = !open;
        if (open) {
          searchShell.dataset.open = 'true';
          searchField.hidden = false;
        }
        const finish = () => {
          if (!state.searchOpen) {
            searchField.hidden = true;
            searchShell.dataset.open = 'false';
          }
        };
        if (immediate || reduced.matches) {
          searchShell.style.setProperty(
            '--news-search-progress',
            open ? '1' : '0',
          );
          finish();
        } else {
          searchAnimation = animate(
            searchShell,
            { '--news-search-progress': open ? 1 : 0 },
            {
              duration: motionTokens.news.searchDuration,
              ease: motionTokens.easing,
              onComplete: finish,
            },
          );
        }
      };
      setSearchOpen(state.searchOpen, true);
      const setText = (parent: Element, selector: string, value: string) => {
        const element = parent.querySelector<HTMLElement>(selector);
        if (element) element.textContent = value;
        return element;
      };
      const story = (
        item: NewsItem,
        mode: 'lead' | 'secondary' | 'brief' | 'short',
      ) => {
        const template = find<HTMLTemplateElement>(
          `[data-news-template="${mode}"]`,
        );
        const fragment = template.content.cloneNode(true);
        if (!(fragment instanceof DocumentFragment))
          throw new Error('Invalid story template');
        const article =
          fragment.querySelector<HTMLElement>('[data-news-story]');
        if (!article) throw new Error('Missing story template');
        article.dataset.languageBlock = `news-${item.id}`;
        article.dataset.attribution = item.attribution.name;
        article.dataset.canonical = item.attribution.url;
        setText(
          article,
          '[data-story-category]',
          `${mode === 'lead' ? `${text.lead} // ` : ''}${text.categories[item.category]}`,
        );
        const title = newsTitle(item, locale);
        setText(article, '[data-story-title]', title)?.setAttribute(
          'lang',
          newsTextLanguage(title),
        );
        const summary = setText(
          article,
          '[data-story-summary]',
          item.summary ?? '',
        );
        if (summary) {
          summary.hidden = !item.summary;
          summary.lang = newsTextLanguage(item.summary ?? '');
        }
        const selected = article.querySelector<HTMLElement>(
          '[data-story-selected]',
        );
        if (selected) selected.hidden = !item.selected;
        const score = setText(
          article,
          '[data-story-score]',
          `AI ${item.score}/100`,
        );
        if (score) score.hidden = item.score === null;
        const time =
          article.querySelector<HTMLTimeElement>('[data-story-time]');
        if (time) {
          time.hidden = !item.publishedAt;
          time.textContent = item.publishedAt
            ? formatNewsTime(item.publishedAt, locale)
            : '';
          time.dateTime = item.publishedAt ?? '';
        }
        const unknown = article.querySelector<HTMLElement>(
          '[data-story-unknown]',
        );
        if (unknown) unknown.hidden = !!item.publishedAt;
        const source = setText(
          article,
          '[data-story-source]',
          item.source.name,
        );
        source?.setAttribute('href', item.source.url);
        source?.setAttribute('lang', newsTextLanguage(item.source.name));
        article
          .querySelectorAll<HTMLAnchorElement>('[data-story-original]')
          .forEach((link) => {
            link.href = item.url;
          });
        article
          .querySelector<HTMLAnchorElement>('[data-story-reading]')
          ?.setAttribute('href', item.readingUrl);
        return article;
      };
      const positionIndicator = (immediate = false) => {
        const selected = tabs.querySelector<HTMLButtonElement>(
          '[aria-pressed="true"]',
        );
        if (!selected) return;
        tabAnimation?.stop();
        const x = selected.offsetLeft;
        const width = selected.offsetWidth;
        if (immediate || reduced.matches) {
          indicator.style.transform = `translateX(${x}px)`;
          indicator.style.width = `${width}px`;
        } else {
          const current = indicator.getBoundingClientRect();
          const currentX =
            current.left - tabs.getBoundingClientRect().left + tabs.scrollLeft;
          tabAnimation = animate(
            indicator,
            { x: [currentX, x], width: [current.width, width] },
            {
              duration: motionTokens.news.tabDuration,
              ease: motionTokens.easing,
            },
          );
        }
      };
      const paintTabs = (immediate = false) => {
        this.querySelectorAll<HTMLButtonElement>(
          '[data-news-category]',
        ).forEach((button) => {
          const selected = button.dataset.newsCategory === state.category;
          button.setAttribute('aria-pressed', String(selected));
          const count = button.querySelector<HTMLElement>(
            '[data-news-category-count]',
          );
          if (count) {
            const matches =
              state.appliedKey === queryKey(state.category, state.search);
            count.setAttribute(
              'aria-hidden',
              String(!selected || !matches || !state.snapshot.fetchedAt),
            );
            count.textContent =
              selected && matches
                ? String(state.snapshot.page.items.length)
                : '';
          }
        });
        positionIndicator(immediate);
      };
      const paint = () => {
        paintTabs();
        const matches =
          state.appliedKey === queryKey(state.category, state.search);
        // 新查询等待或失败时保留最后一次成功的版面，避免日报上跳。
        const items = state.snapshot.page.items;
        const fill = (
          selector: string,
          entries: NewsItem[],
          mode: Parameters<typeof story>[1],
        ) => {
          find(selector).replaceChildren(
            ...entries.map((item) => story(item, mode)),
          );
        };
        fill('[data-news-lead]', items.slice(0, 1), 'lead');
        fill('[data-news-secondary]', items.slice(1, 3), 'secondary');
        fill('[data-news-briefs]', items.slice(3, 5), 'brief');
        fill('[data-news-stories]', items.slice(5), 'short');
        find('[data-news-front]').hidden = !items.length;
        find('[data-news-secondary]').hidden = items.length < 2;
        find('[data-news-rail]').hidden = items.length < 4;
        find('[data-news-below]').hidden = items.length < 6;
        const empty = find('[data-news-empty]');
        empty.hidden = !!items.length;
        empty.textContent = state.snapshot.fetchedAt
          ? text.empty
          : text.unavailable;
        more.hidden = !state.snapshot.page.hasMore;
        more.disabled =
          !matches || content.getAttribute('aria-busy') === 'true';
        const fetched = state.snapshot.fetchedAt;
        find('[data-news-fetched-value]').textContent = fetched
          ? `${text.updated} ${formatNewsTime(fetched, locale)}`
          : '';
        const fetchedTime = find<HTMLTimeElement>('[data-news-fetched]');
        fetchedTime.hidden = !fetched;
        fetchedTime.dateTime = fetched ?? '';
        const edition = find<HTMLTimeElement>('[data-edition-date]');
        edition.textContent = fetched ? formatEditionDate(fetched, locale) : '';
        edition.dateTime = fetched ?? '';
      };
      const swapContent = (commit: () => void, requestSignal: AbortSignal) => {
        if (requestSignal.aborted) return Promise.resolve(false);
        if (reduced.matches || !state.snapshot.page.items.length) {
          commit();
          return Promise.resolve(true);
        }
        return new Promise<boolean>((resolve) => {
          const finish = () => {
            contentAnimation?.stop();
            content.style.opacity = '1';
            content.style.transform = 'none';
            requestSignal.removeEventListener('abort', finish);
            resolve(!requestSignal.aborted);
          };
          requestSignal.addEventListener('abort', finish, { once: true });
          contentAnimation = animate(
            content,
            { opacity: [1, 0], y: 0 },
            {
              duration: motionTokens.news.contentExitDuration,
              ease: motionTokens.easing,
              onComplete: () => {
                if (requestSignal.aborted) return;
                commit();
                if (reduced.matches) {
                  finish();
                  return;
                }
                contentAnimation = animate(
                  content,
                  {
                    opacity: [0, 1],
                    y: [motionTokens.distance.small, 0],
                  },
                  {
                    duration: motionTokens.news.contentEnterDuration,
                    ease: motionTokens.easing,
                    onComplete: finish,
                  },
                );
              },
            },
          );
        });
      };
      const paintDaily = () => {
        const daily = state.snapshot.daily;
        find('[data-daily-empty]').hidden = !!daily;
        find('[data-daily-content]').hidden = !daily;
        if (!daily) return;
        const edition = find('[data-daily-edition]');
        edition.dataset.attribution = daily.attribution.name;
        edition.dataset.canonical = daily.attribution.url;
        const date = find<HTMLTimeElement>('[data-daily-date]');
        date.dateTime = daily.date;
        date.textContent = formatEditionDate(
          `${daily.date}T00:00:00+08:00`,
          locale,
        );
        const title = find('[data-daily-title]');
        title.textContent = daily.title;
        title.hidden = !daily.title;
        title.lang = newsTextLanguage(daily.title ?? '');
        const summary = find('[data-daily-summary]');
        summary.textContent = daily.summary;
        summary.hidden = !daily.summary;
        summary.lang = newsTextLanguage(daily.summary ?? '');
        find('[data-daily-generated]').textContent =
          `${text.generated} ${formatNewsTime(daily.generatedAt, locale)}`;
        find('[data-daily-period]').textContent =
          `${text.period} ${formatNewsTime(daily.windowStart, locale)} — ${formatNewsTime(daily.windowEnd, locale)} · ${text.timezone}`;
        find<HTMLAnchorElement>('[data-daily-link]').href = daily.url;
      };
      const loadDaily = async () => {
        if (
          dailyActive ||
          Date.now() - state.dailyCheckedAt < newsRefreshInterval
        )
          return;
        dailyActive = true;
        state.dailyCheckedAt = Date.now();
        try {
          const daily = await fetchLatestDaily(signal);
          if (!signal.aborted) {
            state.snapshot.daily = daily;
            paintDaily();
          }
        } catch {
          // 日报失败保留上一期，资讯筛选与日报互不阻塞。
        } finally {
          dailyActive = false;
        }
      };
      const schedule = () => {
        clearTimeout(timer);
        if (document.hidden || signal.aborted) return;
        const delay = Math.max(
          1000,
          state.checkedAt + newsRefreshInterval - Date.now(),
          blockedUntil - Date.now(),
        );
        timer = setTimeout(() => {
          if (Array.from(state.search).length === 1) {
            state.checkedAt = Date.now();
            schedule();
            return;
          }
          void load();
          void loadDaily();
        }, delay);
      };
      const load = async (append = false) => {
        const searchLength = Array.from(state.search).length;
        if (searchLength === 1 || searchLength > 200) return;
        active?.abort();
        active = new AbortController();
        const request = active;
        const requestSignal = AbortSignal.any([signal, request.signal]);
        const key = queryKey(state.category, state.search);
        const category = state.category;
        const search = state.search;
        const cursor = append
          ? (state.snapshot.page.nextCursor ?? undefined)
          : undefined;
        content.setAttribute('aria-busy', 'true');
        refresh.disabled = true;
        more.disabled = true;
        announce(text.loading);
        paintTabs();
        try {
          let page;
          try {
            page = await fetchNewsPage({
              category,
              search,
              cursor,
              signal: requestSignal,
            });
          } catch (error) {
            if (
              append &&
              error instanceof NewsApiError &&
              error.code === 'invalid_cursor'
            ) {
              page = await fetchNewsPage({
                category,
                search,
                signal: requestSignal,
              });
              append = false;
            } else throw error;
          }
          if (
            requestSignal.aborted ||
            key !== queryKey(state.category, state.search)
          )
            return;
          if (append) {
            const seen = new Set(
              state.snapshot.page.items.map((item) => item.id),
            );
            page.items = [
              ...state.snapshot.page.items,
              ...page.items.filter((item) => !seen.has(item.id)),
            ];
          }
          const commit = () => {
            state.snapshot.page = page;
            state.snapshot.fetchedAt = new Date().toISOString();
            state.appliedKey = key;
            paint();
          };
          // 分页只追加；分类与搜索成功后再交换内容，取消时立即恢复可见性。
          if (append || state.appliedKey === key) commit();
          else if (!(await swapContent(commit, requestSignal))) return;
          announce(text.fresh);
        } catch (error) {
          if (requestSignal.aborted) return;
          paintTabs();
          if (
            error instanceof NewsApiError &&
            (error.status === 429 || error.status >= 500)
          ) {
            blockedUntil = error.retryAt;
            announce(
              `${error.status === 429 ? text.rateLimited : text.failed} ${text.retry} ${formatNewsTime(new Date(error.retryAt).toISOString(), locale)}`,
              true,
            );
          } else announce(text.failed, true);
        } finally {
          if (!requestSignal.aborted) {
            state.checkedAt = Date.now();
            content.setAttribute('aria-busy', 'false');
            refresh.disabled = false;
            more.disabled = state.appliedKey !== key;
            schedule();
          }
        }
      };

      this.querySelectorAll<HTMLElement>('[data-news-controls]').forEach(
        (element) => {
          element.hidden = false;
        },
      );
      paint();
      positionIndicator(true);
      const tabResize = new ResizeObserver(() => positionIndicator(true));
      tabResize.observe(tabs);
      tabs
        .querySelectorAll('button')
        .forEach((button) => tabResize.observe(button));
      paintDaily();
      hint.hidden = Array.from(state.search).length !== 1;
      searchToggle.addEventListener(
        'click',
        () => {
          setSearchOpen(!state.searchOpen);
          if (state.searchOpen) input.focus();
        },
        { signal },
      );
      this.querySelectorAll<HTMLButtonElement>('[data-news-category]').forEach(
        (button) => {
          button.addEventListener(
            'click',
            () => {
              const category = newsFilters.find(
                (value) => value === button.dataset.newsCategory,
              );
              if (!category || state.category === category) return;
              state.category = category;
              paintTabs();
              clearTimeout(debounce);
              if (Array.from(state.search).length !== 1) void load();
            },
            { signal },
          );
        },
      );
      const updateSearch = () => {
        active?.abort();
        content.setAttribute('aria-busy', 'false');
        refresh.disabled = false;
        clearTimeout(debounce);
        state.search = input.value.trim();
        paintTabs();
        more.disabled =
          state.appliedKey !== queryKey(state.category, state.search);
        searchClear.hidden = !input.value;
        searchShell.dataset.hasQuery = String(!!state.search);
        const length = Array.from(state.search).length;
        hint.hidden = length !== 1 && length <= 200;
        input.setAttribute('aria-invalid', String(!hint.hidden));
        if (!hint.hidden) {
          announce();
          return;
        }
        debounce = setTimeout(() => void load(), 350);
      };
      input.addEventListener('input', updateSearch, { signal });
      searchClear.addEventListener(
        'click',
        () => {
          input.value = '';
          updateSearch();
          clearTimeout(debounce);
          void load();
          input.focus();
        },
        { signal },
      );
      reduced.addEventListener(
        'change',
        () => {
          setSearchOpen(state.searchOpen, true);
          positionIndicator(true);
          if (reduced.matches) contentAnimation?.complete();
        },
        { signal },
      );
      input.addEventListener(
        'keydown',
        (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            setSearchOpen(false);
            searchToggle.focus();
            return;
          }
          if (event.key !== 'Enter') return;
          event.preventDefault();
          if (!hint.hidden) return;
          clearTimeout(debounce);
          void load();
        },
        { signal },
      );
      refresh.addEventListener(
        'click',
        () => {
          if (!hint.hidden) {
            input.focus();
            return;
          }
          void load();
          void loadDaily();
        },
        { signal },
      );
      more.addEventListener('click', () => void load(true), { signal });
      document.addEventListener(
        'visibilitychange',
        () => {
          if (document.hidden) clearTimeout(timer);
          else schedule();
        },
        { signal },
      );
      window.addEventListener(
        'pagehide',
        () => {
          setSearchOpen(state.searchOpen, true);
          tabAnimation?.stop();
          active?.abort();
          clearTimeout(timer);
        },
        { signal },
      );
      window.addEventListener(
        'pageshow',
        (event) => {
          if (event.persisted) {
            content.setAttribute('aria-busy', 'false');
            refresh.disabled = false;
            more.disabled =
              state.appliedKey !== queryKey(state.category, state.search);
            schedule();
          }
        },
        { signal },
      );
      this.cleanup = () => {
        searchAnimation?.stop();
        tabAnimation?.stop();
        tabResize.disconnect();
        lifetime.abort();
        active?.abort();
        clearTimeout(debounce);
        clearTimeout(timer);
        saved = state;
      };
      if (
        state.appliedKey !== queryKey(state.category, state.search) ||
        !state.snapshot.fetchedAt ||
        Date.now() - state.checkedAt >= newsRefreshInterval
      )
        void load();
      else schedule();
      void loadDaily();
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }
  customElements.define('news-paper', NewsPaper);
}
