import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET = 96; // px

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si hay hash (anclas), deja que el navegador haga lo suyo
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({
    top: y,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });

  history.replaceState(null, "", `#${encodeURIComponent(id)}`);
}