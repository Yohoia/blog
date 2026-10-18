import test from "node:test";
import assert from "node:assert/strict";
import {
  database,
  readPublishedArticles,
  publishedAssetIds,
} from "../../src/lib/pagehush";
import { articleShortId } from "../../src/lib/article-address";

const base = process.env.BLOG_TEST_URL || "http://127.0.0.1:3001";
assert.equal(process.env.BLOG_CONTENT_SOURCE, "pagehush");

test("PageHush live integration uses read-only connections and published database content", async (t) => {
  const db = database();
  try {
    const { rows: settings } = await db.query(
      "SHOW default_transaction_read_only",
    );
    assert.equal(settings[0].default_transaction_read_only, "on");
    const { rows: published } = await db.query<{
      id: string;
      slug: string;
      title: string;
      published_at: Date;
      content: string;
      cover_asset_id: string | null;
    }>(
      "SELECT id,slug,title,published_at,content,cover_asset_id FROM articles WHERE status='published' AND deleted_at IS NULL ORDER BY published_at DESC,id",
    );
    const entries = await readPublishedArticles();
    assert.deepEqual(
      entries.map((entry) => entry.id),
      published.map((row) => articleShortId(row.id)),
    );

    await t.test(
      "bilingual archives expose exactly the published rows",
      async () => {
        for (const locale of ["", "/en"]) {
          const response = await fetch(base + locale + "/blog");
          assert.equal(response.status, 200);
          assert.match(response.headers.get("cache-control") || "", /no-store/);
          const html = await response.text();
          const renderedIds = [
            ...html.matchAll(/<li id="([^"]+)" data-language-block="blog-/g),
          ].map((match) => match[1]);
          assert.deepEqual(
            renderedIds.sort(),
            entries.map((entry) => entry.id).sort(),
          );
          for (const row of published) {
            assert.ok(
              html.includes(`href="${locale}/blog/${articleShortId(row.id)}"`),
            );
            assert.ok(
              html.includes(row.published_at.toISOString()),
              "Publication date must come from PageHush",
            );
          }
        }
      },
    );

    await t.test(
      "published detail pages use Tiptap and public image URLs",
      async () => {
        for (const entry of entries) {
          const response = await fetch(
            base +
              "/blog/" +
              entry.id.split("/").map(encodeURIComponent).join("/"),
          );
          assert.equal(response.status, 200);
          const html = await response.text();
          assert.match(html, /data-tiptap-template="simple"/);
          assert.match(html, /data-readonly="true"/);
          assert.ok(html.includes(entry.data.title));
          for (const id of publishedAssetIds(
            published.find((row) => articleShortId(row.id) === entry.id)!
              .content,
          ))
            assert.ok(html.includes(`/api/assets/${id}`));
        }
      },
    );

    await t.test(
      "old slug URLs redirect to the same PageHush ID in both languages",
      async () => {
        for (const row of published) {
          const id = articleShortId(row.id);
          for (const locale of ["", "/en"]) {
            const legacy = row.slug.replace(/\.mdx?$/, "");
            const response = await fetch(
              base + locale + "/blog/" + legacy + "?from=legacy",
              { redirect: "manual" },
            );
            assert.equal(response.status, 308);
            const location = new URL(response.headers.get("location")!, base);
            assert.equal(location.pathname, `${locale}/blog/${id}`);
            assert.equal(location.search, "?from=legacy");
            const canonical = await fetch(base + locale + "/blog/" + id, {
              redirect: "manual",
            });
            assert.equal(canonical.status, 200);
            const html = await canonical.text();
            assert.ok(
              html.includes(
                `rel="canonical" href="${process.env.SITE_URL}${locale}/blog/${id}"`,
              ),
            );
          }
        }
        const sitemap = await (await fetch(base + "/sitemap.xml")).text();
        for (const row of published) {
          assert.ok(sitemap.includes(`/blog/${articleShortId(row.id)}</loc>`));
          assert.ok(!sitemap.includes(`/blog/${row.slug}</loc>`));
        }
      },
    );

    await t.test(
      "published images return their stored raster bytes without caching",
      async () => {
        const ids = new Set(
          published.flatMap((row) => [
            ...publishedAssetIds(row.content),
            ...(row.cover_asset_id ? [row.cover_asset_id] : []),
          ]),
        );
        for (const id of ids) {
          const response = await fetch(base + "/api/assets/" + id);
          assert.equal(response.status, 200);
          assert.match(
            response.headers.get("content-type") || "",
            /^image\/(png|jpeg|webp|gif|avif)$/,
          );
          assert.equal(response.headers.get("cache-control"), "no-store");
          assert.ok((await response.arrayBuffer()).byteLength > 0);
        }
      },
    );

    await t.test(
      "draft, archived and deleted detail URLs remain inaccessible",
      async () => {
        const { rows: hidden } = await db.query<{ id: string; slug: string }>(
          "SELECT id,slug FROM articles WHERE status <> 'published' OR deleted_at IS NOT NULL",
        );
        const activeSlugs = new Set(entries.map((entry) => entry.slug));
        for (const row of hidden) {
          const slug = row.slug.replace(/\.mdx?$/, "");
          const ids = [
            articleShortId(row.id),
            ...(!activeSlugs.has(slug) ? [slug] : []),
          ];
          for (const id of ids)
            for (const locale of ["", "/en"])
              assert.equal(
                (
                  await fetch(
                    base +
                      locale +
                      "/blog/" +
                      id.split("/").map(encodeURIComponent).join("/"),
                  )
                ).status,
                404,
              );
        }
      },
    );

    await t.test("unknown and invalid short IDs return 404", async () => {
      for (const id of ["z".repeat(22), "_".repeat(22), "unknown-article"])
        assert.equal(
          (await fetch(base + "/blog/" + id, { redirect: "manual" })).status,
          404,
        );
    });

    await t.test(
      "assets outside published content are not public",
      async () => {
        const referenced = new Set(
          published.flatMap((row) => [
            ...publishedAssetIds(row.content),
            ...(row.cover_asset_id ? [row.cover_asset_id] : []),
          ]),
        );
        const { rows: assets } = await db.query<{ id: string }>(
          "SELECT id FROM assets",
        );
        for (const asset of assets
          .filter((row) => !referenced.has(row.id))
          .slice(0, 3))
          assert.equal(
            (await fetch(base + "/api/assets/" + asset.id)).status,
            404,
          );
      },
    );
  } finally {
    await db.end();
  }
});
