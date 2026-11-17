import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import MarkdownArticle from "../components/MarkdownArticle";

import { getPostBySlug, type BlogPost } from "../data/posts";

import { fetchPostStats, countViewOnce, toggleLike } from "../lib/counters";

function resolvePostAsset(postFile: string, src: string) {
  if (!src) return src;
  if (/^[a-z]+:/i.test(src) || src.startsWith("/")) return src;

  const dir = postFile.replace(/[^/]+$/, "");
  const base = `${import.meta.env.BASE_URL}posts/${dir}`;
  return `${base}${src}`;
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();

  // ✅ Hooks SIEMPRE en el mismo orden
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Identificador disponible mientras se carga el post.
  const postSlug = post?.slug ?? slug ?? "";
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
    <MarkdownArticle
      key={post.slug}
      content={post.content}
      resolveImageSrc={(src) => resolvePostAsset(post.file, src)}
    >
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
    </MarkdownArticle>
  );
}
