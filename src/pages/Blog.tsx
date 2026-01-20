const posts = [
  { slug: "primer-post", title: "Primer post" },
  { slug: "react-y-vite", title: "React + Vite" },
];

export default function Blog() {
  return (
    <>
      <h2>Blog</h2>
      <ul>
        {posts.map(p => (
          <li key={p.slug}>
            <a href={`/blog/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
