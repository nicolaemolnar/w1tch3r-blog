import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="stack-lg">
      <h1 className="title">404</h1>
      <p className="lead">Esta página no existe.</p>
      <Link className="btn" to="/">Volver al inicio</Link>
    </div>
  );
}
