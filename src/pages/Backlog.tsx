// src/pages/Backlog.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import Card from "../components/Card";
import RoadmapPanel from "../components/RoadmapPanel";
import "../styles/roadmap.css";

import { ROADMAP } from "../data/roadmap";
import type { RoadmapNode, RoadmapStatus, RoadmapCategory } from "../data/roadmap";
import { STATUS_LABEL } from "../data/roadmap";

/* ======= helpers ======= */

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function collectMeta(nodes: RoadmapNode[]) {
  const categories: RoadmapCategory[] = [];
  const tags: string[] = [];
  const walk = (n: RoadmapNode) => {
    categories.push(n.category);
    (n.tags ?? []).forEach((t) => tags.push(t));
    (n.children ?? []).forEach(walk);
  };
  nodes.forEach(walk);
  return {
    categories: uniq(categories).sort(),
    tags: uniq(tags).sort((a, b) => a.localeCompare(b)),
  };
}

function matchesText(n: RoadmapNode, q: string) {
  if (!q.trim()) return true;
  const hay = [n.title, n.description ?? "", n.category, STATUS_LABEL[n.status], ...(n.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}

function nodeMatchesFilters(
  node: RoadmapNode,
  q: string,
  statusSet: Set<RoadmapStatus>,
  catSet: Set<RoadmapCategory>,
  tagSet: Set<string>,
  hideDone: boolean
) {
  if (hideDone && node.status === "done") return false;
  if (statusSet.size && !statusSet.has(node.status)) return false;
  if (catSet.size && !catSet.has(node.category)) return false;
  if (tagSet.size) {
    const nodeTags = new Set(node.tags ?? []);
    for (const t of tagSet) if (!nodeTags.has(t)) return false; // AND
  }
  if (!matchesText(node, q)) return false;
  return true;
}

function pruneTree(
  nodes: RoadmapNode[],
  q: string,
  statusSet: Set<RoadmapStatus>,
  catSet: Set<RoadmapCategory>,
  tagSet: Set<string>,
  hideDone: boolean,
  maxDepth: number
): RoadmapNode[] {
  const walk = (node: RoadmapNode, depth: number): RoadmapNode | null => {
    if (depth > maxDepth) return null;

    const prunedKids = (node.children ?? [])
      .map((c) => walk(c, depth + 1))
      .filter(Boolean) as RoadmapNode[];

    const selfOk = nodeMatchesFilters(node, q, statusSet, catSet, tagSet, hideDone);
    if (!selfOk && prunedKids.length === 0) return null;

    return { ...node, children: prunedKids.length ? prunedKids : undefined };
  };

  return nodes.map((n) => walk(n, 1)).filter(Boolean) as RoadmapNode[];
}

function keepOnlyPath(nodes: RoadmapNode[], focusId: string) {
  const walk = (node: RoadmapNode): RoadmapNode | null => {
    if (node.id === focusId) return { ...node };
    const kids = (node.children ?? []).map(walk).filter(Boolean) as RoadmapNode[];
    if (!kids.length) return null;
    return { ...node, children: kids };
  };
  return nodes.map(walk).filter(Boolean) as RoadmapNode[];
}

function flatten(nodes: RoadmapNode[]) {
  const all: RoadmapNode[] = [];
  const walk = (n: RoadmapNode) => {
    all.push(n);
    (n.children ?? []).forEach(walk);
  };
  nodes.forEach(walk);
  return all;
}

/* ======= layout ======= */

type Positioned = { id: string; node: RoadmapNode; depth: number; x: number; y: number };
type Edge = { from: string; to: string };

function buildLevels(roots: RoadmapNode[]) {
  const levels: RoadmapNode[][] = [];
  const edges: Edge[] = [];

  const walk = (n: RoadmapNode, d: number) => {
    if (!levels[d]) levels[d] = [];
    levels[d].push(n);
    for (const c of n.children ?? []) {
      edges.push({ from: n.id, to: c.id });
      walk(c, d + 1);
    }
  };

  roots.forEach((r) => walk(r, 0));
  return { levels, edges };
}

function computeLayout(
  roots: RoadmapNode[],
  opts: { nodeW: number; nodeH: number; colGap: number; rowGap: number; padding: number }
) {
  const { levels, edges } = buildLevels(roots);

  const pos = new Map<string, Positioned>();
  levels.forEach((lvl, d) => {
    lvl.forEach((n, i) => {
      const x = opts.padding + i * (opts.nodeW + opts.colGap);
      const y = opts.padding + d * (opts.nodeH + opts.rowGap);
      pos.set(n.id, { id: n.id, node: n, depth: d, x, y });
    });
  });

  for (let pass = 0; pass < 3; pass++) {
    for (let d = levels.length - 2; d >= 0; d--) {
      for (const parent of levels[d]) {
        const kids = parent.children ?? [];
        if (!kids.length) continue;
        const xs = kids
          .map((k) => pos.get(k.id))
          .filter(Boolean)
          .map((p) => (p as Positioned).x);
        if (!xs.length) continue;
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const center = (minX + maxX) / 2;
        const p = pos.get(parent.id);
        if (p) pos.set(parent.id, { ...p, x: center });
      }
    }

    for (let d = 0; d < levels.length; d++) {
      const ids = levels[d].map((n) => n.id);
      ids.sort((a, b) => pos.get(a)!.x - pos.get(b)!.x);
      for (let i = 1; i < ids.length; i++) {
        const prev = pos.get(ids[i - 1])!;
        const cur = pos.get(ids[i])!;
        const minAllowed = prev.x + opts.nodeW + opts.colGap;
        if (cur.x < minAllowed) pos.set(ids[i], { ...cur, x: minAllowed });
      }
    }

    for (let d = 0; d < levels.length; d++) {
      const ids = levels[d].map((n) => n.id);
      const minX = Math.min(...ids.map((id) => pos.get(id)!.x));
      const shift = minX - opts.padding;
      if (shift > 0) {
        ids.forEach((id) => {
          const p = pos.get(id)!;
          pos.set(id, { ...p, x: p.x - shift });
        });
      }
    }
  }

  const all = Array.from(pos.values());
  const maxX = Math.max(...all.map((p) => p.x)) + opts.nodeW + opts.padding;
  const maxY = Math.max(...all.map((p) => p.y)) + opts.nodeH + opts.padding;

  return { pos, edges, width: maxX, height: maxY };
}

/* ======= page ======= */

export default function Backlog() {
  const meta = useMemo(() => collectMeta(ROADMAP), []);

  const [q, setQ] = useState("");
  const [hideDone, setHideDone] = useState(true);
  const [maxDepth, setMaxDepth] = useState(5);
  const [onlyPath, setOnlyPath] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const [selectedStatuses, setSelectedStatuses] = useState<RoadmapStatus[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<RoadmapCategory[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusSet = useMemo(() => new Set(selectedStatuses), [selectedStatuses]);
  const catSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);
  const tagSet = useMemo(() => new Set(selectedTags), [selectedTags]);

  const pruned = useMemo(() => {
    const base = pruneTree(ROADMAP, q, statusSet, catSet, tagSet, hideDone, maxDepth);
    if (onlyPath && focusId) return keepOnlyPath(base, focusId);
    return base;
  }, [q, statusSet, catSet, tagSet, hideDone, maxDepth, onlyPath, focusId]);

  const allVisible = useMemo(() => flatten(pruned), [pruned]);
  const selectedItem = useMemo(
    () => (selectedId ? allVisible.find((n) => n.id === selectedId) ?? null : null),
    [selectedId, allVisible]
  );

  // layout params
  const nodeW = 220;
  const nodeH = 100;
  const colGap = 26;
  const rowGap = 90;
  const padding = 24;

  const layout = useMemo(() => computeLayout(pruned, { nodeW, nodeH, colGap, rowGap, padding }), [pruned]);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setQ("");
    setHideDone(true);
    setMaxDepth(5);
    setOnlyPath(false);
    setFocusId(null);
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedId(null);
  };

  const onFocus = (id: string) => {
    setFocusId((prev) => (prev === id ? null : id));
    setOnlyPath(true);
  };

  useEffect(() => {
    if (selectedId && !allVisible.some((n) => n.id === selectedId)) setSelectedId(null);
  }, [selectedId, allVisible]);

  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">Backlog</h1>
        <p className="lead">Roadmap en forma de árbol. Selecciona un nodo para ver detalles.</p>
      </header>

      {/* Controles */}
      <Card>
        <div className="rm-controls">
          <div className="rm-controlBlock">
            <div className="rm-row">
              <input
                className="rm-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar (título, tags, categoría, estado)…"
              />
            </div>

            <div className="rm-row">
              <label className="rm-check">
                <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
                <span>Ocultar “Hecho”</span>
              </label>

              <label className="rm-check" title="Muestra solo la ruta hacia el nodo enfocado">
                <input type="checkbox" checked={onlyPath} onChange={(e) => setOnlyPath(e.target.checked)} disabled={!focusId} />
                <span>Solo ruta (Focus)</span>
              </label>

              <button type="button" className="rm-btn rm-btn--ghost" onClick={clearAll}>
                Limpiar filtros
              </button>
            </div>

            <div className="rm-divider" />

            <div className="rm-row">
              <span className="rm-muted rm-small">
                Nodos visibles: <b>{allVisible.length}</b>
                {focusId ? (
                  <>
                    {" "}
                    · Focus: <b>{focusId}</b>
                  </>
                ) : null}
              </span>
            </div>
          </div>

          <div className="rm-controlBlock">
            <div className="rm-row">
              <span className="rm-muted rm-small">Estado</span>
            </div>
            <div className="rm-badges">
              {(["now", "next", "later", "paused", "done"] as RoadmapStatus[]).map((s) => {
                const active = selectedStatuses.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    className="rm-btn"
                    onClick={() => setSelectedStatuses((prev) => toggle(prev, s))}
                    style={{ opacity: active ? 1 : 0.7 }}
                  >
                    {active ? "✓ " : ""}
                    {STATUS_LABEL[s]}
                  </button>
                );
              })}
            </div>

            <div className="rm-divider" />

            <div className="rm-row">
              <span className="rm-muted rm-small">Profundidad</span>
            </div>
            <div className="rm-row">
              <input type="range" min={1} max={10} value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} />
              <span className="rm-chip">{maxDepth}</span>
            </div>
          </div>

          <div className="rm-controlBlock">
            <div className="rm-row">
              <span className="rm-muted rm-small">Categorías</span>
            </div>
            <div className="rm-badges">
              {meta.categories.map((c) => {
                const active = selectedCategories.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    className="rm-btn"
                    onClick={() => setSelectedCategories((prev) => toggle(prev, c))}
                    style={{ opacity: active ? 1 : 0.7 }}
                  >
                    {active ? "✓ " : ""}
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="rm-divider" />

            <div className="rm-row">
              <span className="rm-muted rm-small">Tags (AND)</span>
            </div>
            <div className="rm-badges">
              {meta.tags.slice(0, 24).map((t) => {
                const active = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className="rm-btn"
                    onClick={() => setSelectedTags((prev) => toggle(prev, t))}
                    style={{ opacity: active ? 1 : 0.7 }}
                    title="Todas las tags seleccionadas deben estar"
                  >
                    {active ? "✓ " : ""}
                    #{t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Grafo */}
      <div className="graphWrap">
        <div className="graphToolbar">
          <div className="legend">
            <span className="rm-muted rm-small">Leyenda:</span>
            <span className="rm-pill rm-pill--now">Ahora</span>
            <span className="rm-pill rm-pill--next">Siguiente</span>
            <span className="rm-pill rm-pill--later">Más adelante</span>
            <span className="rm-pill rm-pill--paused">Pausado</span>
            <span className="rm-pill rm-pill--done">Hecho</span>
          </div>

          <div className="rm-row">
            <button
              type="button"
              className="gFocus"
              onClick={() => viewportRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" })}
            >
              Reset vista
            </button>
          </div>
        </div>

        <div className="graphViewport" ref={viewportRef}>
          <div className="graphCanvas" style={{ width: layout.width, height: layout.height }}>
            <svg className="gSvg" width={layout.width} height={layout.height} aria-hidden="true">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.18)" />
                </marker>
              </defs>

              {layout.edges.map((e) => {
                const a = layout.pos.get(e.from);
                const b = layout.pos.get(e.to);
                if (!a || !b) return null;

                const x1 = a.x + nodeW / 2;
                const y1 = a.y + nodeH;
                const x2 = b.x + nodeW / 2;
                const y2 = b.y;

                const midY = (y1 + y2) / 2;
                const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                const accent =
                  (selectedId && (e.from === selectedId || e.to === selectedId)) ||
                  (focusId && (e.from === focusId || e.to === focusId));

                return (
                  <path
                    key={`${e.from}->${e.to}`}
                    d={d}
                    className={accent ? "gLine gLine--accent" : "gLine"}
                    markerEnd="url(#arrow)"
                  />
                );
              })}
            </svg>

            {Array.from(layout.pos.values()).map((p) => {
              const isSelected = selectedId === p.id;

              const statusClass =
                p.node.status === "now"
                  ? "gBadge--now"
                  : p.node.status === "done"
                  ? "gBadge--done"
                  : p.node.status === "paused"
                  ? "gBadge--paused"
                  : "";

              return (
                <div
                  key={p.id}
                  className={isSelected ? "gNode gNode--selected" : "gNode"}
                  style={{ left: p.x, top: p.y, width: nodeW, height: nodeH }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedId(p.id);
                  }}
                  title={p.node.title}
                >
                  <div className="gTop">
                    <div className="gTitle">{p.node.title}</div>
                    <div className="gMiniMeta">
                      <span className={`gBadge ${statusClass}`}>{STATUS_LABEL[p.node.status]}</span>
                    </div>
                  </div>

                  <div className="gSub">
                    <span>{p.node.category}</span>
                    <button
                      type="button"
                      className="gFocus"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onFocus(p.id);
                      }}
                    >
                      Focus
                    </button>
                  </div>

                  {p.node.tags?.length ? (
                    <div className="gTagLine">
                      {(p.node.tags ?? []).slice(0, 3).map((t) => `#${t}`).join("  ")}
                      {(p.node.tags ?? []).length > 3 ? "  …" : ""}
                    </div>
                  ) : (
                    <div className="gTagLine"> </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="muted">Última actualización: enero 2026</p>

      {/* Panel detalle */}
      <RoadmapPanel item={selectedItem} open={Boolean(selectedItem)} onClose={() => setSelectedId(null)} />
    </div>
  );
}
