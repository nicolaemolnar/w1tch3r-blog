---
title: "Portfolio w1tch3r-blog"
slug: "portfolio-blog"
description: "Web personal que expone proyectos y artículos de Blog sobre Github Pages con Vite."
highlights:
  - "React + Vite"
  - "Diseño limpio y responsive"
  - "Generado con ayuda de IA"
tags: ["React", "Vite", "Frontend", "Blog"]
demo: "https://nicolaemolnar.github.io/w1tch3r-blog/"
repo: "https://github.com/nicolaemolnar/w1tch3r-blog"
month: "01"
year: 2026
draft: false
---

## 0. Descripción general

Este proyecto es mi **portfolio personal**, desarrollado como una **Single Page Application (SPA)** sobre **React-Vite** y desplegado en **GitHub Pages**.  
El objetivo principal es **centralizar mi perfil profesional**, mostrar proyectos reales y publicar artículos técnicos relacionados con desarrollo de software y ciberseguridad, dos temas que me apasionan.

El proyecto está pensado tanto para ofrecer una visión clara, rápida y navegable de mi experiencia y mis capacidades a posibles **reclutadores** como para compartir contenido técnico del que puedan aprender y puedan complementar **otros desarrolladores**.

---

## 1. Arquitectura y stack

- **React + TypeScript** para la construcción de la interfaz.
- **Vite** como bundler por su velocidad y simplicidad.
- **Browser Router** para navegación SPA.
- **Markdown** como formato fuente para el contenido importable (blog y proyectos).
- **GitHub Pages** como plataforma de despliegue.

El proyecto sigue una estructura modular y escalable:

- `src/pages/`: vistas principales (Home, Projects, Blog, Post, About…)
- `src/components/`: componentes reutilizables (Layout, Scroll, Cards, etc.)
- `src/styles/`: estilos globales y específicos (markdown, posts, layout)
- `posts/`: artículos del blog en formato `.md` y una cabecera personalizada.
- `projects/`: Descripción de los proyectos en formato `.md` y una cabecera personalizada (como la que estás leyendo).


---

## 2. Sistema de renderizado de contenido Markdown

El contenido dinámico de la página web se escribe directamente en **Markdown**, que posteriormente es renderizado por el navegador del usuario, lo que permite:

- Flujo de escritura sencillo, rápido y limpio.
- Control total del contenido sin CMS.
- Contenido en varios idiomas (varios ficheros).
- Versionado completo mediante Git y enlazar otros repositorios para desacoplar el contenido.

Cada documento incluye *front-matter* con metadatos (título, fecha, tags, resumen), que se utilizan para:
- Generar listados
- Filtrar por etiquetas
- Crear rutas dinámicas (`/[blog|projects]/:slug`)

El renderizado se ejecuta en el navegador del cliente, incrustando el contenido renderizado en la página web, respetando estilos y jerarquía semántica.

---

## 3. Enrutado y despliegue en GitHub Pages

El proyecto se despliega sobre una subpágina de mi dominio de GH Pages [nicolaemolnar.github.io](https://nicolaemolnar.github.io/), lo que permite desplegar varias aplicaciones SPA bajo el mismo dominio. 

Para el enrutado hemos utilizado BrowserRouter en lugar de HashRouter porque preferimos mantener las rutas limpias (sin caracteres especiales, `/#/<ruta>`) y por la simplicidad que ofrecen sus elementos de navegación. Sin embargo, eso presenta una serie de limitaciones que hemos tenido que adaptar:
- Usar `import.meta.env.BASE_URL` como URL base para garantizar que todos los enlaces internos apuntan al subproyecto.
- Generar un fallback del error `404 Not Found` de GitHub, para redirigir al router de `main.tsx` todas las peticiones de subrutas, provocadas al recargar la página o acceder a directamente por enlace (p.ej: enlace a un artículo compartido).

Esto permite que cualquier enlace interno o profundo funcione correctamente tanto en desarrollo como en un entorno de producción tan especial como GH Pages.

---

## 4. Diseño y experiencia de usuario

El diseño del proyecto sigue un enfoque **minimalista y funcional**, enfocado a transmitir la información de forma clara y directa. Principalmente, se caracteriza por:

- Tipografía clara y legible.
- Paleta de colores de alto contraste.
- Layout responsive y diseñado para dispositivos móviles y PCs.
- Navegación directa al contenido, sin distracciones.

De nuevo, el foco está en el contenido y la lectura, no en efectos innecesarios.

---

## 5. Uso de IA en el desarrollo

Debido a la necesidad de dearrollar un proyecto complejo y la poca experiencia que tengo en desarrollo web, me he apoyado mucho en **ChatGPT** como copiloto durante todas las fases del desarrollo. Concretamente, ha sido especialmente útil para:

- Explorar alternativas de arquitectura.
- Resolver dudas sobre el despliegue en GH Pages.
- Acelerar tareas repetitivas.
- Refactorización del código inicial y corrección de errores.
- Refinar textos y descripciones

Las decisiones técnicas finales y la implementación han sido totalmente conscientes y revisadas, dando como resultado un proyecto del que estoy orgulloso.

---

## 6. Objetivo del proyecto

Este portfolio no es solo una web personal, sino un **proyecto vivo**, que pretendo que siga creciendo mediante la publicación periódica de artículos y nuevos proyectos que aborde en el futuro.

En esencia, este proyecto me permite demostrar mis habilidades técnicas en los campos que me apasionan y tener la oportunidad de interactuar con la comunidad para enseñar lo que pueda y aprender de ellos.

Aunque ya está creada una versión funcional, estoy convencido de que pronto surgirán nuevas necesidades de desarrollo y mantenimiento que mantendrán este proyecto vivo por mucho tiempo.
