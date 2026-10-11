import { Link, NavLink } from "react-router-dom";
import { useInventory } from "../../context/AppContext";
import { Brand } from "../ui/UI";
import Icon from "../ui/Icon";

export default function Sidebar({ onNavigate }) {
  const { products, categories } = useInventory();
  const navClass = ({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`;
  return (
    <aside className="sidebar">
      <Link to="/admin" className="sidebar-brand" onClick={onNavigate}><Brand inverse subtitle="GESTION DE STOCK" /></Link>
      <div className="workspace-label"><span className="workspace-avatar">PS</span><span>Mon espace<small>Inventaire de démonstration</small></span></div>
      <p className="sidebar-section">ESPACE DE GESTION</p>
      <nav className="sidebar-nav" aria-label="Navigation de gestion">
        <NavLink to="/admin" end className={navClass} onClick={onNavigate}><Icon name="dashboard" /><span>Tableau de bord</span></NavLink>
        <NavLink to="/admin/products" className={navClass} onClick={onNavigate}><Icon name="box" /><span>Produits</span><small>{products.length}</small></NavLink>
        <NavLink to="/admin/categories" className={navClass} onClick={onNavigate}><Icon name="layers" /><span>Catégories</span><small>{categories.length}</small></NavLink>
        <NavLink to="/admin/add-product" className={navClass} onClick={onNavigate}><Icon name="plus" /><span>Ajouter un produit</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><span className="tip-icon"><Icon name="shield" /></span><strong>Votre stock, en un coup d’œil.</strong><p>Des données claires pour mieux organiser votre inventaire.</p></div>
        <Link className="sidebar-site-link" to="/" onClick={onNavigate}><Icon name="back" size={17} />Retour au site</Link>
        <p className="sidebar-version">ProductStore · Version démo</p>
      </div>
    </aside>
  );
}
