import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { email, phone, phoneHref, whatsapp } from "../data.js";

const links = [
  ["/work", "Work"],
  ["/services", "Services"],
  ["/about", "About"],
  ["/preview", "Preview"],
  ["/contact", "Contact"],
];

export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <Link className="logo" to="/">
          <span className="mark" aria-hidden="true"><span /><span /><span /></span>
          dastorshollantors
        </Link>
        <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
          <span className="open" hidden={open}>Menu</span>
          <span className="close" hidden={!open}>Close</span>
        </button>
        <nav id="site-nav" className={open ? "is-open" : undefined} aria-label="Primary">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
          <Link className="btn" to="/contact#visit">Book a measure</Link>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <p className="logo">dastorshollantors</p>
            <p>Made-to-measure blinds, curtains, and interior decoration.</p>
          </div>
          <div>
            <p className="eyebrow">Studio</p>
            <p>The workroom, by appointment<br />Monday to Friday, 9:00–17:30</p>
            <p>
              <a href={phoneHref}>{phone}</a><br />
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><br />
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>
          <div className="footer-links">
            <p className="eyebrow">Pages</p>
            {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </div>
        </div>
        <div className="shell footer-base">
          <p>© {new Date().getFullYear()} dastorshollantors</p>
          <p>Measure. Make. Install.</p>
        </div>
      </footer>
    </>
  );
}

export function Band({ eyebrow, title, text, to, label }) {
  return (
    <section className="band">
      <div className="shell band-inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="lead">{text}</p>
        </div>
        <Link className="btn" to={to}>{label}</Link>
      </div>
    </section>
  );
}
