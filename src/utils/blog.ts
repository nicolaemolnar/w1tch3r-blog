import type { Post } from "../data/posts";

export type SortMode = "newest" | "oldest";
export type TagMode = "any" | "all";

export type BlogFilters = {
  query: string;
  tags: string[];       // multi-select
  sort: SortMode;
  tagMode: TagMode;     // any = que tenga alguno; all = que tenga todos
};

function toDate(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

function normalizeText(s: string) {
  // quita acentos y pasa a minúsculas
  return s
    .normalize("NFD")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function postHaystack(post: Post) {
  const content = post.content?.join(" ") ?? "";
  return normalizeText(
    [
      post.title,
      post.excerpt,
      content,
      ...(post.tags ?? []),
    ].join(" ")
  );
}

function queryTokens(query: string) {
  const q = normalizeText(query.trim());
  if (!q) return [];
  // palabras (tokens)
  return q.split(/\s+/).filter(Boolean);
}

export function getAllTags(posts: Post[]) {
  const set = new Set<string>();
  posts.forEach(p => (p.tags ?? []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getTagCounts(posts: Post[]) {
  const counts = new Map<string, number>();
  posts.forEach(p => {
    (p.tags ?? []).forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1));
  });
  return counts;
}

export function sortPosts(posts: Post[], sort: SortMode) {
  const copy = [...posts];
  copy.sort((a, b) => {
    const da = toDate(a.date).getTime();
    const db = toDate(b.date).getTime();
    return sort === "newest" ? db - da : da - db;
  });
  return copy;
}

export function filterAndSortPosts(allPosts: Post[], filters: BlogFilters) {
  const tokens = queryTokens(filters.query);
  const selectedTags = filters.tags;

  const filtered = allPosts.filter((p) => {
    // 1) texto: todas las palabras deben aparecer (AND)
    if (tokens.length) {
      const h = postHaystack(p);
      const ok = tokens.every(tok => h.includes(tok));
      if (!ok) return false;
    }

    // 2) tags
    if (selectedTags.length) {
      const postTags = new Set(p.tags ?? []);
      const matches =
        filters.tagMode === "all"
          ? selectedTags.every(t => postTags.has(t))
          : selectedTags.some(t => postTags.has(t));

      if (!matches) return false;
    }

    return true;
  });

  return sortPosts(filtered, filters.sort);
}

export function isRecentlyPublished(post: Post, days = 14) {
  const now = new Date();
  const d = toDate(post.date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

export function getRecentlyPublished(posts: Post[], days = 14, max = 3) {
  const sorted = sortPosts(posts, "newest");
  const recent = sorted.filter(p => isRecentlyPublished(p, days)).slice(0, max);

  // si no hay posts en ventana (blog pequeño), muestra los últimos max igualmente
  return recent.length ? recent : sorted.slice(0, max);
}
