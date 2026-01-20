import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import SkillPanel from "../components/SkillPanel";
import { skills, type SkillCategory } from "../data/skills";

export default function About() {
  const [searchParams, setSearchParams] = useSearchParams();

  const skillParam = searchParams.get("skill");
  const selected = useMemo(
    () => (skillParam ? skills.find((s) => s.id === skillParam) ?? null : null),
    [skillParam]
  );

  const open = Boolean(selected);

  // Si llega un skill inválido por URL, lo limpiamos
  useEffect(() => {
    if (skillParam && !selected) {
      const next = new URLSearchParams(searchParams);
      next.delete("skill");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillParam, selected]);

  // Cuando se abre el panel por deep-link, hacemos scroll a la sección stack (si existe)
  useEffect(() => {
    if (!open) return;
    const el = document.getElementById("stack");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  const categories = useMemo(() => {
    const order: SkillCategory[] = ["Frontend", "Backend", "DevOps", "Security", "General"];
    const map = new Map<SkillCategory, typeof skills>();
    order.forEach((c) => map.set(c, []));
    skills.forEach((s) => map.get(s.category)!.push(s));
    return order
      .filter((c) => (map.get(c)?.length ?? 0) > 0)
      .map((c) => ({ name: c, items: map.get(c)! }));
  }, []);

  function openSkill(id: string) {
    const next = new URLSearchParams(searchParams);
    next.set("skill", id);
    setSearchParams(next, { replace: false }); // crea entrada de historial (Back cierra)
  }

  function closeSkill() {
    const next = new URLSearchParams(searchParams);
    next.delete("skill");
    setSearchParams(next, { replace: false });
  }

  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">About</h1>
        <p className="lead">Resumen profesional, enfoque y stack/competencias.</p>
      </header>

      <section className="grid-2">
        <Card>
          <h2 className="h2">Perfil</h2>
          <p className="muted">Aquí tu resumen “de verdad”.</p>
        </Card>

        <Card>
          <h2 className="h2">Enfoque</h2>
          <ul className="list">
            <li>Calidad: estructura, naming, consistencia</li>
            <li>DX: tooling, scripts, automatización simple</li>
            <li>Documentación: posts y notas</li>
          </ul>
        </Card>
      </section>

      <section id="stack" className="stack">
        <div className="section-head">
          <h2 className="h2">Stack & Competencias</h2>
          <span className="muted">Comparte enlaces con ?skill=...</span>
        </div>

        <div className="stack">
          {categories.map((cat) => (
            <div key={cat.name} className="stack">
              <h3 className="h3">{cat.name}</h3>

              <div className="skillChips">
                {cat.items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={skillParam === s.id ? "skillChip active" : "skillChip"}
                    onClick={() => openSkill(s.id)}
                    aria-haspopup="dialog"
                    aria-expanded={skillParam === s.id}
                  >
                    <span className="skillName">{s.name}</span>
                    <span className="skillMeta">{s.level}/5</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SkillPanel open={open} skill={selected} onClose={closeSkill} />
    </div>
  );
}
