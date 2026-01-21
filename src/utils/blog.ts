import type { BlogPost } from "../data/posts";

export type SortMode = "newest" | "oldest";
export type TagMode = "any" | "all";

export type BlogFilters = {
  query: string;
  tags: string[];
  sort: SortMode;
  tagMode: TagMode;
};

function toTime(iso: string) {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function normalizeText(s: string) {
  return s
    .normalize("NFD")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function postHaystack(post: BlogPost) {
  const content = post.content ?? "";
  return normalizeText([post.title, post.date, content, ...(post.tags ?? [])].join(" "));
}

function queryTokens(query: string) {
  const q = normalizeText(query.trim());
  if (!q) return [];
  return q.split(/\s+/).filter(Boolean);
}

export function getAllTags(posts: BlogPost[]) {
  const set = new Set<string>();
  posts.forEach((p) => (p.tags ?? []).forEach((t: string) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getTagCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  posts.forEach((p) => {
    (p.tags ?? []).forEach((t: string) => counts.set(t, (counts.get(t) ?? 0) + 1));
  });
  return counts;
}

export function sortPosts(posts: BlogPost[], sort: SortMode) {
  const copy = [...posts];
  copy.sort((a, b) => {
    const da = toTime(a.date);
    const db = toTime(b.date);
    return sort === "newest" ? db - da : da - db;
  });
  return copy;
}

export function filterAndSortPosts(allPosts: BlogPost[], filters: BlogFilters) {
  const tokens = queryTokens(filters.query);
  const selectedTags = filters.tags;

  const filtered = allPosts.filter((p) => {
    if (tokens.length) {
      const h = postHaystack(p);
      const ok = tokens.every((tok: string) => h.includes(tok));
      if (!ok) return false;
    }

    if (selectedTags.length) {
      const postTags = new Set(p.tags ?? []);
      const matches =
        filters.tagMode === "all"
          ? selectedTags.every((t: string) => postTags.has(t))
          : selectedTags.some((t: string) => postTags.has(t));

      if (!matches) return false;
    }

    return true;
  });

  return sortPosts(filtered, filters.sort);
}

export function isRecentlyPublished(post: BlogPost, days = 14) {
  const now = Date.now();
  const d = toTime(post.date);
  const diffMs = now - d;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

export function getRecentlyPublished(posts: BlogPost[], days = 14, max = 3) {
  const sorted = sortPosts(posts, "newest");
  const recent = sorted.filter((p: BlogPost) => isRecentlyPublished(p, days)).slice(0, max);
  return recent.length ? recent : sorted.slice(0, max);
}
