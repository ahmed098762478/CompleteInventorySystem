import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { ThemeToggle } from "../ui/UI";
import Icon from "../ui/Icon";

export default function Header({ onMenu, menuOpen, menuButtonRef }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const current = pathname.includes("categories") ? "Catégories" : pathname.includes("add-product") ? "Ajouter un produit" : pathname.endsWith("/edit") ? "Modifier un produit" : pathname.includes("products") ? "Produits" : "Tableau de bord";
  return (
    <header className="admin-header">
      <div className="header-leading">
        <button ref={menuButtonRef} type="button" className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Ouvrir le menu" aria-expanded={menuOpen}><Icon name="menu" /></button>
        <div className="breadcrumbs"><Link to="/admin">Espace de gestion</Link><Icon name="chevron" size={13} /><span>{current}</span></div>
      </div>
      <div className="header-trailing">
        <span className="demo-pill"><span className="status-dot" />Démo</span>
        <ThemeToggle />
        <span className="header-divider" />
        <div className="user-profile"><span className="avatar">{user.email.slice(0, 2).toUpperCase()}</span><span className="user-copy"><strong>Gestionnaire</strong><small>{user.email}</small></span></div>
        <button type="button" className="icon-button" title="Se déconnecter" aria-label="Se déconnecter" onClick={() => { logout(); navigate("/login", { replace: true }); }}><Icon name="logout" size={19} /></button>
      </div>
    </header>
  );
}
