import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import MarkdownRenderer from "../components/MarkdownRenderer";

import { getPostBySlug, type BlogPost } from "../data/posts";
import { buildTocFromHeadings, extractHeadings, type TocItem } from "../utils/toc";

import { fetchPostStats, countViewOnce, toggleLike } from "../lib/counters";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function resolvePostAsset(postFile: string, src: string) {
  if (!src) return src;
  if (/^[a-z]+:/i.test(src) || src.startsWith("/")) return src;

  const dir = postFile.replace(/[^/]+$/, "");
  const base = `${import.meta.env.BASE_URL}posts/${dir}`;
  return `${base}${src}`;
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

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();

  // ✅ Hooks SIEMPRE en el mismo orden
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Derivados seguros (para que useMemo exista siempre)
  const postSlug = post?.slug ?? slug ?? "";
  const content = post?.content ?? "";

  const headings = useMemo(() => {
    // Si aún no hay post, no hay headings
    if (!content) return [];
    return extractHeadings(content);
  }, [postSlug, content]);

  const toc = useMemo(() => buildTocFromHeadings(headings), [headings]);

  const [activeId, setActiveId] = useState<string>("");

  const API = import.meta.env.VITE_COUNTERS_API as string | undefined;

  const [stats, setStats] = useState<{ views: number; likes: number; liked: boolean }>({
    views: 0,
    likes: 0,
    liked: false,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);


  // Cargar post (async)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug) {
        console.log("[Post] no slug param -> not found");
        if (!cancelled) {
          setNotFound(true);
          setPost(null);
          setLoading(false);
        }
        return;
      }

      console.log("[Post] load start slug =", slug);
      setLoading(true);
      setNotFound(false);

      try {
        const p = await getPostBySlug(slug);
        if (cancelled) return;

        if (!p) {
          console.log("[Post] load result: NOT FOUND slug =", slug);
          setPost(null);
          setNotFound(true);
        } else {
          console.log("[Post] load result: FOUND", {
            slug: p.slug,
            title: p.title,
            contentLength: p.content?.length ?? 0,
          });
          setPost(p);
          setNotFound(false);
        }
      } catch (e) {
        console.error("[Post] load error", e);
        if (cancelled) return;
        setPost(null);
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
  }, [postSlug, toc]);

  // Hash al entrar (ya con IDs reales del DOM)
  useEffect(() => {
    if (!post) return; // solo cuando ya hay contenido renderizable

    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.replace("#", ""));
    requestAnimationFrame(() => {
      if (document.getElementById(id)) scrollToHeading(id);
    });
  }, [post]);

  useEffect(() => {
    if (!API) return;
    if (!postSlug) return;

    let cancelled = false;
    setStatsLoading(true);

    (async () => {
      try {
        const data = await fetchPostStats(API, postSlug);
        if (cancelled) return;
        setStats({
          views: Number(data.views ?? 0),
          likes: Number(data.likes ?? 0),
          liked: Boolean(data.liked ?? false),
        });
      } catch {
        // silencioso: si falla, no rompas el post
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API, postSlug]);

  useEffect(() => {
    if (!API) return;
    if (!postSlug) return;

    (async () => {
      const data = await countViewOnce(API, postSlug);
      if (!data) return;
      setStats((s) => ({
        ...s,
        views: Number(data.views ?? s.views),
        likes: Number(data.likes ?? s.likes),
      }));
    })();
  }, [API, postSlug]);

  const onLike = async () => {
    if (!API) return;
    if (!postSlug) return;
    if (likeBusy) return;

    setLikeBusy(true);
    try {
      const data = await toggleLike(API, postSlug);
      setStats((s) => ({
        ...s,
        likes: Number(data.likes ?? s.likes),
        views: Number(data.views ?? s.views),
        liked: typeof data.liked === "boolean" ? data.liked : !s.liked,
      }));
    } catch {
      // silencioso
    } finally {
      setLikeBusy(false);
    }
  };


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
          <p className="muted">Cargando post…</p>
        </header>
      </div>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
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
          <header className="postHeader highlightHero">
            <h1 className="postTitle">{post.title}</h1>
            <div className="postMeta">
              {post.date}
              {post.tags?.length ? <span> · {post.tags.join(" · ")}</span> : null}

              <span className="postStats">
              {" · "}
              {statsLoading ? "…" : `${stats.views} visitas`}
              {" · "}
              <button
                type="button"
                className={["likeBtn", stats.liked ? "liked" : ""].join(" ")}
                onClick={onLike}
                disabled={likeBusy}
                aria-pressed={stats.liked}
                title={stats.liked ? "Quitar like" : "Dar like"}
              >
                {stats.liked ? "💜" : "🤍"} {stats.likes}
              </button>
            </span>
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
            <MarkdownRenderer
              content={post.content}
              resolveImageSrc={(src) => resolvePostAsset(post.file, src)}
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
