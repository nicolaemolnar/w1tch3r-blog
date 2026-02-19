import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import SkillPanel from "../components/SkillPanel";
import { skills, type SkillCategory } from "../data/skills";

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .trim();
}

function tokenize(q: string) {
  return normalize(q)
    .split(/[\s,;]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function skillHaystack(s: (typeof skills)[number]) {
  const parts: string[] = [
    s.id,
    s.name,
    s.category,
    s.summary ?? "",
    ...(s.competencies ?? []),
    ...(s.tools ?? []),
    ...(s.experience?.contexts ?? []),
    ...(s.certificates?.map((c) => [c.name, c.issuer ?? "", String(c.year ?? "")].join(" ")) ?? []),
  ];
  return normalize(parts.join(" | "));
}

function matchesAllTokens(haystack: string, tokens: string[]) {
  if (tokens.length === 0) return true;
  return tokens.every((t) => haystack.includes(t));
}

export default function About() {
  const [searchParams, setSearchParams] = useSearchParams();

  const skillParam = searchParams.get("skill");
  const qParam = searchParams.get("q") ?? "";

  // estado controlado (pero sincronizado con la URL)
  const [query, setQuery] = useState(qParam);

  // si cambian params externos (back/forward), sincronizamos
  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

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

  const tokens = useMemo(() => tokenize(query), [query]);

  const filteredSkills = useMemo(() => {
    if (tokens.length === 0) return skills;
    return skills.filter((s) => matchesAllTokens(skillHaystack(s), tokens));
  }, [tokens]);

  const categories = useMemo(() => {
    const order: SkillCategory[] = [
      "Software",
      "Infrastructure",
      "Security",
      "General",
      "Electronic Warfare",
      "Soft Skills",
    ];

    const map = new Map<SkillCategory, typeof skills>();
    order.forEach((c) => map.set(c, []));

    filteredSkills.forEach((s) => map.get(s.category)!.push(s));

    return order
      .filter((c) => (map.get(c)?.length ?? 0) > 0)
      .map((c) => ({ name: c, items: map.get(c)! }));
  }, [filteredSkills]);

  const totalHits = filteredSkills.length;

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

  function setQueryToUrl(nextValue: string, opts?: { replace?: boolean }) {
    const next = new URLSearchParams(searchParams);
    const cleaned = nextValue.trim();

    if (cleaned) next.set("q", cleaned);
    else next.delete("q");

    // si filtras, normalmente tiene sentido cerrar skill seleccionado si ya no está visible
    // (esto evita panel abierto mostrando algo que ya no aparece en la lista)
    if (skillParam) {
      const stillVisible = filteredSkills.some((s) => s.id === skillParam);
      if (!stillVisible) next.delete("skill");
    }

    setSearchParams(next, { replace: opts?.replace ?? false });
  }

  // actualiza URL al escribir, pero sin spamear historial (replace)
  useEffect(() => {
    setQueryToUrl(query, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="stack-lg">
      <header className="stack highlightHero">
        <h1 className="title">About</h1>
        <p className="lead">Resumen profesional, enfoque y stack/competencias.</p>
      </header>

      <section className="grid-2">
        <Card>
          <h2 className="h2">Perfil</h2>
          <p className="muted">
            Soy ingeniero informático con <b>3 años de experiencia en guerra electrónica</b>. En los últimos años me he
            especializado en <b>ciberseguridad</b>, con foco en el <b>ámbito ofensivo</b>, apoyado por formación de máster y
            certificaciones como la eJPT.
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
            <li>
              Offensive mindset: <b>Metodología personal</b> desarrollada a partir de la práctica en CTF y el entorno laboral.
            </li>
            <li>
              Red-team en redes y entornos embebidos: Enfoque en seguridad práctica orientada a <b>sistemas reales</b>.
            </li>
            <li>
              Reporting útil: <b>Redacción de evidencias</b> claras, narrativa del riesgo y mitigaciones accionables desde el{" "}
              <b>punto de vista del desarrollo</b>.
            </li>
            <li>
              <b>Automatización</b> y tooling: Scripting para acelerar procesos repetitivos y garantizar la reproducibilidad.
            </li>
            <li>
              Rigor técnico: <b>Certificación básica (eJPT)</b>, de la que he adquirido habilidades aplicables al entorno profesional.
            </li>
            <li>
              Aprendizaje continuo: laboratorios propios y alojados, CTF, <b>formación técnica e interés</b> por las noticias más recientes
              de ciberseguridad.
            </li>
          </ul>
        </Card>
      </section>

      <section id="stack" className="stack">
        <div className="section-head">
          <h2 className="h2">Stack & Competencias</h2>
        </div>
        {/* Buscador */}
          <div className="stack-xs" style={{ marginTop: 10 }}>
            <div className="row" style={{ gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Buscar skills… (ej: "burp", "rf", "docker", "reporting")'
                aria-label="Buscar skills"
                className="input"
                style={{
                  minWidth: 260,
                  flex: "1 1 320px",
                }}
              />

              {query.trim() ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda"
                >
                  Limpiar
                </button>
              ) : null}

              <span className="muted" style={{ fontSize: 14 }}>
                {tokens.length === 0 ? `${skills.length} skills` : `${totalHits} / ${skills.length} coinciden`}
              </span>
            </div>

            {tokens.length > 0 && totalHits === 0 ? (
              <p className="muted" style={{ marginTop: 6 }}>
                No hay resultados. Prueba con menos palabras o sinónimos (p.ej. “web”, “recon”, “linux”, “rf”).
              </p>
            ) : null}
          </div>

        <div className="stack">
          {categories.map((cat) => (
            <div key={cat.name} className="stack">
              <h3 className="h3">{cat.name}</h3>

              <div className="skillChips">
                {cat.items.map((s) => {
                  const active = skillParam === s.id;
                  const isMatch = tokens.length === 0 ? true : matchesAllTokens(skillHaystack(s), tokens);

                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={active ? "skillChip active" : "skillChip"}
                      onClick={() => openSkill(s.id)}
                      aria-haspopup="dialog"
                      aria-expanded={active}
                      // pequeño “feedback” visual si estás filtrando
                      style={
                        tokens.length > 0
                          ? {
                              opacity: isMatch ? 1 : 0.35,
                            }
                          : undefined
                      }
                    >
                      <span className="skillName">{s.name}</span>
                      <span className="skillMeta">{s.level}/5</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SkillPanel open={open} skill={selected} onClose={closeSkill} />
    </div>
  );
}
