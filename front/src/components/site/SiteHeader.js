import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { Brand, ThemeToggle } from "../ui/UI";
import Icon from "../ui/Icon";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const links = [["home", "Accueil"], ["catalog", "Inventaire"], ["about", "La solution"], ["contact", "Contact"]];
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <a href="#home" className="site-brand" onClick={() => setOpen(false)}><Brand /></a>
        <nav className="site-desktop-nav" aria-label="Navigation principale">{links.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav>
        <div className="site-header-actions"><ThemeToggle /><Link className="button button-primary site-login-link" to={user ? "/admin" : "/login"}><span>{user ? "Mon espace" : "Se connecter"}</span><Icon name="arrow" size={17} /></Link><button type="button" className="icon-button site-mobile-menu" onClick={() => setOpen((current) => !current)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="public-mobile-nav"><Icon name={open ? "close" : "menu"} /></button></div>
      </div>
      {open && <nav id="public-mobile-nav" className="site-mobile-nav" aria-label="Navigation mobile">{links.map(([id, title]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{title}<Icon name="chevron" size={16} /></a>)}</nav>}
    </header>
  );
}
