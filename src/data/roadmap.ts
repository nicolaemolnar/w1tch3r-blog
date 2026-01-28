// src/data/roadmap.ts
export type RoadmapStatus = "now" | "next" | "later" | "done" | "paused";

export type RoadmapCategory =
  | "Portfolio"
  | "Security"
  | "Backend"
  | "Frontend"
  | "DevOps"
  | "AI"
  | "General";

export type RoadmapNode = {
  id: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
  category: RoadmapCategory;
  tags?: string[];
  effort?: 1 | 2 | 3 | 4 | 5;
  impact?: 1 | 2 | 3 | 4 | 5;
  children?: RoadmapNode[];
  relatedProjectSlugs?: string[];
};

export const STATUS_LABEL: Record<RoadmapStatus, string> = {
  now: "Ahora",
  next: "Siguiente",
  later: "Más adelante",
  done: "Hecho",
  paused: "Pausado",
};

export const ROADMAP: RoadmapNode[] = [
  // =========================
  // BLOG (ACTIVO)
  // =========================
  {
    id: "blog-track",
    title: "Blog Personal",
    description: "",
    status: "now",
    category: "General",
    tags: ["blog"],
    impact: 5,
    effort: 5,
    children: [
      {
        id: "blog-writeups",
        title: "Writeups de máquinas HTB",
        description:
          "Objetivo: Publicar 1 writeup quincenal que reporte los pasos seguidos para completar cada máquina. Estructura: Recon → Explotación → Post-exploit → Mitigación → Lecciones.",
        status: "now",
        category: "Security",
        tags: ["writeup", "pentest", "quincenal"],
        impact: 5,
        effort: 3,
        children: [
          {
            id: "writeup-template",
            title: "Plantilla de writeup",
            description:
              "Plantilla fija + checklist (reproducibilidad, capturas, comandos, impacto, mitigaciones).",
            status: "now",
            category: "General",
            tags: ["template", "checklist"],
            impact: 4,
            effort: 2,
          },
          {
            id: "writeup-pipeline",
            title: "Pipeline de publicación",
            description:
              "Workflow: notas → borrador → revisión → publicación (tags, TOC, portada, enlaces).",
            status: "next",
            category: "DevOps",
            tags: ["workflow", "markdown"],
            impact: 4,
            effort: 3,
          },
          {
            id: "writeups-series",
            title: "Series temáticas",
            description:
              "Agrupar writeups por temática (OWASP/API, AD, Linux, Windows).",
            status: "later",
            category: "Security",
            tags: ["series"],
            impact: 2,
            effort: 1,
          },
        ],
      },
      {
        id: "blog-tech-posts",
        title: "Posts de tecnologías aprendidas",
        description:
          "Micro-posts útiles que expliquen conceptos, snippets, errores comunes, checklists y muestren mini-demos que expliquen proyectos o tecnologías más grandes.",
        status: "later",
        category: "General",
        tags: ["learning", "snippets", "docs", "projects"],
        impact: 4,
        effort: 3,
        children: [
          {
            id: "tech-post-format",
            title: "Formato “Tech Note”",
            description:
              "Definir una estructura básica para las Tech Notes: Qué es X → Cuándo usarlo → Ejemplo → Pitfalls → Referencias. Priorizamos claridad y concisión.",
            status: "later",
            category: "General",
            tags: ["format", "tech-note"],
            impact: 4,
            effort: 2,
          },
          {
            id: "linkedin-osint",
            title: "Project: Enumeración de empleados de una empresa mediante técnicas automatizadas de OSINT en LinkedIn.",
            description:
              "Redacción del proyecto de fin de grado sobre OSINT para la recopilación automatizada de datos de empleados de una empresa específica en LinkedIn utilizando técnicas de scraping y análisis de datos.",
            status: "later",
            category: "Security",
            tags: ["osint", "linkedin", "automation"],
            impact: 4,
            effort: 3,
          },
          {
            id: "3ll10t-gpt",
            title: "Project: IA generativa para el desarrollo de Skills avanzadas de ciberseguridad.",
            description:
              "Redacción del proyecto de fin de máster sobre IA generativa para el desarrollo de Skills avanzadas de ciberseguridad, que combina tecnología LLM en una API REST que genera un copilot para pentesters nóveles.",
            status: "later",
            category: "Security",
            tags: ["ai", "gpt", "pentesting"],
            impact: 4,
            effort: 3,
          },
        ],
      },
    ],
  },

  // =========================
  // PORTFOLIO (DONE)
  // =========================
  {
    id: "portfolio-done",
    title: "Portfolio terminado",
    description: "Track de tareas ya completadas para llegar al estado actual.",
    status: "done",
    category: "Portfolio",
    tags: ["done", "portfolio"],
    impact: 5,
    effort: 4,
    children: [
      {
        id: "gh-pages-no-jekyll",
        title: "GH Pages: desactivar Jekyll",
        description: "Ajuste de despliegue para que el sitio funcione correctamente.",
        status: "done",
        category: "DevOps",
        tags: ["gh-pages", "deploy"],
      },
      {
        id: "router-base-url",
        title: "Router: BASE_URL para rutas correctas",
        description: "Navegación consistente y recarga sin rutas rotas en GitHub Pages.",
        status: "done",
        category: "Frontend",
        tags: ["react-router", "vite", "base-url"],
      },
      {
        id: "markdown-toc",
        title: "Blog: TOC / navegación en posts",
        description: "Tabla de contenidos para mejorar UX en artículos largos.",
        status: "done",
        category: "Frontend",
        tags: ["markdown", "toc", "ux"],
      },
      {
        id: "posts-build-fix",
        title: "Build: asegurar assets/posts en dist",
        description: "Corrección de 404 al desplegar posts/markdown en GH Pages.",
        status: "done",
        category: "DevOps",
        tags: ["build", "assets", "gh-pages"],
      },
      {
        id: "background-continuous",
        title: "UI: fondo continuo (sin patrón cortado)",
        description: "Mejora visual del site con fondo fluido.",
        status: "done",
        category: "Frontend",
        tags: ["css", "ui"],
      },
      {
        id: "about-skill-search",
        title: "About: búsqueda y filtrado de skills",
        description: "UX mejorada para encontrar skills rápidamente.",
        status: "done",
        category: "Frontend",
        tags: ["skills", "search", "ux"],
      },
      {
        id: "backlog-roadmap-graph",
        title: "Backlog: roadmap gráfico con SVG + panel",
        description: "Árbol interactivo con filtros y drawer de detalle.",
        status: "done",
        category: "Frontend",
        tags: ["roadmap", "svg", "ui"],
      },
    ],
  },
];
