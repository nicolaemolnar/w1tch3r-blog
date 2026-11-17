import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../utils/scroll";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si hay hash (anclas), deja que el navegador haga lo suyo
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  }, [pathname, hash]);

  return null;
}
