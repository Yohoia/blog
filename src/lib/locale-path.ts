import type { Locale } from "@/config/locale";
export function getLocale(path: string): Locale {
  return /^\/en(?:\/|$)/.test(path) ? "en" : "zh";
}
export function unlocalizedPath(path: string): string {
  return path.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "") || "/";
}
export function localizePath(path: string, locale: Locale): string {
  const clean = unlocalizedPath(path);
  return locale === "en" ? `/en${clean === "/" ? "" : clean}` : clean;
}
