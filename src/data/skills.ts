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
  
];
