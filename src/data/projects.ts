export type Project = {
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
  };
  year: number;
};

export const projects: Project[] = [
  {
    slug: "portfolio-blog",
    title: "Portfolio + Blog",
    description: "Web personal con blog, proyectos, página About y despliegue en GitHub Pages.",
    highlights: ["React + Vite", "React Router", "Diseño limpio y responsive"],
    tags: ["React", "Vite", "Frontend"],
    links: {
      demo: "https://usuario.github.io/w1tch3r-blog/",
      repo: "https://github.com/usuario/w1tch3r-blog",
    },
    year: 2026,
  },
  {
    slug: "security-writeups",
    title: "Security Writeups",
    description: "Colección de writeups y notas de pentesting, organizadas por categorías y dificultad.",
    highlights: ["Estructura consistente", "Búsqueda y tags", "Enfoque didáctico"],
    tags: ["Security", "Writeups"],
    links: { repo: "https://github.com/usuario/security-writeups" },
    year: 2026,
  },
  {
    slug: "tooling-dashboard",
    title: "Tooling Dashboard",
    description: "Dashboard de utilidades para dev: snippets, checklists y mini tools.",
    highlights: ["Componentización", "Buenas prácticas", "UX básica"],
    tags: ["React", "Productividad"],
    links: { repo: "https://github.com/usuario/tooling-dashboard" },
    year: 2025,
  },
];
