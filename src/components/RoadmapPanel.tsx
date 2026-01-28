// src/components/RoadmapPanel.tsx
import { useEffect, useRef } from "react";
import Card from "./Card";
import type { RoadmapNode } from "../data/roadmap";
import { STATUS_LABEL } from "../data/roadmap";

export default function RoadmapPanel({
  item,
  open,
  onClose,
}: {
  item: RoadmapNode | null;
  open: boolean;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevOverflowRef = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [open]);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  return (
    <div className={open ? "drawerOverlay open" : "drawerOverlay"} aria-hidden={!open}>
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
        aria-label={item ? `Detalles de ${item.title}` : "Detalles"}
      >
        <div className="drawerHeader">
          <div className="stack">
            <div className="row space-between">
              <h3 className="h3">{item?.title ?? "—"}</h3>
              <button ref={closeBtnRef} className="btn ghost small" type="button" onClick={onClose}>
                Cerrar
              </button>
            </div>

            {item && (
              <div className="row">
                <span className="muted">{item.category}</span>
                <span className="dotSep" />
                <span className="muted">Estado: {STATUS_LABEL[item.status]}</span>
              </div>
            )}

            {item?.description && <p className="muted">{item.description}</p>}
          </div>
        </div>

        <div className="drawerBody">
          {!item ? (
            <Card>
              <p className="muted">Selecciona un nodo del roadmap para ver detalles.</p>
            </Card>
          ) : (
            <div className="stack">
              <Card>
                <h4 className="h2">Resumen</h4>
                <ul className="list">
                  <li>
                    <b>Categoría:</b> {item.category}
                  </li>
                  <li>
                    <b>Estado:</b> {STATUS_LABEL[item.status]}
                  </li>
                  {typeof item.impact === "number" ? (
                    <li>
                      <b>Impacto:</b> {item.impact}/5
                    </li>
                  ) : null}
                  {typeof item.effort === "number" ? (
                    <li>
                      <b>Esfuerzo:</b> {item.effort}/5
                    </li>
                  ) : null}
                </ul>

                {item.tags?.length ? (
                  <>
                    <h4 className="h2" style={{ marginTop: 12 }}>
                      Tags
                    </h4>
                    <div className="tags">
                      {item.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </Card>

              {item.children?.length ? (
                <Card>
                  <h4 className="h2">Ramificaciones</h4>
                  <ul className="list">
                    {item.children.map((c) => (
                      <li key={c.id}>
                        <span className="muted">{c.title}</span> <span className="muted">·</span>{" "}
                        <span className="muted">{STATUS_LABEL[c.status]}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}

              {item.relatedProjectSlugs?.length ? (
                <Card>
                  <h4 className="h2">Proyectos relacionados</h4>
                  <ul className="list">
                    {item.relatedProjectSlugs.map((s) => (
                      <li key={s}>
                        <span className="muted">{s}</span>
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
