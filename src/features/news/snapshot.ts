import {
  fetchDailyArchive,
  fetchLatestDaily,
  fetchNewsPage,
} from './providers/aihot';
import type { NewsSnapshot } from './types';

/** 同一次静态构建的中英页面共用请求；失败不阻止其余页面构建。 */
let pending: Promise<NewsSnapshot> | undefined;
export function getNewsSnapshot(): Promise<NewsSnapshot> {
  pending ??= Promise.allSettled([
    fetchNewsPage(),
    fetchLatestDaily(),
    fetchDailyArchive(),
  ]).then(([page, daily, archive]) => {
    if (page.status === 'rejected' || daily.status === 'rejected')
      console.warn(
        '[News] AIHOT snapshot partially unavailable; browser refresh remains available.',
      );
    if (archive.status === 'rejected')
      console.warn(
        '[News] AIHOT daily archive unavailable; calendar is empty.',
      );
    return {
      page:
        page.status === 'fulfilled'
          ? page.value
          : { items: [], hasMore: false, nextCursor: null },
      daily: daily.status === 'fulfilled' ? daily.value : null,
      fetchedAt: page.status === 'fulfilled' ? new Date().toISOString() : null,
      archive: archive.status === 'fulfilled' ? archive.value.items : [],
      archiveTotal: archive.status === 'fulfilled' ? archive.value.total : 0,
    };
  });
  return pending;
}
