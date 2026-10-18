import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.BLOG_TEST_URL || "http://127.0.0.1:3000";
for (const locale of ["", "/en"])
  for (const path of [
    "/",
    "/blog",
    "/project",
    "/skill",
    "/blog/knn",
    "/blog/machine-learning-overview",
    "/403",
    "/404",
    "/500",
    "/502",
  ]) {
    const url = locale + (path === "/" ? "" : path) || "/";
    test(`GET ${url} renders its complete document`, async () => {
      const response = await fetch(base + url);
      assert.equal(
        response.status,
        !locale && ["/404", "/500"].includes(path)
          ? Number(path.slice(1))
          : 200,
      );
      const html = await response.text();
      assert.match(html, /id="main-content"/);
      assert.doesNotMatch(
        html,
        /data-next-error-message|NEXT_HTTP_ERROR_FALLBACK/,
      );
      if (path.startsWith("/blog/")) {
        assert.match(html, /data-tiptap-template="simple"/);
        assert.match(html, /data-readonly="true"/);
      }
      if (/^\/\d+$/.test(path)) {
        assert.match(html, /noindex/);
        assert.doesNotMatch(html, /class="site-header"/);
      }
    });
  }
for (const path of [
  "/fragments",
  "/now",
  "/news",
  "/finder",
  "/en/finder",
  "/blog/not-published",
  "/unknown",
])
  test(`GET ${path} returns custom 404`, async () => {
    const response = await fetch(base + path);
    assert.equal(response.status, 404);
    assert.match(await response.text(), /data-error-code="404"/);
  });
for (const [from, to] of [
  ["/projects", "/project"],
  ["/skills", "/skill"],
  ["/en/projects", "/en/project"],
  ["/en/skills", "/en/skill"],
])
  test(`${from} redirects to ${to}`, async () => {
    const response = await fetch(base + from, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get("location")!, base).pathname, to);
  });
test("unknown assets are not exposed", async () => {
  assert.equal(
    (await fetch(base + "/api/assets/00000000-0000-0000-0000-000000000000"))
      .status,
    404,
  );
});
