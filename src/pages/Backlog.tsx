import Card from "../components/Card";

export default function Backlog() {
  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">Backlog</h1>
        <p className="lead">En qué estoy centrado actualmente (actualízalo cuando cambie).</p>
      </header>

      <Card>
        <ul className="list">
          <li>Mejorando mi portfolio con proyectos “presentables”.</li>
          <li>Escribiendo posts cortos: deploy, UX, debugging, seguridad web.</li>
          <li>Construyendo hábitos: constancia &gt; intensidad.</li>
        </ul>
        <p className="muted">Última actualización: enero 2026</p>
      </Card>
    </div>
  );
}
