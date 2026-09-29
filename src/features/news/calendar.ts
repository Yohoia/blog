import type { Locale } from '../../config/i18n';
import type { NewsSnapshot } from './types';

export type HeatmapMode = 'daily' | 'weekly' | 'monthly';
export interface HeatmapCell {
  key: string;
  date: string | null;
  count: number;
  level: number;
  label: string;
  text: string;
  selected: boolean;
}
const dayMs = 86_400_000;
const dateKey = (value: number) => new Date(value).toISOString().slice(0, 10);

/** 仅使用已经取得的记录；日报与资讯可能重复，以较大的已知数量为准。 */
export function getHeatmapActivity(
  snapshot: NewsSnapshot,
): Record<string, number> {
  const activity: Record<string, number> = {};
  for (const item of snapshot.page.items) {
    if (!item.publishedAt) continue;
    const date = new Date(new Date(item.publishedAt).getTime() + 8 * 3_600_000)
      .toISOString()
      .slice(0, 10);
    activity[date] = (activity[date] ?? 0) + 1;
  }
  if (snapshot.daily) {
    const daily = snapshot.daily;
    activity[daily.date] = Math.max(
      activity[daily.date] ?? 0,
      daily.articles.length,
    );
  }
  return activity;
}

/** 日视图依据已知资讯活动分级；周 / 月依据真实日报期数，不推算未知数据。 */
export function buildHeatmap(
  anchor: string,
  availableDates: readonly string[],
  mode: HeatmapMode,
  locale: Locale,
  selectedDate: string | null,
  activity: Readonly<Record<string, number>> = {},
) {
  const date = new Date(`${anchor}T00:00:00Z`);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dates = [...new Set(availableDates)].sort();
  const formatter = new Intl.DateTimeFormat(
    locale === 'zh' ? 'zh-CN' : 'en-GB',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    },
  );
  const cell = (
    key: string,
    start: number,
    end: number,
    label: string,
    text = '',
  ): HeatmapCell => {
    const matches = dates.filter(
      (value) => value >= dateKey(start) && value < dateKey(end),
    );
    const selected = selectedDate !== null && matches.includes(selectedDate);
    const count = matches.length;
    return {
      key,
      date: matches.at(-1) ?? null,
      count,
      level: 0,
      text,
      selected,
      label: `${label} · ${count} ${locale === 'zh' ? '期已载入日报' : 'loaded editions'}`,
    };
  };
  let cells: HeatmapCell[];
  let columns: number;
  let axis: string[];
  let period: string;
  if (mode === 'daily') {
    columns = 8;
    axis = ['W1', 'W2', 'W3', 'W4', 'W5'];
    period = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(date);
    const start = Date.UTC(year, month, 1);
    const offset = (new Date(start).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    cells = Array.from({ length: 40 }, (_, index) => {
      const day = index - offset;
      const time = start + day * dayMs;
      return day < 0 || day >= days
        ? {
            key: `blank-${index}`,
            date: null,
            count: 0,
            level: 0,
            label: '',
            text: '',
            selected: false,
          }
        : cell(
            dateKey(time),
            time,
            time + dayMs,
            formatter.format(new Date(time)),
          );
    });
  } else if (mode === 'weekly') {
    // 采用 ISO 周，包含跨年边界与第 53 周。
    const firstMonday = (value: number) => {
      const jan4 = Date.UTC(value, 0, 4);
      return jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * dayMs;
    };
    const start = firstMonday(year);
    const weeks = Math.round((firstMonday(year + 1) - start) / (7 * dayMs));
    axis = ['Q1', 'Q2', 'Q3', 'Q4'];
    period = `${year} · ${weeks} ${locale === 'zh' ? '周' : 'weeks'}`;
    const weekCells = Array.from({ length: weeks }, (_, index) => {
      const time = start + index * 7 * dayMs;
      return cell(
        `week-${index}`,
        time,
        time + 7 * dayMs,
        `W${index + 1} · ${formatter.format(new Date(time))} – ${formatter.format(new Date(time + 6 * dayMs))}`,
      );
    });
    const quarters = Array.from({ length: 4 }, (_, quarter) =>
      weekCells.filter((_, index) => {
        const thursday = new Date(start + (index * 7 + 3) * dayMs);
        return Math.floor(thursday.getUTCMonth() / 3) === quarter;
      }),
    );
    columns = Math.max(...quarters.map((entries) => entries.length));
    cells = quarters.flatMap((entries, quarter) =>
      Array.from(
        { length: columns },
        (_, index) =>
          entries[index] ?? {
            key: `blank-quarter-${quarter}-${index}`,
            date: null,
            count: 0,
            level: 0,
            label: '',
            text: '',
            selected: false,
          },
      ),
    );
  } else {
    columns = 4;
    axis = ['01–04', '05–08', '09–12'];
    period = `${year} · ${locale === 'zh' ? '12 个月' : '12 months'}`;
    cells = Array.from({ length: 12 }, (_, index) => {
      const time = Date.UTC(year, index, 1);
      const label = new Intl.DateTimeFormat(
        locale === 'zh' ? 'zh-CN' : 'en-GB',
        {
          year: 'numeric',
          month: 'long',
          timeZone: 'UTC',
        },
      ).format(new Date(time));
      return cell(
        `month-${index}`,
        time,
        Date.UTC(year, index + 1, 1),
        label,
        locale === 'zh'
          ? `${index + 1}月`
          : new Intl.DateTimeFormat('en', {
              month: 'short',
              timeZone: 'UTC',
            }).format(new Date(time)),
      );
    });
  }
  if (mode === 'daily') {
    const max = Math.max(1, ...cells.map((entry) => activity[entry.key] ?? 0));
    for (const entry of cells) {
      if (!entry.date) continue;
      const count = activity[entry.date];
      entry.level = count ? Math.min(4, 1 + Math.ceil((count / max) * 3)) : 1;
      if (count)
        entry.label += ` · ${count} ${locale === 'zh' ? '条已载入资讯' : 'loaded stories'}`;
    }
  } else {
    const max = Math.max(1, ...cells.map((entry) => entry.count));
    for (const entry of cells)
      entry.level = entry.count ? Math.ceil((entry.count / max) * 4) : 0;
  }
  return { cells, columns, rows: axis.length, axis, period };
}
