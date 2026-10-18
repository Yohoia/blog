import "server-only";
import { Pool } from "pg";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { BlogEntry } from "./content";
import { articleShortId, articleIdFromShortId } from "./article-address";
let pool: Pool | undefined;
export function database() {
  if (!process.env.BLOG_DATABASE_URL)
    throw new Error("BLOG_DATABASE_URL is required for PageHush content");
  return (pool ??= new Pool({
    connectionString: process.env.BLOG_DATABASE_URL,
    max: 4,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    options: "-c default_transaction_read_only=on -c statement_timeout=10000",
  }));
}
export const publishedArticlesSql = `SELECT a.id,a.slug,a.title,a.description,a.content,a.language,a.published_at,a.updated_at,a.cover_asset_id,a.cover_url,a.cover_alt,
 COALESCE((SELECT array_agg(t.name ORDER BY t.name) FROM article_tags at JOIN tags t ON t.id=at.tag_id WHERE at.article_id=a.id),'{}') AS tags
 FROM articles a WHERE a.status='published' AND a.deleted_at IS NULL ORDER BY a.published_at DESC,a.id`;
interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  language: "zh" | "en";
  published_at: Date;
  updated_at: Date | null;
  cover_asset_id: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  tags: string[];
}
const assetPattern =
  /(?:https?:\/\/[^\s"'<>()[\]]+)?\/v1\/assets\/([a-f0-9-]{36})\/content(?:\?[^\s"'<>()[\]]*)?/gi;
export function publishedAssetIds(markdown: string): string[] {
  return [...markdown.matchAll(assetPattern)].map((match) =>
    match[1].toLowerCase(),
  );
}
function rewriteAssets(markdown: string) {
  return markdown.replace(
    assetPattern,
    (_, id: string) => `/api/assets/${id.toLowerCase()}`,
  );
}
export async function readPublishedArticles(): Promise<BlogEntry[]> {
  const { rows } = await database().query<ArticleRow>(publishedArticlesSql);
  return rows.map((row) => {
    const id = articleShortId(row.id);
    const cover = row.cover_asset_id
      ? `/api/assets/${row.cover_asset_id}`
      : row.cover_url
        ? rewriteAssets(row.cover_url)
        : undefined;
    return {
      id,
      slug: row.slug.replace(/\.mdx?$/, "").replace(/^\/+|\/+$/g, ""),
      body: rewriteAssets(row.content),
      data: {
        title: row.title,
        description: row.description,
        status: "published",
        draft: false,
        publishedAt: row.published_at,
        updatedAt: row.updated_at ?? undefined,
        language: row.language,
        tags: row.tags,
        thumbnail: cover,
        thumbnailAlt: row.cover_alt ?? undefined,
      },
    };
  });
}
interface AssetRow {
  object_key: string;
  mime_type: string;
  size: number;
}
/** Only assets referenced by a currently published article can cross the public boundary. */
export async function readPublishedAsset(id: string) {
  const { rows: articles } = await database().query<{
    content: string;
    cover_asset_id: string | null;
  }>(
    `SELECT content,cover_asset_id FROM articles WHERE status='published' AND deleted_at IS NULL AND (cover_asset_id=$1::uuid OR content ILIKE '%' || $1 || '%')`,
    [id],
  );
  if (
    !articles.some(
      (article) =>
        article.cover_asset_id === id ||
        publishedAssetIds(article.content).includes(id),
    )
  )
    return undefined;
  const { rows } = await database().query<AssetRow>(
    `SELECT object_key,mime_type,size FROM assets WHERE id=$1 AND status='ready' AND deleted_at IS NULL`,
    [id],
  );
  const asset = rows[0];
  if (
    !asset ||
    ![
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif",
    ].includes(asset.mime_type)
  )
    return undefined;
  const {
    BLOG_S3_ENDPOINT,
    BLOG_S3_REGION,
    BLOG_S3_BUCKET,
    BLOG_S3_ACCESS_KEY_ID,
    BLOG_S3_SECRET_ACCESS_KEY,
  } = process.env;
  if (
    !BLOG_S3_ENDPOINT ||
    !BLOG_S3_BUCKET ||
    !BLOG_S3_ACCESS_KEY_ID ||
    !BLOG_S3_SECRET_ACCESS_KEY
  )
    throw new Error("PageHush image storage is not configured");
  const storage = new S3Client({
    endpoint: BLOG_S3_ENDPOINT,
    region: BLOG_S3_REGION || "us-east-1",
    forcePathStyle: true,
    credentials: {
      accessKeyId: BLOG_S3_ACCESS_KEY_ID,
      secretAccessKey: BLOG_S3_SECRET_ACCESS_KEY,
    },
  });
  try {
    const object = await storage.send(
      new GetObjectCommand({ Bucket: BLOG_S3_BUCKET, Key: asset.object_key }),
    );
    if (!object.Body) return undefined;
    return {
      body: await object.Body.transformToByteArray(),
      type: asset.mime_type,
    };
  } finally {
    storage.destroy();
  }
}

/** Resolve both canonical PageHush IDs and previous slug URLs, after publication filtering. */
export async function resolvePublishedArticleId(
  id: string,
): Promise<string | undefined> {
  const uuid = articleIdFromShortId(id);
  const { rows } = await database().query<{ id: string }>(
    `SELECT id FROM articles WHERE status='published' AND deleted_at IS NULL
     AND (id=$1::uuid OR slug = ANY($2::text[]))
     ORDER BY CASE WHEN id=$1::uuid THEN 0 ELSE 1 END LIMIT 1`,
    [uuid, [id, `${id}.md`, `${id}.mdx`]],
  );
  return rows[0] ? articleShortId(rows[0].id) : undefined;
}
