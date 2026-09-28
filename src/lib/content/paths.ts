import type { CollectionEntry } from 'astro:content';
import { sectionPaths } from '../../config/navigation';

export type DetailCollection = 'writing' | 'fragments' | 'projects';

/** 支持嵌套内容目录；以 Content Layer 的 entry.id 生成链接。 */
export function getEntryPath(entry: CollectionEntry<DetailCollection>): string {
  const id = entry.id.split('/').map(encodeURIComponent).join('/');
  return `${sectionPaths[entry.collection]}${id}/`;
}
