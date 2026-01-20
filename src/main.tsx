import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from "./pages/Home"
import Blog from "./pages/Blog"


function Shell() { 
  return (
    <BrowserRouter>
      <header style={{ padding: 24, display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/blog">Blog</Link>
      </header>

      <main style={{ padding: 24 }}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Shell />
  </StrictMode>,
)
