import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Tag from "../components/Tag";
import { projects } from "../data/projects";
import { getPostsMeta, type BlogPostMeta } from "../data/posts";
import { sortByDateDesc, formatDate } from "../utils/format";

export default function Home() {
  const featuredProjects = projects.slice(0, 3);

  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    getPostsMeta()
      .then(setPosts)
      .catch((e) => {
        console.error(e);
        setPosts([]);
      })
      .finally(() => setLoadingPosts(false));
  }, []);

  const recentPosts = useMemo(() => sortByDateDesc(posts).slice(0, 3), [posts]);

  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="stack">
          <p className="kicker">React · Security · Engineering</p>
          <h1 className="title">
            Hola, soy <span className="accent">0xw1tch3r</span>. Construyo productos web y documento mi progreso.
          </h1>
          <p className="lead">
            Portfolio profesional con proyectos seleccionados, artículos cortos y notas técnicas.
          </p>
          <div className="row">
            <Link className="btn" to="/projects">Ver proyectos</Link>
            <Link className="btn ghost" to="/blog">Leer blog</Link>
          </div>
        </div>
      </section>

      <section className="grid-2">
        <Card>
          <h2 className="h2">Lo que hago</h2>
          <ul className="list">
            <li>Front-end moderno con React + TypeScript.</li>
            <li>Proyectos enfocados en utilidad real y mantenibilidad.</li>
            <li>Writeups y aprendizaje continuo en ciberseguridad.</li>
          </ul>
          <Link className="inline-link" to="/about">Más sobre mí →</Link>
        </Card>

        <Card>
          <h2 className="h2">Dónde estoy ahora</h2>
          <p className="muted">
            En "Backlog" documento en qué estoy centrado este mes (proyectos, estudio, objetivos).
          </p>
          <Link className="inline-link" to="/backlog">Ir a Backlog →</Link>
        </Card>
      </section>

      <section className="stack">
        <div className="section-head">
          <h2 className="h2">Proyectos destacados</h2>
          <Link className="inline-link" to="/projects">Ver todos →</Link>
        </div>

        <div className="grid-3">
          {featuredProjects.map((p) => (
            <Card key={p.slug}>
              <h3 className="h3">{p.title}</h3>
              <p className="muted">{p.description}</p>
              <div className="tags">
                {p.tags.slice(0, 4).map(t => <Tag key={t} label={t} />)}
              </div>
              <div className="row">
                <Link className="btn small" to={`/projects/${p.slug}`}>Detalles</Link>
                {p.links.repo && (
                  <a className="btn small ghost" href={p.links.repo} target="_blank" rel="noreferrer">Repo</a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="stack">
        <div className="section-head">
          <h2 className="h2">Últimos posts</h2>
          <Link className="inline-link" to="/blog">Ver blog →</Link>
        </div>

        {loadingPosts ? (
          <Card><p className="muted">Cargando posts…</p></Card>
        ) : (
          <div className="stack">
            {recentPosts.map((post) => (
              <Card key={post.slug}>
                <div className="row space-between">
                  <h3 className="h3">
                    <Link to={`/blog/${post.slug}`} className="plain-link">{post.title}</Link>
                  </h3>
                  <span className="muted">{formatDate(post.date)}</span>
                </div>
                <p className="muted">{post.summary}</p>
                <div className="tags">
                  {post.tags.map((t) => <Tag key={t} label={t} />)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
