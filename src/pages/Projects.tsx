import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Tag from "../components/Tag";
import { projects } from "../data/projects";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("");

  const tags = useMemo(() => {
    const all = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => all.add(t)));
    return ["", ...Array.from(all).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter(p => (tag ? p.tags.includes(tag) : true))
      .filter(p =>
        q
          ? (p.title.toLowerCase().includes(q) ||
             p.description.toLowerCase().includes(q) ||
             p.tags.some(t => t.toLowerCase().includes(q)))
          : true
      )
      .sort((a, b) => b.year - a.year);
  }, [query, tag]);

  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">Projects</h1>
        <p className="lead">Selección de proyectos con foco en calidad, utilidad y claridad técnica.</p>

        <div className="filters">
          <input
            className="input"
            placeholder="Buscar por título, descripción, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="select" value={tag} onChange={(e) => setTag(e.target.value)}>
            {tags.map(t => (
              <option key={t || "all"} value={t}>
                {t ? `Tag: ${t}` : "Todos los tags"}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid-3">
        {filtered.map((p) => (
          <Card key={p.slug}>
            <div className="row space-between">
              <h2 className="h3">{p.title}</h2>
              <span className="muted">{p.year}</span>
            </div>
            <p className="muted">{p.description}</p>
            <div className="tags">
              {p.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <div className="row">
              <Link className="btn small" to={`/projects/${p.slug}`}>Detalles</Link>
              {p.links.demo && <a className="btn small ghost" href={p.links.demo} target="_blank" rel="noreferrer">Demo</a>}
              {p.links.repo && <a className="btn small ghost" href={p.links.repo} target="_blank" rel="noreferrer">Repo</a>}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="muted">No hay resultados con esos filtros.</p>
      )}
    </div>
  );
}
