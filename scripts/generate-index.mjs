import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function generate_index (md_path) {
  const dir = path.resolve(md_path);
  const files = (await readdir(dir))
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();

  await writeFile(
    path.join(dir, "index.json"),
    JSON.stringify({ files }, null, 2),
    "utf8"
  );

  console.log(`✅ Archivo ${dir}/index.json generado para (${files.length} archivos)`);
}

generate_index ("./public/posts")
generate_index ("./public/projects")