import { NavLink } from "react-router-dom";

function cx({ isActive }: { isActive: boolean }) {
  return isActive ? "navlink active" : "navlink";
}

export default function Navbar() {
  return (
    <header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          <span className="brand-dot" />
          <span>0xW1TCH3R</span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/projects" className={cx}>Projects</NavLink>
          <NavLink to="/blog" className={cx}>Blog</NavLink>
          <NavLink to="/about" className={cx}>About</NavLink>
          <NavLink to="/backlog" className={cx}>Backlog</NavLink>
          <NavLink to="/contact" className={cx}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
