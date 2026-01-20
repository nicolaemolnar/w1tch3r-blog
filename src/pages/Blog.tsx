import { useEffect, useMemo, useState, type Key } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Tag from "../components/Tag";
import { posts, recentPosts } from "../data/posts";
import { formatDate } from "../utils/format";
import {
  filterAndSortPosts,
  getAllTags,
  getTagCounts,
  getRecentlyPublished,
  isRecentlyPublished,
  type BlogFilters,
} from "../utils/blog";

function parseFilters(sp: URLSearchParams): BlogFilters {
  const query = sp.get("q") ?? "";

  const tagsRaw = sp.get("tags") ?? "";
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const sortRaw = sp.get("sort");
  const sort: BlogFilters["sort"] = sortRaw === "oldest" ? "oldest" : "newest";

  const tagModeRaw = sp.get("tagMode");
  const tagMode: BlogFilters["tagMode"] = tagModeRaw === "all" ? "all" : "any";

  return { query, tags, sort, tagMode };
}

function serializeFilters(filters: BlogFilters): URLSearchParams {
  const sp = new URLSearchParams();

  const q = filters.query.trim();
  if (q) sp.set("q", q);

  if (filters.tags.length) sp.set("tags", filters.tags.join(","));

  if (filters.sort !== "newest") sp.set("sort", filters.sort);
  if (filters.tagMode !== "any") sp.set("tagMode", filters.tagMode);

  return sp;
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado local (UI)
  const [filters, setFilters] = useState<BlogFilters>(() => parseFilters(searchParams));

  // 1) Si cambia la URL (back/forward o enlace compartido), actualiza el estado
  useEffect(() => {
    const next = parseFilters(searchParams);

    setFilters((prev) => {
      const prevKey = serializeFilters(prev).toString();
      const nextKey = serializeFilters(next).toString();
      return prevKey === nextKey ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 2) Si cambia el estado, refleja en la URL
  useEffect(() => {
    const nextSP = serializeFilters(filters);
    const current = searchParams.toString();
    const next = nextSP.toString();

    if (current !== next) {
      // replace para no “ensuciar” el historial al escribir
      setSearchParams(nextSP, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const allTags = useMemo(() => getAllTags(posts), []);
  const tagCounts = useMemo(() => getTagCounts(posts), []);
  const recentPosts = useMemo(() => getRecentlyPublished(posts, 14, 3), []);

  const filtered = useMemo(() => filterAndSortPosts(posts, filters), [filters]);

  function toggleTag(t: string) {
    setFilters((f) => {
      const has = f.tags.includes(t);
      return { ...f, tags: has ? f.tags.filter((x) => x !== t) : [...f.tags, t] };
    });
  }

  function clearFilters() {
    setFilters({ query: "", tags: [], sort: "newest", tagMode: "any" });
    // Nota: el effect de arriba limpiará la URL
  }

  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">Blog</h1>
        <p className="lead">
          Posts cortos y prácticos: decisiones, errores comunes, aprendizajes y notas técnicas.
        </p>

        <div className="filters">
          <input
            className="input"
            placeholder="Buscar por palabras (título, contenido, tags...)"
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
          />

          <select
            className="select"
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value as BlogFilters["sort"] }))
            }
          >
            <option value="newest">Más nuevos</option>
            <option value="oldest">Más antiguos</option>
          </select>

          <select
            className="select"
            value={filters.tagMode}
            onChange={(e) =>
              setFilters((f) => ({ ...f, tagMode: e.target.value as BlogFilters["tagMode"] }))
            }
          >
            <option value="any">Tags: cualquiera</option>
            <option value="all">Tags: todos</option>
          </select>

          <button className="btn ghost" onClick={clearFilters} type="button">
            Limpiar
          </button>
        </div>

        <div className="tagChips">
          {allTags.map((t) => {
            const active = filters.tags.includes(t);
            return (
              <button
                key={t}
                className={active ? "tagChip active" : "tagChip"}
                onClick={() => toggleTag(t)}
                type="button"
              >
                <span>{t}</span>
                <span className="tagCount">{tagCounts.get(t) ?? 0}</span>
              </button>
            );
          })}
        </div>

        <p className="muted">
          Mostrando {filtered.length} post(s)
          {filters.tags.length ? ` · tags: ${filters.tags.join(", ")}` : ""}
          {filters.query.trim() ? ` · búsqueda: “${filters.query.trim()}”` : ""}
        </p>
      </header>

      <section className="stack">
        <div className="section-head">
          <h2 className="h2">Recién publicados</h2>
          <span className="muted">Últimos 14 días</span>
        </div>

        <div className="grid-3">
          {recentPosts.map((p) => (
            <Card key={p.slug}>
              <div className="row space-between">
                <h3 className="h3">
                  <Link className="plain-link" to={`/blog/${p.slug}`}>
                    {p.title}
                  </Link>
                </h3>
                {isRecentlyPublished(p, 14) && <span className="badge">NEW</span>}
              </div>
              <p className="muted">{formatDate(p.date)}</p>
              <p className="muted">{p.summary}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="stack">
        <div className="section-head">
          <h2 className="h2">Todos los posts</h2>
          <span className="muted">{filtered.length}</span>
        </div>

        <div className="stack">
          {filtered.map((p) => (
            <Card key={p.slug}>
              <div className="row space-between">
                <h3 className="h3">
                  <Link className="plain-link" to={`/blog/${p.slug}`}>
                    {p.title}
                  </Link>
                </h3>
                <span className="muted">{formatDate(p.date)}</span>
              </div>

              <p className="muted">{p.summary}</p>

              <div className="tags">
                {p.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card>
            <p className="muted">
              No hay resultados con esos filtros. Prueba a quitar tags o simplificar la búsqueda.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
