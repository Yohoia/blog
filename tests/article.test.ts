import test from "node:test";
import assert from "node:assert/strict";
import type { JSONContent } from "@tiptap/core";
import { renderArticle } from "../src/lib/article";
import { getBlogEntries } from "../src/lib/content";
function flatten(node: JSONContent): JSONContent[] {
  return [node, ...(node.content ?? []).flatMap(flatten)];
}
test("Tiptap Simple Editor schema supports headings, code, tasks, tables, images and math", async () => {
  const source = [
    "## 中文 标题",
    "Paragraph with **bold** and $x^2$.",
    "## 中文 标题",
    "- [x] Finished",
    "- [ ] Pending",
    "| A | B |\n| --- | --- |\n| 1 | 2 |",
    "![Cover](/media/blog/knn/cover.png)",
    "```javascript\nconst value = 1\n```",
    "$$\ny = x + 1\n$$",
  ].join("\n\n");
  const result = await renderArticle(source);
  const nodes = flatten(result.content);
  assert.deepEqual(
    result.headings.map((h) => h.slug),
    ["中文-标题", "中文-标题-1"],
  );
  for (const type of [
    "heading",
    "taskList",
    "taskItem",
    "table",
    "image",
    "codeBlock",
    "inlineMath",
    "blockMath",
  ])
    assert.ok(
      nodes.some((node) => node.type === type),
      `Missing ${type}`,
    );
  assert.match(result.html, /katex/);
  assert.match(result.html, /--shiki-dark/);
  assert.match(result.html, /<input disabled tabindex="-1"/);
  assert.equal(nodes.find((node) => node.type === "image")?.attrs?.width, 1672);
  assert.doesNotMatch(result.html, /contenteditable="true"/);
});
test("source markup cannot introduce executable links, scripts or SVG image payloads", async () => {
  const result = await renderArticle(
    "[bad](javascript:alert%281%29)\n\n![bad](data:image/svg+xml,evil)\n\n<script>alert(1)</script>",
  );
  assert.doesNotMatch(result.html, /href="javascript:|src="data:|<script[ >]/i);
});
test("real article headings, pictures and formulas remain available in server HTML", async () => {
  for (const entry of await getBlogEntries()) {
    const result = await renderArticle(entry.body);
    assert.ok(result.headings.length >= 9);
    for (const heading of result.headings)
      assert.ok(result.html.includes(`id="${heading.slug}"`));
    assert.match(result.html, /src="\/media\/blog\//);
    if (entry.id === "knn") {
      assert.match(result.html, /katex/);
      assert.equal(
        flatten(result.content).filter((n) => n.type === "image").length,
        3,
      );
    }
  }
});
