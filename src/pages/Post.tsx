import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import { getPostBySlug } from "../data/posts";
import { buildTocFromHeadings, extractHeadings, type TocItem } from "../utils/toc";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

const HEADER_OFFSET = 96;      // ajusta si tu navbar fija tapa títulos
const SIDEBAR_WIDTH = 320;     // ancho del sidebar
const SIDEBAR_GAP = 24;        // separación contenido-sidebar

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({
    top: y,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });

  history.replaceState(null, "", `#${encodeURIComponent(id)}`);
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const headings = useMemo(() => extractHeadings(post.content), [post.slug, post.content]);
  const toc = useMemo(() => buildTocFromHeadings(headings), [headings]);

  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");

  // Scroll-spy
  useEffect(() => {
    if (!toc.length) return;

    const elements = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { root: null, rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [post.slug, toc]);

  // Hash al entrar (ya con IDs reales del DOM)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.replace("#", ""));
    requestAnimationFrame(() => {
      if (document.getElementById(id)) scrollToHeading(id);
    });
  }, [post.slug]);

  const onTocClick = (item: TocItem) => {
    scrollToHeading(item.id);
    setActiveId(item.id);
  };

  return (
    <div className="postLayout">
      <div
        className="postContainer"
        style={{
          paddingRight: toc.length ? undefined : SIDEBAR_WIDTH + SIDEBAR_GAP,
        }}
      >
        <main className="postMain">
          <header className="postHeader">
            <h1 className="postTitle">{post.title}</h1>
            <div className="postMeta">
              {post.date}
              {post.tags?.length ? <span> · {post.tags.join(" · ")}</span> : null}
            </div>
          </header>

          {/* TOC móvil */}
          {toc.length ? (
            <details className="postTocMobile">
              <summary>Índice</summary>
              <nav className="postTocNav">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTocClick(item)}
                    className={[
                      "postTocBtn",
                      item.level === 3 ? "lvl3" : item.level === 4 ? "lvl4" : "lvl2",
                      activeId === item.id ? "active" : "",
                    ].join(" ")}
                    type="button"
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </details>
          ) : null}

          <article className="markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </main>
      </div>

      {/* Sidebar fijo (desktop) */}
      {toc.length ? (
        <aside
          className="postSidebar"
          style={{
            top: HEADER_OFFSET,
            width: SIDEBAR_WIDTH,
          }}
        >
          <div className="postSidebarInner">
            <div className="postSidebarTitle">Índice</div>

            <nav className="postTocNav">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTocClick(item)}
                  className={[
                    "postTocBtn",
                    item.level === 3 ? "lvl3" : item.level === 4 ? "lvl4" : "lvl2",
                    activeId === item.id ? "active" : "",
                  ].join(" ")}
                  aria-current={activeId === item.id ? "true" : "false"}
                  type="button"
                >
                  {item.text}
                </button>
              ))}
            </nav>

            <button
              className="postBackTop"
              onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
              type="button"
            >
              Volver arriba
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
