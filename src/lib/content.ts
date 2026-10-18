import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/config/locale";
const common = z.object({
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
});
const blogSchema = common.extend({
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  language: z.enum(["zh", "en"]).default("zh"),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  thumbnail: z.string().optional(),
  thumbnailAlt: z.string().optional(),
});
const projectSchema = common.extend({
  descriptionEn: z.string(),
  summary: z.string(),
  summaryEn: z.string(),
  url: z.url(),
  repository: z.url(),
  logo: z.string(),
  demo: z.enum(["dida", "clipper"]).optional(),
  order: z.number(),
  linkLabel: z.string().optional(),
  linkLabelEn: z.string().optional(),
});
const skillSchema = common.extend({
  descriptionEn: z.string(),
  subtitle: z.string(),
  subtitleEn: z.string(),
  url: z.url(),
  illustration: z.string(),
  illustrationAlt: z.string(),
  illustrationAltEn: z.string(),
  order: z.number(),
});
export interface Entry<T> {
  id: string;
  body: string;
  data: T;
}
export type BlogEntry = Entry<z.infer<typeof blogSchema>> & { slug?: string };
export type ProjectEntry = Entry<z.infer<typeof projectSchema>>;
export type SkillEntry = Entry<z.infer<typeof skillSchema>>;
export function normalizeAssetPaths(text: string): string {
  return text.replace(/(?:\.\.\/)+assets\/images\//g, "/media/");
}
export function isPublished(entry: Pick<BlogEntry, "data">): boolean {
  return entry.data.status === "published" && !entry.data.draft;
}
interface ContentSource {
  id: string;
  source: string;
}
function parseSource<T>(
  { id, source }: ContentSource,
  schema: z.ZodType<T>,
): Entry<T> {
  const parsed = matter(normalizeAssetPaths(source));
  return { id, body: parsed.content, data: schema.parse(parsed.data) };
}
async function readSources(collection: string): Promise<ContentSource[]> {
  const root = path.join(process.cwd(), "content", collection);
  const sources: ContentSource[] = [];
  async function walk(dir: string) {
    for (const file of await readdir(dir, { withFileTypes: true })) {
      const location = path.join(dir, file.name);
      if (file.isDirectory()) await walk(location);
      else if (/\.mdx?$/.test(file.name))
        sources.push({
          id: path.relative(root, location).replace(/\.mdx?$/, ""),
          source: await readFile(location, "utf8"),
        });
    }
  }
  await walk(root);
  return sources;
}
async function readCollection<T>(
  collection: string,
  schema: z.ZodType<T>,
): Promise<Entry<T>[]> {
  return (await readSources(collection)).map((source) =>
    parseSource(source, schema),
  );
}
export function parsePublishedBlogSources(
  sources: ContentSource[],
): BlogEntry[] {
  return sources
    .map((source) => parseSource(source, blogSchema))
    .filter(isPublished)
    .sort(
      (a, b) =>
        b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
        a.id.localeCompare(b.id),
    );
}
export async function getBlogEntries(): Promise<BlogEntry[]> {
  const source = process.env.BLOG_CONTENT_SOURCE || "local";
  if (source === "pagehush") {
    const { readPublishedArticles } = await import("./pagehush");
    return readPublishedArticles();
  }
  if (source !== "local") throw new Error("Unsupported BLOG_CONTENT_SOURCE");
  return readLocalBlogEntries();
}
export async function readLocalBlogEntries(): Promise<BlogEntry[]> {
  return parsePublishedBlogSources(await readSources("blog"));
}
export async function getBlogEntry(id: string): Promise<BlogEntry | undefined> {
  return (await getBlogEntries()).find((entry) => entry.id === id);
}
export async function getProjects(): Promise<ProjectEntry[]> {
  return (await readCollection("projects", projectSchema))
    .filter((e) => !e.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}
export async function getSkills(): Promise<SkillEntry[]> {
  return (await readCollection("skills", skillSchema))
    .filter((e) => !e.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}
export function getLatestPosts(entries: BlogEntry[], locale: Locale) {
  return entries
    .slice(0, 6)
    .reverse()
    .map((entry) => ({
      filename: `${(entry.slug ?? entry.id).split("/").at(-1)}.md`,
      anchor: entry.id,
      date: new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
      }).format(entry.data.publishedAt),
    }));
}
