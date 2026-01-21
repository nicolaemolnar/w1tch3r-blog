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
};

export type BlogPostMeta = Omit<BlogPost, "content">;

const modules = import.meta.glob("./posts/*.md", { as: "raw", eager: true });

function slugFromPath(path: string) {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.md$/i, "");
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

const all: BlogPost[] = Object.entries(modules).map(([path, raw]) => {
  const parsed = fm<FrontMatter>(raw);
  const data = parsed.attributes ?? {};
  const content = (parsed.body ?? "").trim();

  const slug = asString(data.slug, slugFromPath(path));
  const title = asString(data.title, slug);
  const date = asString(data.date, "");
  const tags = asTags(data.tags);
  const draft = asBoolean(data.draft, false);

  const summary = asString(data.summary, "") || excerpt(content);

  return {
    slug,
    title,
    date,
    tags,
    summary,
    draft,
    content,
  };
});

// fuera drafts por defecto
const published = all.filter((p) => !p.draft);

// orden por fecha desc (si no hay fecha válida, cae al final)
published.sort((a, b) => {
  const ta = Date.parse(a.date) || 0;
  const tb = Date.parse(b.date) || 0;
  return tb - ta;
});

const bySlug = new Map(published.map((p) => [p.slug, p] as const));

// ✅ IMPORTANTE: posts ahora incluye content para poder buscar en contenido
export const posts: BlogPost[] = published;

// (Opcional) si en algún sitio quieres solo meta
export const postsMeta: BlogPostMeta[] = published.map(({ content, ...meta }) => meta);

export const recentPosts: BlogPost[] = posts.slice(0, 5);
export const recentPostsMeta: BlogPostMeta[] = postsMeta.slice(0, 5);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}
