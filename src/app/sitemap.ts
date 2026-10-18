import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getBlogEntries } from "@/lib/content";
import { localizePath } from "@/lib/locale-path";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.SITE_URL) return [];
  if (process.env.BLOG_CONTENT_SOURCE === "pagehush") await connection();
  const base = process.env.SITE_URL;
  const paths = ["/", "/blog", "/project", "/skill"];
  const posts = await getBlogEntries();
  return [
    ...paths.map((path) => ({ path, modified: undefined as Date | undefined })),
    ...posts.map((post) => ({
      path: `/blog/${post.id}`,
      modified: post.data.updatedAt ?? post.data.publishedAt,
    })),
  ].flatMap(({ path, modified }) =>
    (["zh", "en"] as const).map((locale) => ({
      url: new URL(localizePath(path, locale), base).href,
      lastModified: modified,
    })),
  );
}
