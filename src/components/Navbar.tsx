import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

function cx({ isActive }: { isActive: boolean }) {
  return isActive ? "navlink active" : "navlink";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Cerrar con Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Cerrar al clicar fuera
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        buttonRef.current &&
        !buttonRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Cuando se abre, bloquear scroll del body (opcional pero queda bien)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header data-site-header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-dot" />
          <span>0xW1TCH3R</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="nav nav-desktop">
          <NavLink to="/projects" className={cx}>Projects</NavLink>
          <NavLink to="/blog" className={cx}>Blog</NavLink>
          <NavLink to="/about" className={cx}>About</NavLink>
          <NavLink to="/backlog" className={cx}>Changelog</NavLink>
          <NavLink to="/contact" className={cx}>Contact</NavLink>
        </nav>

        {/* Mobile burger */}
        <button
          ref={buttonRef}
          type="button"
          className="nav-burger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="burger-lines" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile overlay + panel */}
      <div className={open ? "nav-overlay open" : "nav-overlay"} aria-hidden={!open}>
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className={open ? "nav-panel open" : "nav-panel"}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <nav className="nav nav-mobile">
            <NavLink to="/projects" className={cx} onClick={() => setOpen(false)}>Projects</NavLink>
            <NavLink to="/blog" className={cx} onClick={() => setOpen(false)}>Blog</NavLink>
            <NavLink to="/about" className={cx} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/backlog" className={cx} onClick={() => setOpen(false)}>Changelog</NavLink>
            <NavLink to="/contact" className={cx} onClick={() => setOpen(false)}>Contact</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
