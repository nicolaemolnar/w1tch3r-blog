import { Link, useParams } from "react-router-dom";
import Card from "../components/Card";
import Tag from "../components/Tag";
import { posts } from "../data/posts";
import { formatDate } from "../utils/format";

export default function Post() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="stack">
        <h1 className="title">Post no encontrado</h1>
        <Link className="inline-link" to="/blog">← Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <header className="stack">
        <Link className="inline-link" to="/blog">← Volver</Link>
        <h1 className="title">{post.title}</h1>
        <div className="row space-between">
          <span className="muted">{formatDate(post.date)}</span>
          <div className="tags">
            {post.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </header>

      <Card>
        <article className="prose">
          {post.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </Card>

      <div className="row">
        <Link className="btn ghost" to="/projects">Ver proyectos</Link>
        <Link className="btn ghost" to="/contact">Contactar</Link>
      </div>
    </div>
  );
}
