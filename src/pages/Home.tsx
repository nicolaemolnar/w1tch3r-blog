// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Tag from "../components/Tag";

import { getProjectsMeta, type ProjectMeta } from "../data/projects";
import { getPostsMeta, type BlogPostMeta } from "../data/posts";
import { sortByDateDesc, formatDate } from "../utils/format";

export default function Home() {
  // ---- Projects (nuevo mecanismo: fetch + cache) ----
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    getProjectsMeta()
      .then(setProjects)
      .catch((e) => {
        console.error(e);
        setProjects([]);
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  const featuredProjects = useMemo(() => projects.slice(0, 3), [projects]);

  // ---- Posts (ya existente) ----
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
          <p className="kicker">Software · Security · Engineering</p>
          <h1 className="title">
            Hola, soy <span className="accent">0xw1tch3r</span>. Desarrollo, hackeo y estudio varios dominios de la informática.
          </h1>
          <p className="lead">
            Este es mi portfolio personal, aquí documento y presento mi trabajo como desarrollador con especial interés en la ciberseguridad ofensiva.
            Encontrarás proyectos prácticos, experimentos técnicos y análisis en profundidad donde exploro desde desarrollo backend y arquitecturas web
            hasta pentesting, automatización y estudio de sistemas.
          </p>
          <p className="lead">
            Más que un escaparate, este espacio funciona como un cuaderno técnico público: un lugar donde centralizo lo que construyo, lo que investigo
            y lo que aprendo, con un enfoque práctico, crítico y orientado a entender cómo funcionan realmente las cosas.
          </p>
          <p className="lead">
            El contenido se organiza en proyectos y publicaciones técnicas, pensado como una visión práctica de mis conocimientos, habilidades y evolución profesional.
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
            <li>Writeups y aprendizaje continuo en ciberseguridad.</li>
            <li>Proyectos de software enfocados a la automatización.</li>
          </ul>
          <Link className="inline-link" to="/about">Más sobre mí →</Link>
        </Card>

        <Card>
          <h2 className="h2">Ultimos cambios</h2>
          <p className="muted">
            En "Changelog" publico las actualizaciones del portfolio de forma cronologica.
            Puedes revisar nuevas funciones, mejoras de UX, correcciones y contenido reciente.
          </p>
          <Link className="inline-link" to="/backlog">Ir a Changelog →</Link>
        </Card>
      </section>

      <section className="stack">
        <div className="section-head">
          <h2 className="h2">Proyectos destacados</h2>
          <Link className="inline-link" to="/projects">Ver todos →</Link>
          <p className="lead">
            Estos son los proyectos que forman el escaparate de mi perfil técnico. Abarcan diferentes disciplinas
            que reflejan mis capacidades y mi forma de trabajar en cada una de ellas.
          </p>
        </div>

        {loadingProjects ? (
          <Card><p className="muted">Cargando proyectos…</p></Card>
        ) : (
          <div className="grid-3">
            {featuredProjects.map((p) => (
              <Card key={p.slug}>
                <h3 className="h3">{p.title}</h3>
                <p className="muted">{p.description}</p>
                <div className="tags">
                  {p.tags.slice(0, 4).map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
                <div className="row">
                  <Link className="btn small" to={`/projects/${p.slug}`}>Detalles</Link>
                  {p.links.repo && (
                    <a className="btn small ghost" href={p.links.repo} target="_blank" rel="noreferrer">
                      Repo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loadingProjects && featuredProjects.length === 0 ? (
          <p className="muted">Aún no hay proyectos publicados.</p>
        ) : null}
      </section>

      <section className="stack">
        <div className="section-head">
          <h2 className="h2">Últimos posts</h2>
          <Link className="inline-link" to="/blog">Ver blog →</Link>
          <p className="lead">
            Estos son los posts más recientes de mi blog, échales un vistazo por si hay algún tema de tu interés.
          </p>
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
                  {post.tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
