import Card from "../components/Card";
import SocialLinks from "../components/SocialLinks";

export default function Contact() {
  return (
    <div className="stack-lg">
      <header className="stack">
        <h1 className="title">Contacto</h1>
        <p className="lead">Si quieres hablar de un proyecto, dar feedback o colaborar con algo, aquí tienes mi información de contacto.</p>
      </header>

      <section className="grid-2">
        <Card>
          <h2 className="h2">Directo</h2>
          <p className="muted">Email y redes sociales:</p>

          <SocialLinks
            github="https://github.com/nicolaemolnar"
            linkedin="https://www.linkedin.com/in/nicolae-alexandru-molnar/"
            email="nicolae.molnar001@gmail.com"
            htb="https://app.hackthebox.com/users/2312708"
            variant="icon+text"
          />
        </Card>

        <Card>
          <h2 className="h2">Disponibilidad</h2>
          <p className="muted">
            Siempre estoy abierto a recibir correos y mensajes por LinkedIn. Tanto si quieres 
            colaborar con algún proyecto que tenga entre manos como si quieres charlar o te 
            interesa mi perfil, siéntete libre de mandarme un mensaje a cualquier hora y te 
            contestaré en cuanto me sea posible.
          </p>
        </Card>
      </section>
    </div>
  );
}
