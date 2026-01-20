export type SkillCategory = "Frontend" | "Backend" | "DevOps" | "Security" | "General";
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type Certificate = {
  name: string;
  issuer?: string;
  year?: number;
  url?: string;
};

export type Skill = {
  id: string;                // slug corto, único (para anchor)
  name: string;              // "React", "TypeScript"...
  category: SkillCategory;
  level: SkillLevel;         // 1..5
  summary: string;           // 1-2 líneas
  competencies: string[];    // bullets: qué sabes hacer
  experience: {
    years?: number;          // opcional
    contexts: string[];      // proyectos, ámbitos, etc.
  };
  certificates?: Certificate[];
  tools?: string[];
  relatedProjectSlugs?: string[]; // enlazar a /projects/:slug
};

export const skills: Skill[] = [
  {
    id: "react",
    name: "React",
    category: "Frontend",
    level: 4,
    summary: "Componentización, routing, estado, patrones y DX en proyectos reales.",
    competencies: [
      "Arquitectura de componentes (UI + lógica)",
      "React Router (rutas, layouts, navegación)",
      "Hooks + patterns (custom hooks, composition)",
      "Performance básico (memoization, render control)",
    ],
    experience: {
      years: 1,
      contexts: ["Portfolio + blog", "Apps frontend con Vite", "UI reusable y layouts"],
    },
    tools: ["Vite", "React Router", "ESLint"],
    relatedProjectSlugs: ["portfolio-blog"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "General",
    level: 4,
    summary: "Tipado para mantener escalabilidad, refactor seguro y contratos claros.",
    competencies: [
      "Tipos utilitarios, unions, generics",
      "Modelado de DTOs/estructuras",
      "Tipado de props y data layers",
    ],
    experience: {
      years: 2,
      contexts: ["Frontend (React)", "Backends/servicios", "Refactors con seguridad"],
    },
  },
  {
    id: "web-security",
    name: "Web Security",
    category: "Security",
    level: 3,
    summary: "Pentesting web y fundamentos: OWASP, análisis, reporte y mitigaciones.",
    competencies: [
      "OWASP Top 10 (identificación y explotación básica)",
      "Análisis de auth/session y misconfigs",
      "Redacción de hallazgos y mitigaciones",
    ],
    experience: {
      contexts: ["Laboratorios tipo HTB", "Writeups y práctica continua"],
    },
    certificates: [{ name: "eJPT", issuer: "INE", year: 2025 }],
    tools: ["Burp Suite", "nmap"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    level: 3,
    summary: "Contenerización, compose y entornos reproducibles.",
    competencies: [
      "Dockerfiles (multi-stage básico)",
      "docker compose (servicios, redes, volúmenes)",
      "Debug de contenedores y logs",
    ],
    experience: { contexts: ["Servicios y herramientas self-hosted", "Entornos de dev reproducibles"] },
  },
  {
    id: "testing",
    name: "Testing",
    category: "General",
    level: 3,
    summary: "Tests para evitar regresiones y aumentar confianza en refactors.",
    competencies: [
      "Unit tests (lógica/funciones)",
      "Component tests (UI básica)",
      "Estrategias: qué testear y qué no",
    ],
    experience: { contexts: ["Proyectos personales", "Refactors con cobertura mínima"] },
    tools: ["Vitest / Jest (según setup)"],
  },
];
