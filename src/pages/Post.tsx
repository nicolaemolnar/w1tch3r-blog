import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getPostBySlug } from "../data/posts";
import { buildTocFromHeadings, extractHeadings, type TocItem } from "../utils/toc";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

// Ajusta esto al alto real de tu navbar/header fijo (en px)
const HEADER_OFFSET = 96;

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

  // Para asignar IDs consistentes a los headings renderizados
  const headingIds = useMemo(() => headings.map((h) => h.id), [headings]);
  let headingCursor = 0;
  const nextHeadingId = () => headingIds[headingCursor++];

  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");

  // Scroll-spy (IntersectionObserver)
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
      {
        root: null,
        rootMargin: "-15% 0px -70% 0px",
        threshold: [0, 1],
      }
    );

    elements.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [post.slug, toc]);

  // Si vienes con hash (#seccion), scrollea con offset
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.replace("#", ""));

    // Espera un frame por si ReactMarkdown aún no ha pintado headings
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) scrollToHeading(id);
    });
  }, [post.slug]);

  const onTocClick = (item: TocItem) => {
    scrollToHeading(item.id);
    setActiveId(item.id);
  };

  // Sidebar fijo a la derecha, dejamos padding al contenido para que no lo tape
  const SIDEBAR_W = 320;

  return (
    <div className="relative">
      {/* Sidebar TOC desktop pegado al lado de la pantalla */}
      {toc.length ? (
        <aside className="hidden lg:block fixed right-0 top-24 h-[calc(100vh-6rem)] w-[320px] pr-6">
          <div className="h-full rounded-l-2xl border border-white/10 bg-black/20 backdrop-blur p-4 overflow-auto">
            <div className="mb-3 text-sm font-semibold opacity-90">Índice</div>

            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTocClick(item)}
                  className={[
                    "block w-full rounded-md px-2 py-1 text-left text-sm",
                    "hover:bg-white/5",
                    item.level === 3 ? "pl-5" : item.level === 4 ? "pl-8" : "pl-2",
                    activeId === item.id ? "bg-white/5 font-semibold opacity-100" : "opacity-80",
                  ].join(" ")}
                  aria-current={activeId === item.id ? "true" : "false"}
                >
                  {item.text}
                </button>
              ))}
            </nav>

            <div className="mt-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
                className="text-sm opacity-70 hover:opacity-100"
              >
                Volver arriba
              </button>
            </div>
          </div>
        </aside>
      ) : null}

      {/* Contenido (dejamos margen derecho en desktop para el sidebar fijo) */}
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        style={{ paddingRight: toc.length ? SIDEBAR_W : undefined }}
      >
        <div className="py-10">
          <main className="min-w-0">
            <header className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
              <div className="mt-2 text-sm opacity-80">
                {post.date}
                {post.tags?.length ? <span> · {post.tags.join(" · ")}</span> : null}
              </div>
            </header>

            {/* En móvil: TOC plegable arriba */}
            {toc.length ? (
              <details className="mb-6 rounded-xl border border-white/10 p-4 lg:hidden">
                <summary className="cursor-pointer select-none font-medium">Índice</summary>
                <nav className="mt-3 space-y-1">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onTocClick(item)}
                      className={[
                        "block w-full text-left text-sm opacity-90 hover:opacity-100",
                        item.level === 3 ? "pl-4" : item.level === 4 ? "pl-8" : "pl-0",
                        activeId === item.id ? "font-semibold opacity-100" : "",
                      ].join(" ")}
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
                components={{
                  h1: ({ children, ...props }) => {
                    const id = nextHeadingId();
                    return (
                      <h1
                        id={id}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                        {...props}
                      >
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ children, ...props }) => {
                    const id = nextHeadingId();
                    return (
                      <h2
                        id={id}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                        {...props}
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children, ...props }) => {
                    const id = nextHeadingId();
                    return (
                      <h3
                        id={id}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                        {...props}
                      >
                        {children}
                      </h3>
                    );
                  },
                  h4: ({ children, ...props }) => {
                    const id = nextHeadingId();
                    return (
                      <h4
                        id={id}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                        {...props}
                      >
                        {children}
                      </h4>
                    );
                  },
                  h5: ({ children, ...props }) => {
                    const id = nextHeadingId();
                    return (
                      <h5
                        id={id}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                        {...props}
                      >
                        {children}
                      </h5>
                    );
                  },
                  h6: ({ children, ...props }) => {
                    const id = nextHeadingId();
                    return (
                      <h6
                        id={id}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                        {...props}
                      >
                        {children}
                      </h6>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
