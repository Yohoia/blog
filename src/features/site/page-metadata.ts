import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Locale } from "@/config/locale";
import { localizePath } from "@/lib/locale-path";
import { getBlogEntry } from "@/lib/content";
import { parseSiteRoute } from "./site-route";

export async function getPageMetadata(pathname: string): Promise<Metadata> {
  const { locale, path, plain } = parseSiteRoute(pathname);
  let title =
    plain === "/" ? "Index" : plain.slice(1, 2).toUpperCase() + plain.slice(2);
  let description: string | undefined;

  if (plain.startsWith("/blog/")) {
    if (process.env.BLOG_CONTENT_SOURCE === "pagehush") await connection();
    const entry = await getBlogEntry(plain.slice(6));
    if (entry) {
      title = entry.data.title;
      description = entry.data.description;
    } else notFound();
  }

  if (
    ![
      "/",
      "/blog",
      "/project",
      "/skill",
      "/403",
      "/404",
      "/500",
      "/502",
    ].includes(plain) &&
    !plain.startsWith("/blog/")
  )
    notFound();

  const error = /^\/(403|404|500|502)$/.test(plain);

  return {
    title,
    description,
    ...(error
      ? { robots: { index: false, follow: false } }
      : {
          ...(process.env.SITE_URL
            ? {
                alternates: {
                  canonical: path,
                  languages: {
                    "zh-CN": localizePath(plain, "zh"),
                    en: localizePath(plain, "en"),
                  },
                },
              }
            : {}),
        }),
    openGraph: {
      title,
      description,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: plain.startsWith("/blog/") ? "article" : "website",
    },
  };
}
