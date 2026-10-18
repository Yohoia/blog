import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePublishedBlogSources,
  getBlogEntries,
  getProjects,
  getSkills,
  normalizeAssetPaths,
} from "../src/lib/content";
import {
  getLocale,
  localizePath,
  unlocalizedPath,
} from "../src/lib/locale-path";
test("public article collection filters drafts and archived articles, preserving nested IDs and stable UTC order", () => {
  const sources = [
    ["older", "published", false, "2026-09-30"],
    ["nested/new", "published", false, "2026-10-01"],
    ["draft", "draft", false, "2026-10-03"],
    ["hidden", "published", true, "2026-10-04"],
    ["archived", "archived", false, "2026-10-05"],
  ].map(([id, status, draft, date]) => ({
    id: String(id),
    source: `---\ntitle: ${id}\ndescription: Example\nstatus: ${status}\ndraft: ${draft}\npublishedAt: ${date}\n---\n\nReal body`,
  }));
  const entries = parsePublishedBlogSources(sources);
  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["nested/new", "older"],
  );
  assert.equal(
    entries[0].data.publishedAt.toISOString(),
    "2026-10-01T00:00:00.000Z",
  );
});
test("real content and latest project/skill changes survive migration", async () => {
  assert.deepEqual(
    (await getBlogEntries()).map((e) => e.id),
    ["knn", "machine-learning-overview"],
  );
  assert.deepEqual(
    (await getProjects()).map((e) => e.data.title),
    ["DiDa-todo", "yoho-web-clipper"],
  );
  const skills = await getSkills();
  assert.deepEqual(
    skills.map((e) => e.data.title),
    ["yoho-speckit", "yoho-retro-poster"],
  );
  for (const entry of skills)
    assert.equal(
      entry.data.url,
      `https://github.com/Yohoia/${entry.data.title}`,
    );
  assert.equal(
    normalizeAssetPaths("![Cover](../../assets/images/blog/cover.png)"),
    "![Cover](/media/blog/cover.png)",
  );
});
test("locale routes retain shared sections and nested article paths", () => {
  assert.equal(
    localizePath("/blog/nested/article", "en"),
    "/en/blog/nested/article",
  );
  assert.equal(localizePath("/en/blog/knn", "zh"), "/blog/knn");
  assert.equal(localizePath("/", "en"), "/en");
  assert.equal(unlocalizedPath("/en/"), "/");
  assert.equal(getLocale("/english"), "zh");
  assert.equal(getLocale("/en/skill"), "en");
});
