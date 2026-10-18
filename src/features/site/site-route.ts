import type { Locale } from "@/config/locale";
import { getLocale, unlocalizedPath } from "@/lib/locale-path";

export interface SiteRoute {
  locale: Locale;
  path: string;
  plain: string;
}

export function parseSiteRoute(pathname: string): SiteRoute {
  return {
    locale: getLocale(pathname),
    path: pathname,
    plain: unlocalizedPath(pathname),
  };
}
