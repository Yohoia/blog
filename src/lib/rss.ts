import rss from '@astrojs/rss';
import { siteConfig } from '../config/site';
import { localeMetadata, i18nConfig } from '../config/i18n';
import { getEntryPath } from './content/paths';
import { getPublishedEntries, sortByDate } from './content/queries';

/** Writing 路由实现后，可在 src/pages/rss.xml.ts 中调用此函数。 */
export async function createWritingFeed(site: URL | undefined) {
  if (!site) {
    throw new Error('Set SITE_URL in .env before generating the RSS feed.');
  }

  const writing = sortByDate(
    await getPublishedEntries('writing'),
    (entry) => entry.data.publishedAt,
  );

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site,
    items: writing.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: getEntryPath(entry),
    })),
    customData: `<language>${localeMetadata[i18nConfig.defaultLocale].language}</language>`,
  });
}
