// src/pages/ProjectDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import Tag from "../components/Tag";
import { getProjectBySlug, type Project } from "../data/projects";
import { buildTocFromHeadings, extractHeadings, type TocItem } from "../utils/toc";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

const HEADER_OFFSET = 96;
const SIDEBAR_WIDTH = 320;
const SIDEBAR_GAP = 24;

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

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // ✅ Hooks siempre en el mismo orden
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Derivados seguros
  const projectSlug = project?.slug ?? slug ?? "";
  const content = project?.content ?? "";

  const headings = useMemo(() => {
    if (!content) return [];
    return extractHeadings(content);
  }, [projectSlug, content]);

  const toc = useMemo(() => buildTocFromHeadings(headings), [headings]);

  const [activeId, setActiveId] = useState<string>("");

  // Cargar proyecto (async)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug) {
        if (!cancelled) {
          setNotFound(true);
          setProject(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setNotFound(false);

      try {
        const p = await getProjectBySlug(slug);
        if (cancelled) return;

        if (!p) {
          setProject(null);
          setNotFound(true);
        } else {
          setProject(p);
          setNotFound(false);
        }
      } catch (e) {
        console.error("[ProjectDetail] load error", e);
        if (cancelled) return;
        setProject(null);
        setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Cuando cambia el toc, fija activeId inicial
  useEffect(() => {
    if (toc[0]?.id) setActiveId(toc[0].id);
  }, [toc]);

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
  }, [projectSlug, toc]);

  // Hash al entrar (ya con IDs reales del DOM)
  useEffect(() => {
    if (!project) return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.replace("#", ""));
    requestAnimationFrame(() => {
      if (document.getElementById(id)) scrollToHeading(id);
    });
  }, [project]);

  const onTocClick = (item: TocItem) => {
    scrollToHeading(item.id);
    setActiveId(item.id);
  };

  // ✅ Render condicional DESPUÉS de hooks
  if (loading) {
    return (
      <div className="stack-lg">
        <header className="stack">
          <h1 className="title">Cargando…</h1>
          <p className="muted">Cargando proyecto…</p>
        </header>
      </div>
    );
  }

  if (notFound || !project) {
    return <Navigate to="/projects" replace />;
  }

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
            <div style={{ marginBottom: 8 }}>
              <Link className="inline-link" to="/projects">
                ← Volver a Proyectos
              </Link>
            </div>

            <h1 className="postTitle">{project.title}</h1>

            <div className="postMeta">
              {project.month ? `${project.month}/` : ""}
              {project.year}
              {project.tags?.length ? <span> · {project.tags.join(" · ")}</span> : null}
            </div>

            {project.description ? <p className="lead">{project.description}</p> : null}

            {project.tags?.length ? (
              <div className="tags" style={{ marginTop: 8 }}>
                {project.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            ) : null}

            <div className="row" style={{ marginTop: 12 }}>
              {project.links.demo && (
                <a className="btn" href={project.links.demo} target="_blank" rel="noreferrer">
                  Ver demo
                </a>
              )}
              {project.links.repo && (
                <a className="btn ghost" href={project.links.repo} target="_blank" rel="noreferrer">
                  Repositorio
                </a>
              )}
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
              {project.content}
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
              onClick={() =>
                window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
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
