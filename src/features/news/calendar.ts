import type { Locale } from '../../config/i18n';
export type HeatmapMode = 'daily' | 'weekly' | 'monthly';
export interface HeatmapCell {
  key: string;
  /** 日期或周期的展示位置；没有日报时仍保留浅色点。 */
  displayDate: string | null;
  /** 该点实际可打开的最近日报日期。 */
  date: string | null;
  count: number;
  level: number;
  label: string;
  text: string;
  selected: boolean;
}
const dayMs = 86_400_000;
const dateKey = (value: number) => new Date(value).toISOString().slice(0, 10);

/** 用日报日期生成点阵；点的深浅只表示该日或周期是否有日报。 */
export function buildHeatmap(
  anchor: string,
  availableDates: readonly string[],
  mode: HeatmapMode,
  locale: Locale,
  selectedDate: string | null,
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
    displayDate = dateKey(start),
  ): HeatmapCell => {
    const matches = dates.filter(
      (value) => value >= dateKey(start) && value < dateKey(end),
    );
    const selected = selectedDate !== null && matches.includes(selectedDate);
    const count = matches.length;
    return {
      key,
      displayDate,
      date: matches.at(-1) ?? null,
      count,
      level: count ? 1 : 0,
      text: text || label,
      selected,
      label: formatter.format(
        new Date(`${matches.at(-1) ?? displayDate}T00:00:00Z`),
      ),
    };
  };
  let cells: HeatmapCell[];
  let columns: number;
  let axis: string[];
  let period: string;
  if (mode === 'daily') {
    columns = 7;
    axis =
      locale === 'zh'
        ? ['一', '二', '三', '四', '五', '六', '日']
        : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    period = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(date);
    const start = Date.UTC(year, month, 1);
    const offset = (new Date(start).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const rows = Math.ceil((offset + days) / columns);
    cells = Array.from({ length: rows * columns }, (_, index) => {
      const day = index - offset;
      const time = start + day * dayMs;
      return day < 0 || day >= days
        ? {
            key: `blank-${index}`,
            displayDate: null,
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
            displayDate: null,
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
    columns = 6;
    axis = ['', ''];
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
        dateKey(time),
      );
    });
  }
  const periodCount = cells.filter((entry) => entry.count > 0).length;
  const countLabel =
    locale === 'zh'
      ? `${periodCount} 期`
      : `${periodCount} ${periodCount === 1 ? 'issue' : 'issues'}`;
  return {
    cells,
    columns,
    rows: mode === 'daily' ? Math.ceil(cells.length / columns) : axis.length,
    axis,
    period: `${period} · ${countLabel}`,
  };
}
