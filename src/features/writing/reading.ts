/** 从 Markdown / MDX 正文估算阅读量；中文按字、其他语言按词计算。 */
export function getReadingStats(body: string) {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#>~|]/g, ' ');
  const han = plain.match(/\p{Script=Han}/gu)?.length ?? 0;
  const words =
    plain
      .replace(/\p{Script=Han}/gu, ' ')
      .match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  const units = han + words;
  const minutes = Math.max(1, Math.ceil(han / 300 + words / 220));
  return { units, minutes };
}

/** 提取正文首个非标题文本块，用于列表单行预览；不使用 description 代替正文。 */
export function getWritingExcerpt(body: string): string {
  const plainBlock = (block: string) =>
    block
      .split('\n')
      .filter((line) => !/^\s*(?:import|export)\b/.test(line))
      .join(' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/(?:\*\*|__|\*|_|~~)/g, ' ')
      .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, '')
      .replace(/^\s*>\s?/gm, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[\t ]+/g, ' ')
      .replace(/(\p{Script=Han})\s+(?=[（【《“‘])/gu, '$1')
      .trim();

  return (
    body
      .replace(/```[\s\S]*?```/g, ' ')
      .split(/\n{2,}/)
      .map(plainBlock)
      .find(
        (block) =>
          block && !/^#{1,6}\s/.test(block) && /\p{L}|\p{N}/u.test(block),
      ) ?? ''
  );
}
