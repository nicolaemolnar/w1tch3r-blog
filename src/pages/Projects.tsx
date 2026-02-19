// src/pages/Projects.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Tag from "../components/Tag";
import { getProjectsMeta, type ProjectMeta } from "../data/projects";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("");

  const [items, setItems] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const meta = await getProjectsMeta();
        if (!alive) return;
        setItems(meta);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Error cargando proyectos");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const tags = useMemo(() => {
    const all = new Set<string>();
    items.forEach((p) => p.tags.forEach((t) => all.add(t)));
    return ["", ...Array.from(all).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items
      .filter((p) => (tag ? p.tags.includes(tag) : true))
      .filter((p) =>
        q
          ? p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => {
        // Orden consistente con data layer: year desc, month desc
        const ya = a.year || 0;
        const yb = b.year || 0;
        if (yb !== ya) return yb - ya;

        const ma = a.month ? parseInt(a.month, 10) : 0;
        const mb = b.month ? parseInt(b.month, 10) : 0;
        return mb - ma;
      });
  }, [items, query, tag]);

  return (
    <div className="stack-lg">
      <header className="stack highlightHero">
        <h1 className="title">Proyectos</h1>
        <p className="lead">
          Archivo de mis proyectos personales, educativos y profesionales que pueden ser expuestos al público.
        </p>

        <div className="filters">
          <input
            className="input"
            placeholder="Buscar por título, descripción, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <select
            className="select"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            disabled={loading || items.length === 0}
          >
            {tags.map((t) => (
              <option key={t || "all"} value={t}>
                {t ? `Tag: ${t}` : "Todos los tags"}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="muted">⚠️ {error}</p>}
      </header>

      {loading ? (
        <p className="muted">Cargando proyectos…</p>
      ) : (
        <>
          <div className="grid-3">
            {filtered.map((p) => (
              <Card key={p.slug}>
                <div className="row space-between">
                  <h2 className="h3">{p.title}</h2>
                  <span className="muted">
                    {p.month ? `${p.month}/` : ""}
                    {p.year}
                  </span>
                </div>

                <p className="muted">{p.description}</p>

                <div className="tags">
                  {p.tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>

                <div className="row">
                  <Link className="btn small" to={`/projects/${p.slug}`}>
                    Detalles
                  </Link>

                  {p.links.demo && (
                    <a className="btn small ghost" href={p.links.demo} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  )}
                  {p.links.repo && (
                    <a className="btn small ghost" href={p.links.repo} target="_blank" rel="noreferrer">
                      Repo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && !error && (
            <p className="muted">No hay resultados con esos filtros.</p>
          )}
        </>
      )}
    </div>
  );
}
