import test from "node:test";
import assert from "node:assert/strict";
import {
  articleShortId,
  articleIdFromShortId,
} from "../src/lib/article-address";

test("article addresses match PageHush's existing KNN link and preserve the complete UUID", () => {
  const uuid = "876fa852-8dbe-4c2a-a0af-8cc31da64b43";
  const shortId = "47YzUM1L0JE9m9WlYxf711";
  assert.equal(articleShortId(uuid), shortId);
  assert.equal(articleIdFromShortId(shortId), uuid);
  for (const id of [
    "00000000-0000-0000-0000-000000000000",
    "00000000-0000-0000-0000-000000000001",
    "ffffffff-ffff-ffff-ffff-ffffffffffff",
  ]) {
    const encoded = articleShortId(id);
    assert.equal(encoded.length, 22);
    assert.equal(articleIdFromShortId(encoded), id);
  }
});

test("malformed and overflowing identifiers are rejected", () => {
  for (const id of [
    "knn",
    "../knn",
    "z".repeat(22),
    "_".repeat(22),
    "0".repeat(23),
  ])
    assert.equal(articleIdFromShortId(id), null);
  assert.throws(() => articleShortId("invalid"));
});
