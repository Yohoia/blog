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
