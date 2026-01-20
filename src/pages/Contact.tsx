import Card from "../components/Card";
import SocialLinks from "../components/SocialLinks";

export default function Contact() {
  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">Contact</h1>
        <p className="lead">Si quieres hablar de un proyecto, feedback o colaboración, aquí me tienes.</p>
      </header>

      <section className="grid-2">
        <Card>
          <h2 className="h2">Directo</h2>
          <p className="muted">Email y redes:</p>

          <SocialLinks
            email="tuemail@ejemplo.com"
            github="https://github.com/usuario"
            linkedin="https://www.linkedin.com/in/usuario"
            x="https://x.com/usuario"
            variant="icon+text"
          />
        </Card>

        <Card>
          <h2 className="h2">Disponibilidad</h2>
          <p className="muted">
            Añade aquí una frase breve: tipo de proyectos, horario, si aceptas freelance, etc.
          </p>
        </Card>
      </section>
    </div>
  );
}
