export const HEADER_OFFSET = 96;

export function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  history.replaceState(null, "", `#${encodeURIComponent(id)}`);
}
