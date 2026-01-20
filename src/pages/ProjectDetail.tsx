import { Link, useParams } from "react-router-dom";
import Card from "../components/Card";
import Tag from "../components/Tag";
import { projects } from "../data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="stack">
        <h1 className="title">Proyecto no encontrado</h1>
        <Link className="inline-link" to="/projects">← Volver a Projects</Link>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <header className="stack">
        <Link className="inline-link" to="/projects">← Volver</Link>
        <div className="row space-between">
          <h1 className="title">{project.title}</h1>
          <span className="muted">{project.year}</span>
        </div>
        <p className="lead">{project.description}</p>
        <div className="tags">
          {project.tags.map(t => <Tag key={t} label={t} />)}
        </div>
        <div className="row">
          {project.links.demo && <a className="btn" href={project.links.demo} target="_blank" rel="noreferrer">Ver demo</a>}
          {project.links.repo && <a className="btn ghost" href={project.links.repo} target="_blank" rel="noreferrer">Repositorio</a>}
        </div>
      </header>

      <section className="grid-2">
        <Card>
          <h2 className="h2">Highlights</h2>
          <ul className="list">
            {project.highlights.map(h => <li key={h}>{h}</li>)}
          </ul>
        </Card>

        <Card>
          <h2 className="h2">Notas</h2>
          <p className="muted">
            Aquí puedes ampliar: arquitectura, decisiones, retos, métricas, capturas, etc.
          </p>
          <p className="muted">
            Consejo: añade “qué problema resuelve”, “qué aprendiste” y “cómo se ejecuta”.
          </p>
        </Card>
      </section>
    </div>
  );
}
