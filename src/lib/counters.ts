// src/lib/counters.ts
export function getVisitorId() {
  const k = "w1tch3r_vid";
  let v = localStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    localStorage.setItem(k, v);
  }
  return v;
}

export async function fetchPostStats(api: string, slug: string) {
  const visitorId = getVisitorId();
  const r = await fetch(`${api}/posts/${encodeURIComponent(slug)}?visitorId=${encodeURIComponent(visitorId)}`);
  if (!r.ok) throw new Error("fetchPostStats failed");
  return (await r.json()) as { views: number; likes: number; liked?: boolean };
}

export async function countViewOnce(api: string, slug: string) {
  const key = `viewed:${slug}`;
  if (localStorage.getItem(key)) return null;

  localStorage.setItem(key, "1");
  const r = await fetch(`${api}/posts/${encodeURIComponent(slug)}/view`, { method: "POST" });
  if (!r.ok) return null;
  return (await r.json()) as { views: number; likes: number };
}

export async function toggleLike(api: string, slug: string) {
  const visitorId = getVisitorId();
  const r = await fetch(`${api}/posts/${encodeURIComponent(slug)}/like`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ "visitorId": visitorId }),
  });
  if (!r.ok) throw new Error("toggleLike failed");
  return (await r.json()) as { likes: number; views: number; liked?: boolean };
}
