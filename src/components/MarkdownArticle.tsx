import { useEffect, useMemo, useState, type ReactNode } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { HEADER_OFFSET, prefersReducedMotion, scrollToId } from "../utils/scroll";
import { buildTocFromHeadings, extractHeadings, type TocItem } from "../utils/toc";

const SIDEBAR_WIDTH = 320;
const SIDEBAR_GAP = 24;

type Props = {
  content: string;
  resolveImageSrc: (src: string) => string;
  children: ReactNode;
};

export default function MarkdownArticle({ content, resolveImageSrc, children }: Props) {
  const toc = useMemo(() => buildTocFromHeadings(extractHeadings(content)), [content]);
  const [selectedId, setSelectedId] = useState("");
  const activeId = selectedId || toc[0]?.id || "";

  useEffect(() => {
    const elements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setSelectedId(visible.target.id);
    }, { root: null, rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] });

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    if (!window.location.hash) return;
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const frame = requestAnimationFrame(() => scrollToId(id));
    return () => cancelAnimationFrame(frame);
  }, [content]);

  const onTocClick = (item: TocItem) => {
    scrollToId(item.id);
    setSelectedId(item.id);
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
          {children}

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
                    aria-current={activeId === item.id ? "true" : "false"}
                    type="button"
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </details>
          ) : null}

          <article className="markdown">
            <MarkdownRenderer
              content={content}
              resolveImageSrc={resolveImageSrc}
            />
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
              onClick={() =>
                window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" })
              }
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
