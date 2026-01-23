import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("./posts");
const files = (await readdir(dir))
  .filter((f) => f.toLowerCase().endsWith(".md"))
  .sort();

await writeFile(
  path.join(dir, "index.json"),
  JSON.stringify({ files }, null, 2),
  "utf8"
);

console.log(`✅ posts index generado (${files.length} archivos)`);
