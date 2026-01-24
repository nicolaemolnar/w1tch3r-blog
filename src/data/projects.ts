// src/data/projects.ts
import fm from "front-matter";

type FrontMatter = {
  // básicos
  title?: string;
  slug?: string;
  description?: string;

  // listas
  highlights?: string[] | string;
  tags?: string[] | string;

  // links
  demo?: string;
  repo?: string;

  // fecha
  year?: number | string;
  month?: string | number;

  // publicación
  draft?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
  };
  content: string; // markdown
  month?: string; // "01".."12"
  year: number; // requerido
  draft: boolean;
};

export type ProjectMeta = Omit<Project, "content">;

function baseUrl(): string {
  const b = import.meta.env.BASE_URL ?? "/";
  return b.endsWith("/") ? b : `${b}/`;
}

function slugFromFile(file: string) {
  return file.replace(/\.md$/i, "");
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asBoolean(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function asYear(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asMonth(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = typeof v === "number" ? String(v) : typeof v === "string" ? v : "";
  if (!s) return undefined;
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1 || n > 12) return undefined;
  return String(n).padStart(2, "0");
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
let cacheProjects: Project[] | null = null;
let cacheMeta: ProjectMeta[] | null = null;

async function fetchIndex(): Promise<string[]> {
  const url = `${baseUrl()}projects/index.json`;
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
  const data = (await res.json()) as { files?: string[] };
  return data.files ?? [];
}

async function fetchRaw(file: string): Promise<string> {
  const url = `${baseUrl()}projects/${file}`;
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
  return await res.text();
}

function buildProjectFromRaw(file: string, raw: string): Project {
  const parsed = fm<FrontMatter>(raw);
  const data = parsed.attributes ?? {};
  const content = (parsed.body ?? "").trim();

  const slug = asString(data.slug, slugFromFile(file));
  const title = asString(data.title, slug);

  const tags = asStringArray(data.tags);
  const highlights = asStringArray(data.highlights);

  const demo = asString(data.demo, "");
  const repo = asString(data.repo, "");

  const year = asYear(data.year, 0);
  const month = asMonth(data.month);

  const draft = asBoolean(data.draft, false);

  const description =
    asString(data.description, "").trim() || excerpt(content);

  return {
    slug,
    title,
    description,
    highlights,
    tags,
    links: {
      demo: demo || undefined,
      repo: repo || undefined,
    },
    content,
    month,
    year,
    draft,
  };
}

function sortByDateDesc(projects: Project[]) {
  // Ordena por year desc y month desc (si month no existe, lo trata como 0)
  projects.sort((a, b) => {
    const ya = a.year || 0;
    const yb = b.year || 0;
    if (yb !== ya) return yb - ya;

    const ma = a.month ? parseInt(a.month, 10) : 0;
    const mb = b.month ? parseInt(b.month, 10) : 0;
    return mb - ma;
  });
  return projects;
}

/**
 * Carga proyectos desde /projects/*.md (public) usando /projects/index.json.
 * - Filtra drafts por defecto
 * - Ordena por (year, month) desc
 * - Cachea en memoria para no repetir fetch en navegación
 */
export async function getProjects(): Promise<Project[]> {
  if (cacheProjects) return cacheProjects;

  const files = await fetchIndex();
  const raws = await Promise.all(files.map((f) => fetchRaw(f)));

  const all = files.map((f, i) => buildProjectFromRaw(f, raws[i]));

  const published = all.filter((p) => !p.draft);
  sortByDateDesc(published);

  cacheProjects = published;
  cacheMeta = published.map(({ content, ...meta }) => meta);

  return cacheProjects;
}

export async function getProjectsMeta(): Promise<ProjectMeta[]> {
  if (cacheMeta) return cacheMeta;
  await getProjects();
  return cacheMeta ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getRecentProjects(n = 5): Promise<Project[]> {
  const projects = await getProjects();
  return projects.slice(0, n);
}

export async function getRecentProjectsMeta(n = 5): Promise<ProjectMeta[]> {
  const meta = await getProjectsMeta();
  return meta.slice(0, n);
}
