// src/data/posts.ts
import fm from "front-matter";

type FrontMatter = {
  title?: string;
  date?: string;
  tags?: string[] | string;
  summary?: string;
  draft?: boolean;
  slug?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO o YYYY-MM-DD
  tags: string[];
  summary: string;
  draft: boolean;
  content: string; // markdown
  file: string; // ruta relativa dentro de /posts
};

export type BlogPostMeta = Omit<BlogPost, "content">;

function baseUrl(): string {
  // En dev suele ser "/"
  // En GitHub Pages será "/<repo>/"
  const b = import.meta.env.BASE_URL ?? "/";
  return b.endsWith("/") ? b : `${b}/`;
}

function slugFromFile(file: string) {
  const noExt = file.replace(/\.md$/i, "");
  const parts = noExt.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? noExt;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asBoolean(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function asTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(md: string, maxLen = 180) {
  const txt = stripMarkdown(md);
  return txt.length > maxLen ? `${txt.slice(0, maxLen - 1)}…` : txt;
}

// -----------------------------
// Runtime loading (fetch) + cache
// -----------------------------
let cachePosts: BlogPost[] | null = null;
let cacheMeta: BlogPostMeta[] | null = null;

async function fetchIndex(): Promise<string[]> {
  const url = `${baseUrl()}posts/index.json`;
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
  const data = (await res.json()) as { files?: string[] };
  return data.files ?? [];
}

async function fetchRaw(file: string): Promise<string> {
  const url = `${baseUrl()}posts/${file}`;
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
  return await res.text();
}

function buildPostFromRaw(file: string, raw: string): BlogPost {
  const parsed = fm<FrontMatter>(raw);
  const data = parsed.attributes ?? {};
  const content = (parsed.body ?? "").trim();

  const slug = asString(data.slug, slugFromFile(file));
  const title = asString(data.title, slug);
  const date = asString(data.date, "");
  const tags = asTags(data.tags);
  const draft = asBoolean(data.draft, false);

  const summary = asString(data.summary, "") || excerpt(content);

  return { slug, title, date, tags, summary, draft, content, file };
}

function sortByDateDesc(posts: BlogPost[]) {
  posts.sort((a, b) => {
    const ta = Date.parse(a.date) || 0;
    const tb = Date.parse(b.date) || 0;
    return tb - ta;
  });
  return posts;
}

/**
 * Carga posts desde /posts/*.md (public) usando /posts/index.json.
 * - Filtra drafts por defecto
 * - Ordena por fecha desc
 * - Cachea en memoria para no repetir fetch en navegación
 */
export async function getPosts(): Promise<BlogPost[]> {
  if (cachePosts) return cachePosts;

  const files = await fetchIndex();
  const raws = await Promise.all(files.map((f) => fetchRaw(f)));

  const all = files.map((f, i) => buildPostFromRaw(f, raws[i]));

  const published = all.filter((p) => !p.draft);
  sortByDateDesc(published);

  cachePosts = published;
  cacheMeta = published.map(({ content, ...meta }) => meta);

  return cachePosts;
}

export async function getPostsMeta(): Promise<BlogPostMeta[]> {
  if (cacheMeta) return cacheMeta;
  await getPosts(); // rellena cacheMeta
  return cacheMeta ?? [];
}

export async function getRecentPosts(n = 5): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.slice(0, n);
}

export async function getRecentPostsMeta(n = 5): Promise<BlogPostMeta[]> {
  const meta = await getPostsMeta();
  return meta.slice(0, n);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}
