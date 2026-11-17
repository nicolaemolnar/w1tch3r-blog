// src/pages/ProjectDetail.tsx
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MarkdownArticle from "../components/MarkdownArticle";

import Tag from "../components/Tag";
import { getProjectBySlug, type Project } from "../data/projects";

function resolveProjectAsset(projectSlug: string, src: string) {
  if (!src) return src;
  if (/^[a-z]+:/i.test(src) || src.startsWith("/")) return src;

  const base = `${import.meta.env.BASE_URL}projects/${projectSlug}/`;
  return `${base}${src}`;
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // ✅ Hooks siempre en el mismo orden
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Derivados seguros
  const projectSlug = project?.slug ?? slug ?? "";
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
    <MarkdownArticle
      key={project.slug}
      content={project.content}
      resolveImageSrc={(src) => resolveProjectAsset(projectSlug, src)}
    >
      <header className="postHeader highlightHero">
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
    </MarkdownArticle>
  );
}
