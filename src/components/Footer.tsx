import SocialLinks from "./SocialLinks";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="muted">© {year} by <b>0xw1tch3r</b>. Built with React (Vite) over Github Pages.</p>

        <SocialLinks
          github="https://github.com/nicolaemolnar"
          linkedin="https://www.linkedin.com/in/nicolae-alexandru-molnar/"
          email="nicolae.molnar001@gmail.com"
          variant="icon"
        />
      </div>
    </footer>
  );
}
