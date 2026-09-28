import { getCollection, type CollectionKey } from 'astro:content';

interface ContentQueryOptions {
  /** 草稿默认不返回；需要本地预览时显式传入 true。 */
  includeDrafts?: boolean;
}

export async function getPublishedEntries<C extends CollectionKey>(
  collection: C,
  { includeDrafts = false }: ContentQueryOptions = {},
) {
  return getCollection(collection, ({ data }) => includeDrafts || !data.draft);
}

/** 返回新数组，避免修改调用方的数据。 */
export function sortByDate<T>(
  entries: readonly T[],
  getDate: (entry: T) => Date,
): T[] {
  return [...entries].sort(
    (a, b) => getDate(b).getTime() - getDate(a).getTime(),
  );
}
