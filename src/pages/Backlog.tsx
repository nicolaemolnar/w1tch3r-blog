import { useMemo, useState } from "react";
import "../styles/roadmap.css";
import { CHANGELOG, CHANGE_TYPE_LABEL, type ChangeType } from "../data/changelog";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(`${iso}T00:00:00`));
}

function monthKey(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "long" }).format(d);
}

export default function Backlog() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ChangeType | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const stats = useMemo(() => {
    const total = CHANGELOG.length;
    const latest = CHANGELOG[0]?.date ?? "";
    const releaseCount = new Set(CHANGELOG.map((item) => item.version)).size;
    return { total, latest, releaseCount };
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    CHANGELOG.forEach((entry) => entry.tags.forEach((tag) => set.add(tag)));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return CHANGELOG.filter((entry) => {
      if (selectedType !== "all" && entry.type !== selectedType) return false;
      if (selectedTag !== "all" && !entry.tags.includes(selectedTag)) return false;

      if (!q) return true;
      const haystack = [
        entry.version,
        entry.title,
        entry.summary,
        ...entry.tags,
        ...entry.items,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [query, selectedType, selectedTag]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((entry) => {
      const key = monthKey(entry.date);
      const current = map.get(key) ?? [];
      current.push(entry);
      map.set(key, current);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="stack-lg">
      <header className="highlightHero">
        <h1 className="title">Changelog</h1>
        <p className="lead">
          Historial visual de cambios del portfolio: nuevas funciones, mejoras, contenido y correcciones.
        </p>

        <div className="changelogStats">
          <div className="changelogStat">
            <span className="changelogStatLabel">Entradas</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="changelogStat">
            <span className="changelogStatLabel">Releases</span>
            <strong>{stats.releaseCount}</strong>
          </div>
          <div className="changelogStat">
            <span className="changelogStatLabel">Ultima actualizacion</span>
            <strong>{stats.latest ? formatDate(stats.latest) : "-"}</strong>
          </div>
        </div>
      </header>

      <section className="changelogFilters">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cambios por texto, version o tag..."
        />

        <select
          className="select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ChangeType | "all")}
        >
          <option value="all">Tipo: todos</option>
          <option value="feature">{CHANGE_TYPE_LABEL.feature}</option>
          <option value="improvement">{CHANGE_TYPE_LABEL.improvement}</option>
          <option value="fix">{CHANGE_TYPE_LABEL.fix}</option>
          <option value="content">{CHANGE_TYPE_LABEL.content}</option>
        </select>

        <select className="select" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag === "all" ? "Tag: todos" : `Tag: ${tag}`}
            </option>
          ))}
        </select>
      </section>

      {grouped.length === 0 ? (
        <div className="card">
          <p className="muted">No hay resultados con esos filtros.</p>
        </div>
      ) : (
        <div className="changelogTimeline">
          {grouped.map(([groupKey, entries]) => (
            <section key={groupKey} className="changelogMonth">
              <div className="changelogMonthLabel">{monthLabel(groupKey)}</div>

              <div className="changelogList">
                {entries.map((entry) => (
                  <article key={entry.id} className="changelogItem">
                    <div className="changelogItemTop">
                      <span className={`changelogType changelogType--${entry.type}`}>
                        {CHANGE_TYPE_LABEL[entry.type]}
                      </span>
                      <span className="changelogVersion">{entry.version}</span>
                      <span className="muted">{formatDate(entry.date)}</span>
                    </div>

                    <h2 className="h3">{entry.title}</h2>
                    <p className="muted">{entry.summary}</p>

                    <ul className="changelogBullets">
                      {entry.items.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>

                    <div className="changelogTags">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="changelogTag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

