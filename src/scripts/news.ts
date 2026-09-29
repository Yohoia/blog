import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';
import {
  buildHeatmap,
  getHeatmapActivity,
  type HeatmapMode,
} from '@/features/news/calendar';
import { newsCategories } from '@/config/categories';
import type { Locale } from '@/config/i18n';
import {
  formatNewsTime,
  newsContent,
  newsFilters,
  newsTextLanguage,
  newsTitle,
} from '@/features/news/config';
import {
  formatCalendarDate,
  formatCalendarWeekday,
} from '@/features/news/config';
import {
  fetchDailyArchive,
  fetchDailyByDate,
  fetchLatestDaily,
  fetchNewsPage,
  NewsApiError,
  newsRefreshInterval,
} from '@/features/news/providers/aihot';
import type { NewsItem, NewsSnapshot } from '@/features/news/types';

type Filter = (typeof newsFilters)[number];
interface SavedPaper {
  category: Filter;
  appliedKey: string;
  selectedDate: string | null;
  dateMode: boolean;
  snapshot: NewsSnapshot;
  checkedAt: number;
  dailyCheckedAt: number;
  heatmapMode: HeatmapMode;
  heatmapActivity: Record<string, number>;
}
// 同一标签内跨语言保留筛选与已加载页；不持久化跨日游标。
let saved: SavedPaper | undefined;
const queryKey = (category: Filter) => category;

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
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const tabAnimations = new Map<HTMLElement, AnimationPlaybackControls>();
      let contentAnimation: AnimationPlaybackControls | undefined;
      const tabs = find('.news-editorial-nav');
      const heatmapGrid = find('[data-news-heatmap-grid]');
      const heatTooltip = find('[data-news-heat-tooltip]');
      const heatAnimations = new Map<HTMLElement, AnimationPlaybackControls>();
      const heatmapTabs = Array.from(
        this.querySelectorAll<HTMLButtonElement>('[data-news-heatmap-mode]'),
      );
      const editionIssue = find('[data-news-issue]');
      const calendarSelectedDate = find<HTMLTimeElement>(
        '[data-news-selected-date]',
      );
      const calendarSelectedWeekday = find('[data-news-selected-weekday]');
      const refresh = find<HTMLButtonElement>('[data-news-refresh]');
      const more = find<HTMLButtonElement>('[data-news-more]');
      const content = find('[data-news-content]');
      const status = find('[data-news-status]');
      const raw = find<HTMLScriptElement>('[data-news-snapshot]');
      // 初始 JSON 来自本站服务端适配器，外部响应始终经过 Provider 校验。
      const initial: NewsSnapshot = JSON.parse(raw.textContent ?? '{}');
      const state: SavedPaper = saved ?? {
        category: 'all',
        appliedKey: queryKey('all'),
        selectedDate: initial.daily?.date ?? null,
        dateMode: false,
        snapshot: initial,
        checkedAt: 0,
        dailyCheckedAt: 0,
        heatmapMode: 'daily',
        heatmapActivity: getHeatmapActivity(initial),
      };
      saved = undefined;
      let active: AbortController | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let dailyActive = false;
      let blockedUntil = 0;

      const announce = (message = '', visible = false) => {
        status.textContent = message;
        status.hidden = !message;
        status.classList.toggle('sr-only', !visible);
      };
      const setText = (parent: Element, selector: string, value: string) => {
        const element = parent.querySelector<HTMLElement>(selector);
        if (element) element.textContent = value;
        return element;
      };
      const story = (item: NewsItem, mode: 'lead' | 'secondary' | 'short') => {
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
        const title = newsTitle(item, locale);
        const heading = setText(article, '[data-story-title]', title);
        heading?.setAttribute('lang', newsTextLanguage(title));
        heading?.setAttribute('title', title);
        const summary = setText(
          article,
          '[data-story-summary]',
          item.summary ?? '',
        );
        if (summary) {
          summary.hidden = !item.summary;
          summary.lang = newsTextLanguage(item.summary ?? '');
          if (item.summary) summary.title = item.summary;
          else summary.removeAttribute('title');
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
      const rememberActivity = () => {
        for (const [date, count] of Object.entries(
          getHeatmapActivity(state.snapshot),
        )) {
          state.heatmapActivity[date] = Math.max(
            state.heatmapActivity[date] ?? 0,
            count,
          );
        }
      };
      const hideHeatTooltip = () => {
        heatTooltip.hidden = true;
        heatmapGrid
          .querySelector('[aria-describedby]')
          ?.removeAttribute('aria-describedby');
      };
      const animateHeat = (cell: HTMLElement, active: boolean) => {
        heatAnimations.get(cell)?.stop();
        const scale =
          active && !reduced.matches ? motionTokens.news.heatHoverScale : 1;
        if (reduced.matches) cell.style.transform = 'none';
        else
          heatAnimations.set(
            cell,
            animate(
              cell,
              { scale },
              {
                duration: motionTokens.news.heatHoverDuration,
                ease: motionTokens.easing,
              },
            ),
          );
      };
      const showHeatTooltip = (cell: HTMLElement, pointer?: PointerEvent) => {
        heatTooltip.textContent = cell.getAttribute('aria-label') ?? '';
        heatTooltip.hidden = false;
        cell.setAttribute('aria-describedby', heatTooltip.id);
        const bounds = cell.getBoundingClientRect();
        const half = heatTooltip.getBoundingClientRect().width / 2 + 8;
        heatTooltip.style.left = `${Math.min(window.innerWidth - half, Math.max(half, pointer?.clientX ?? bounds.x + bounds.width / 2))}px`;
        heatTooltip.style.top = `${Math.max(heatTooltip.getBoundingClientRect().height + 16, pointer?.clientY ?? bounds.top)}px`;
      };
      const paintCalendar = () => {
        hideHeatTooltip();
        heatAnimations.forEach((animation) => animation.stop());
        heatAnimations.clear();
        const selected = state.selectedDate;
        const archive = state.snapshot.archive;
        const selectedIndex = selected
          ? archive.findIndex((entry) => entry.date === selected)
          : -1;
        // 期号与选中日期位于版面元信息行，日历本体只保留可选择的月份网格。
        editionIssue.textContent =
          selected && selectedIndex >= 0
            ? String(state.snapshot.archiveTotal - selectedIndex)
            : '';
        calendarSelectedDate.dateTime = selected ?? '';
        calendarSelectedDate.textContent = selected
          ? formatCalendarDate(selected, locale)
          : '';
        calendarSelectedWeekday.textContent = selected
          ? formatCalendarWeekday(selected, locale)
          : '';
        if (editionIssue.parentElement)
          editionIssue.parentElement.hidden = selectedIndex < 0;
        const anchor =
          selected ?? archive[0]?.date ?? new Date().toISOString().slice(0, 10);
        const map = buildHeatmap(
          anchor,
          archive.map((entry) => entry.date),
          state.heatmapMode,
          locale,
          selected,
          state.heatmapActivity,
        );
        find('.news-heatmap').hidden = !archive.length;
        const focusedKey =
          document.activeElement instanceof HTMLElement
            ? document.activeElement.dataset.newsHeatKey
            : undefined;
        heatmapTabs.forEach((button) => {
          button.disabled = false;
          button.setAttribute(
            'aria-pressed',
            String(button.dataset.newsHeatmapMode === state.heatmapMode),
          );
        });
        const body = find('[data-news-heatmap-body]');
        body.style.setProperty('--heatmap-rows', String(map.rows));
        body.style.setProperty('--heatmap-columns', String(map.columns));
        find('[data-news-heatmap-axis]').replaceChildren(
          ...map.axis.map((label) => {
            const span = document.createElement('span');
            span.textContent = label;
            return span;
          }),
        );
        heatmapGrid.replaceChildren(
          ...map.cells.map((cell) => {
            const element = document.createElement(
              cell.date ? 'button' : 'span',
            );
            element.className = 'news-heat-cell';
            element.dataset.newsHeatLevel = String(cell.level);
            element.dataset.newsHeatKey = cell.key;
            element.textContent = cell.text;
            if (cell.date && element instanceof HTMLButtonElement) {
              element.type = 'button';
              element.dataset.newsDate = cell.date;
              element.setAttribute('aria-label', cell.label);
              element.setAttribute('aria-pressed', String(cell.selected));
            } else element.setAttribute('aria-hidden', 'true');
            return element;
          }),
        );
        if (focusedKey)
          Array.from(
            heatmapGrid.querySelectorAll<HTMLElement>('[data-news-heat-key]'),
          )
            .find((cell) => cell.dataset.newsHeatKey === focusedKey)
            ?.focus();
        find('[data-news-heatmap-period]').textContent = map.period;
        find('[data-news-latest]').hidden = !state.dateMode;
      };

      const animateTab = (button: HTMLButtonElement) => {
        const selected = button.getAttribute('aria-pressed') === 'true';
        const hovered = button.matches(':hover, :focus-visible');
        tabAnimations.get(button)?.stop();
        const values = {
          '--news-tab-progress': selected ? 1 : 0,
          '--news-tab-offset':
            !selected && hovered ? motionTokens.news.tabHoverDistance : 0,
        };
        if (reduced.matches) {
          for (const [name, value] of Object.entries(values))
            button.style.setProperty(name, String(value));
        } else
          tabAnimations.set(
            button,
            animate(button, values, {
              duration: motionTokens.news.tabDuration,
              ease: motionTokens.easing,
            }),
          );
      };
      const paintTabs = () => {
        this.querySelectorAll<HTMLButtonElement>(
          '[data-news-category]',
        ).forEach((button) => {
          const selected = button.dataset.newsCategory === state.category;
          button.disabled = false;
          button.setAttribute('aria-pressed', String(selected));
          animateTab(button);
          const count = button.querySelector<HTMLElement>(
            '[data-news-category-count]',
          );
          if (count) {
            const matches = state.appliedKey === queryKey(state.category);
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
      };
      const paint = () => {
        rememberActivity();
        paintTabs();
        paintCalendar();
        const matches = state.appliedKey === queryKey(state.category);
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
        find('[data-news-secondary]').hidden = items.length < 2;
        for (const category of newsCategories) {
          const section = find(`[data-news-section="${category}"]`);
          const entries = items
            .slice(3)
            .filter((item) => item.category === category);
          section.hidden = !entries.length;
          section
            .querySelector('[data-news-section-grid]')
            ?.replaceChildren(...entries.map((item) => story(item, 'short')));
          setText(
            section,
            '[data-news-section-count]',
            `${entries.length} ${text.stories}`,
          );
        }
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
      const dailyPage = (daily: NonNullable<NewsSnapshot['daily']>) => {
        return {
          items: daily.articles.filter((item) => {
            const matchesCategory =
              state.category === 'all' || item.category === state.category;
            return matchesCategory;
          }),
          hasMore: false,
          nextCursor: null,
        };
      };
      const swapDailyPage = (
        daily: NonNullable<NewsSnapshot['daily']>,
        requestSignal: AbortSignal,
      ) => {
        const page = dailyPage(daily);
        return swapContent(() => {
          state.snapshot.daily = daily;
          state.selectedDate = daily.date;
          state.dateMode = true;
          state.snapshot.page = page;
          state.snapshot.fetchedAt = new Date().toISOString();
          state.appliedKey = queryKey(state.category);
          paint();
        }, requestSignal);
      };
      const finishNewsRequest = () => {
        content.setAttribute('aria-busy', 'false');
        refresh.disabled = false;
        more.disabled = false;
        schedule();
      };
      const loadDateFilters = async () => {
        const daily = state.snapshot.daily;
        if (!daily) return;
        active?.abort();
        active = new AbortController();
        const requestSignal = AbortSignal.any([signal, active.signal]);
        content.setAttribute('aria-busy', 'true');
        refresh.disabled = true;
        more.disabled = true;
        announce(text.loading);
        paintTabs();
        try {
          await swapDailyPage(daily, requestSignal);
          if (!requestSignal.aborted) announce(text.dailyUpdated);
        } catch {
          if (!requestSignal.aborted) announce(text.failed, true);
        } finally {
          if (!requestSignal.aborted) finishNewsRequest();
        }
      };
      const loadSelectedDate = async (date: string) => {
        active?.abort();
        active = new AbortController();
        const request = active;
        const requestSignal = AbortSignal.any([signal, request.signal]);
        const previousDate = state.snapshot.daily?.date ?? null;
        const previousDateMode = state.dateMode;
        content.setAttribute('aria-busy', 'true');
        refresh.disabled = true;
        more.disabled = true;
        announce(text.loading);
        try {
          const daily = await fetchDailyByDate(date, requestSignal);
          if (requestSignal.aborted) return;
          await swapDailyPage(daily, requestSignal);
          if (!requestSignal.aborted) announce(text.dailyUpdated);
          state.checkedAt = Date.now();
        } catch (error) {
          if (requestSignal.aborted) return;
          state.selectedDate = previousDate;
          state.dateMode = previousDateMode;
          paintCalendar();
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
          if (!requestSignal.aborted) finishNewsRequest();
        }
      };
      const loadDaily = async () => {
        if (state.dateMode) return;
        if (
          dailyActive ||
          Date.now() - state.dailyCheckedAt < newsRefreshInterval
        )
          return;
        dailyActive = true;
        state.dailyCheckedAt = Date.now();
        try {
          const daily = await fetchLatestDaily(signal);
          if (!signal.aborted && !state.dateMode) {
            state.snapshot.daily = daily;
            state.selectedDate = daily.date;
            rememberActivity();
            paintCalendar();
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
          if (state.dateMode) {
            state.checkedAt = Date.now();
            schedule();
            return;
          }
          void load();
          void loadDaily();
        }, delay);
      };
      const load = async (append = false) => {
        if (state.dateMode) {
          if (!append) await loadDateFilters();
          return;
        }
        active?.abort();
        active = new AbortController();
        const request = active;
        const requestSignal = AbortSignal.any([signal, request.signal]);
        const key = queryKey(state.category);
        const category = state.category;
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
                signal: requestSignal,
              });
              append = false;
            } else throw error;
          }
          if (requestSignal.aborted || key !== queryKey(state.category)) return;
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
          // 分页只追加；分类成功后再交换内容，取消时立即恢复可见性。
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
              void load();
            },
            { signal },
          );
        },
      );
      tabs
        .querySelectorAll<HTMLButtonElement>('[data-news-category]')
        .forEach((button) => {
          for (const event of ['pointerenter', 'pointerleave', 'focus', 'blur'])
            button.addEventListener(event, () => animateTab(button), {
              signal,
            });
        });
      heatmapTabs.forEach((button) =>
        button.addEventListener(
          'click',
          () => {
            const mode = button.dataset.newsHeatmapMode;
            if (mode !== 'daily' && mode !== 'weekly' && mode !== 'monthly')
              return;
            state.heatmapMode = mode;
            paintCalendar();
          },
          { signal },
        ),
      );
      const heatTarget = (target: EventTarget | null) =>
        target instanceof Element
          ? target.closest<HTMLElement>('button[data-news-date]')
          : null;
      heatmapGrid.addEventListener(
        'pointerover',
        (event) => {
          const cell = heatTarget(event.target);
          if (!cell || event.pointerType === 'touch') return;
          animateHeat(cell, true);
          showHeatTooltip(cell, event);
        },
        { signal },
      );
      heatmapGrid.addEventListener(
        'pointermove',
        (event) => {
          const cell = heatTarget(event.target);
          if (cell && event.pointerType !== 'touch')
            showHeatTooltip(cell, event);
        },
        { signal },
      );
      heatmapGrid.addEventListener(
        'pointerout',
        (event) => {
          const cell = heatTarget(event.target);
          if (cell) animateHeat(cell, false);
          hideHeatTooltip();
        },
        { signal },
      );
      heatmapGrid.addEventListener(
        'focusin',
        (event) => {
          const cell = heatTarget(event.target);
          if (!cell) return;
          animateHeat(cell, true);
          showHeatTooltip(cell);
        },
        { signal },
      );
      heatmapGrid.addEventListener(
        'focusout',
        (event) => {
          const cell = heatTarget(event.target);
          if (cell) animateHeat(cell, false);
          hideHeatTooltip();
        },
        { signal },
      );
      heatmapGrid.addEventListener(
        'keydown',
        (event) => {
          if (event.key === 'Escape') hideHeatTooltip();
        },
        { signal },
      );
      window.addEventListener('scroll', hideHeatTooltip, {
        signal,
        passive: true,
      });
      heatmapGrid.addEventListener(
        'click',
        (event) => {
          const button =
            event.target instanceof Element
              ? event.target.closest<HTMLButtonElement>(
                  'button[data-news-date]',
                )
              : null;
          const date = button?.dataset.newsDate;
          if (date && (!state.dateMode || date !== state.selectedDate))
            void loadSelectedDate(date);
        },
        { signal },
      );
      find('[data-news-latest]').addEventListener(
        'click',
        () => {
          state.dateMode = false;
          void load();
          state.dailyCheckedAt = 0;
          void loadDaily();
        },
        { signal },
      );
      reduced.addEventListener(
        'change',
        () => {
          tabs
            .querySelectorAll<HTMLButtonElement>('button')
            .forEach(animateTab);
          if (reduced.matches) {
            heatAnimations.forEach((animation) => animation.stop());
            heatmapGrid
              .querySelectorAll<HTMLElement>('button')
              .forEach((cell) => {
                cell.style.transform = 'none';
              });
            contentAnimation?.complete();
          }
        },
        { signal },
      );
      refresh.addEventListener(
        'click',
        () => {
          void (state.dateMode && state.selectedDate
            ? loadSelectedDate(state.selectedDate)
            : load());
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
          tabAnimations.forEach((animation) => animation.stop());
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
            more.disabled = state.appliedKey !== queryKey(state.category);
            schedule();
          }
        },
        { signal },
      );
      this.cleanup = () => {
        tabAnimations.forEach((animation) => animation.stop());
        heatAnimations.forEach((animation) => animation.stop());
        hideHeatTooltip();
        lifetime.abort();
        active?.abort();
        clearTimeout(timer);
        saved = state;
      };
      if (
        state.appliedKey !== queryKey(state.category) ||
        !state.snapshot.fetchedAt ||
        Date.now() - state.checkedAt >= newsRefreshInterval
      )
        void load();
      else schedule();
      void fetchDailyArchive(signal)
        .then((archive) => {
          if (signal.aborted) return;
          state.snapshot.archive = archive.items;
          state.snapshot.archiveTotal = archive.total;
          paintCalendar();
        })
        .catch(() => {
          /* 保留构建时的日期索引。 */
        });
      void loadDaily();
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }
  customElements.define('news-paper', NewsPaper);
}
