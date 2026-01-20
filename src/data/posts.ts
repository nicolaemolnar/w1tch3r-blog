export type Post = {
  slug: string;
  title: string;
  date: string; // ISO "YYYY-MM-DD"
  excerpt: string;
  tags: string[];
  content: string[]; // párrafos simples (sin markdown)
};

export const posts: Post[] = [
  {
    slug: "bienvenido",
    title: "Bienvenido al blog",
    date: "2026-01-20",
    excerpt: "Cómo voy a usar este blog: notas cortas, aprendizaje y proyectos.",
    tags: ["Meta", "Blog"],
    content: [
      "Este blog es mi espacio para documentar proyectos y aprendizajes.",
      "Me interesa escribir cosas aplicables: decisiones de arquitectura, debugging y buenas prácticas.",
      "Si algo te sirve, genial. Si no, al menos queda como registro para mi yo del futuro.",
    ],
  },
  {
    slug: "deploy-github-pages-vite",
    title: "Deploy en GitHub Pages con Vite",
    date: "2026-01-19",
    excerpt: "Base path, dist, y errores típicos al publicar.",
    tags: ["React", "Vite", "Deploy"],
    content: [
      "En Vite, el build se genera en la carpeta dist, no en build.",
      "En GitHub Pages, configura base en vite.config para que los assets se resuelvan bien.",
      "Si usas BrowserRouter, recuerda que al refrescar rutas profundas puede haber 404 en hosting estático.",
    ],
  },
];
