import { getPublishedEntries, sortByDate } from '@/lib/content/queries';
import { getEntryPath } from '@/lib/content/paths';
import { indexContent } from './config';

export async function getRecentActivity() {
  const collections = await Promise.all([
    getPublishedEntries('writing'),
    getPublishedEntries('fragments'),
    getPublishedEntries('projects'),
  ]);
  const entries = collections.flat().map((entry) => ({
    title: entry.data.title,
    href: getEntryPath(entry),
    section: entry.collection,
    date: entry.data.updatedAt ?? entry.data.publishedAt,
  }));
  return sortByDate(entries, (entry) => entry.date).slice(
    0,
    indexContent.recentLimit,
  );
}
