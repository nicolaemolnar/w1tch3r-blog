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
    const order: SkillCategory[] = ["Software" , "Infrastructure" , "Security" , "General" , "Electronic Warfare" , "Soft Skills"];
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
          <p className="muted">
            Soy ingeniero informático con <b>3 años de experiencia en guerra electrónica</b>. En los últimos años me he especializado
            en <b>ciberseguridad</b>, con foco en el <b>ámbito ofensivo</b>, apoyado por formación de máster y certificaciones como la eJPT.
          </p>

          <p className="muted">
            Mi perfil combina mentalidad de atacante y disciplina de ingeniería: vengo de entornos de <b>desarrollo e integración
            de software</b> y estoy acostumbrado a trabajar con sistemas reales, requisitos, entregables y trazabilidad.
            Habitualmente participo en actividades de <b>pentesting y red-team sobre redes</b> y entornos de sistemas embebidos,
            con el objetivo de identificar riesgos, validar controles y elevar el nivel de seguridad.
          </p>

          <p className="muted">
            Me motiva especialmente <b>convertir hallazgos técnicos en impacto</b>: desde el reconocimiento y enumeración hasta la
            explotación controlada y la post-explotación, documentando <b>evidencias</b> y proponiendo <b>mitigaciones accionables</b>.
            Disfruto automatizando tareas, construyendo tooling propio y manteniéndome al día con TTPs y vulnerabilidades.
          </p>
        </Card>

        <Card>
          <h2 className="h2">Enfoque</h2>
          <ul className="list">
            <li>Offensive mindset: <b>Metodología personal</b> desarrollada a partir de la práctica en CTF y el entorno laboral.</li>
            <li>Red-team en redes y entornos embebidos: Enfoque en seguridad práctica orientada a <b>sistemas reales</b>.</li>
            <li>Reporting útil: <b>Redacción de evidencias</b> claras, narrativa del riesgo y mitigaciones accionables desde el <b>punto de vista del desarrollo</b>.</li>
            <li><b>Automatización</b> y tooling: Scripting para acelerar procesos repetitivos y garantizar la reproducibilidad.</li>
            <li>Rigor técnico: <b>Certificación básica (eJPT)</b>, de la que he adquirido habilidades aplicables al entorno profesional. </li>
            <li>Aprendizaje continuo: laboratorios propios y alojados, CTF, <b>formación técnica e interés</b> por las noticias más recientes de ciberseguridad.</li>
          </ul>

        </Card>
      </section>

      <section id="stack" className="stack">
        <div className="section-head">
          <h2 className="h2">Stack & Competencias</h2>
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
