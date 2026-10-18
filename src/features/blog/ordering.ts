export function sortByDate<T>(entries: T[], date: (entry: T) => Date): T[] {
  return [...entries].sort((a, b) => date(b).getTime() - date(a).getTime());
}
