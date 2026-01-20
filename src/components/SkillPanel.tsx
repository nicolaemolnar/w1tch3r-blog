import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import type { Skill } from "../data/skills";
import { projects } from "../data/projects";

function levelLabel(level: number) {
  const map: Record<number, string> = {
    1: "Básico",
    2: "Fundamentos",
    3: "Intermedio",
    4: "Avanzado",
    5: "Experto",
  };
  return map[level] ?? "—";
}

export default function SkillPanel({
  skill,
  open,
  onClose,
}: {
  skill: Skill | null;
  open: boolean;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevOverflowRef = useRef<string>("");

  // ESC para cerrar
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (!open) return;

    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [open]);

  // Enfocar botón cerrar al abrir
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  const related = (skill?.relatedProjectSlugs ?? [])
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  // Render siempre, animamos por CSS (open/close)
  return (
    <div
      className={open ? "drawerOverlay open" : "drawerOverlay"}
      aria-hidden={!open}
    >
      {/* Backdrop: click para cerrar */}
      <button
        className="drawerBackdrop"
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <aside
        className={open ? "drawer open" : "drawer"}
        role="dialog"
        aria-modal="true"
        aria-label={skill ? `Detalles de ${skill.name}` : "Detalles"}
      >
        <div className="drawerHeader">
          <div className="stack">
            <div className="row space-between">
              <h3 className="h3">{skill?.name ?? "—"}</h3>
              <button
                ref={closeBtnRef}
                className="btn ghost small"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>

            {skill && (
              <div className="row">
                <span className="muted">{skill.category}</span>
                <span className="dotSep" />
                <span className="muted">
                  Nivel: {levelLabel(skill.level)} ({skill.level}/5)
                </span>
              </div>
            )}

            {skill && (
              <div className="levelDots" aria-label={`Nivel ${skill.level} de 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < skill.level ? "levelDot on" : "levelDot"}
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}

            {skill?.summary && <p className="muted">{skill.summary}</p>}
          </div>
        </div>

        <div className="drawerBody">
          {!skill ? (
            <Card>
              <p className="muted">Selecciona una tecnología/competencia para ver detalles.</p>
            </Card>
          ) : (
            <div className="stack">
              <Card>
                <h4 className="h2">Competencias</h4>
                <ul className="list">
                  {skill.competencies.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h4 className="h2">Experiencia</h4>
                <ul className="list">
                  {typeof skill.experience.years === "number" && (
                    <li>{skill.experience.years} año(s) aprox.</li>
                  )}
                  {skill.experience.contexts.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>

                {skill.tools?.length ? (
                  <>
                    <h4 className="h2" style={{ marginTop: 12 }}>Herramientas</h4>
                    <div className="tags">
                      {skill.tools.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </>
                ) : null}
              </Card>

              {skill.certificates?.length ? (
                <Card>
                  <h4 className="h2">Certificados</h4>
                  <ul className="list">
                    {skill.certificates.map((c) => (
                      <li key={`${c.name}-${c.year ?? ""}`}>
                        {c.url ? (
                          <a href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
                        ) : (
                          <span>{c.name}</span>
                        )}
                        {c.issuer ? ` · ${c.issuer}` : ""}
                        {c.year ? ` · ${c.year}` : ""}
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}

              {related.length ? (
                <Card>
                  <h4 className="h2">Proyectos relacionados</h4>
                  <ul className="list">
                    {related.map((p) => (
                      <li key={p!.slug}>
                        <Link to={`/projects/${p!.slug}`} onClick={onClose}>
                          {p!.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
