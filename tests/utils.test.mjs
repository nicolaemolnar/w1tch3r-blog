import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { formatDate } from "../src/utils/format.ts";
import { prefersReducedMotion, scrollToId } from "../src/utils/scroll.ts";

test("formatDate formats real dates and handles invalid calendar dates", () => {
  assert.equal(formatDate("2026-11-17"), "17 de noviembre de 2026");
  assert.equal(formatDate("2024-02-29"), "29 de febrero de 2024");
  for (const date of ["", "invalid", "2026-02-29", "2026-02-30", "2026-04-31", "2026-13-01", "2026-00-01", "2026-01-00"]) {
    assert.equal(formatDate(date), "Fecha no disponible", date);
  }
});

test("heading navigation respects motion preference, offset, and missing targets", (t) => {
  let reduced = true;
  let targetExists = true;
  const scrolls = [];
  const hashes = [];
  const originals = new Map(["window", "document", "history"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  globalThis.window = {
    matchMedia: () => ({ matches: reduced }),
    scrollY: 200,
    scrollTo: (options) => scrolls.push(options),
  };
  globalThis.document = {
    getElementById: () => targetExists ? { getBoundingClientRect: () => ({ top: 100 }) } : null,
  };
  globalThis.history = { replaceState: (...args) => hashes.push(args[2]) };

  scrollToId("heading with spaces");
  assert.deepEqual(scrolls[0], { top: 204, behavior: "instant" });
  assert.equal(hashes[0], "#heading%20with%20spaces");
  reduced = false;
  scrollToId("another");
  assert.deepEqual(scrolls[1], { top: 204, behavior: "smooth" });
  targetExists = false;
  scrollToId("missing");
  assert.equal(scrolls.length, 2);
  assert.equal(hashes.length, 2);
  delete window.matchMedia;
  assert.equal(prefersReducedMotion(), false);
});

test("source files use UTF-8 without BOM or corrupted characters", () => {
  const root = new URL("../src/", import.meta.url);
  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(tsx?|css|svg)$/.test(entry.name)) continue;
    const filename = path.join(entry.parentPath, entry.name);
    const bytes = readFileSync(filename);
    assert.notDeepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], filename);
    assert.doesNotMatch(decoder.decode(bytes), /\u00c3|\u00c2|\u00e2\u20ac|\u00f0\u0178|\ufffd/, filename);
  }
});
