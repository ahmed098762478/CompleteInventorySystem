import { Link } from "react-router-dom";
import { stockStatus, useInventory } from "../../../context/AppContext";
import { ProductMark, StockBadge } from "../../ui/UI";
import Icon from "../../ui/Icon";

export default function HomePage() {
  const { products } = useInventory();
  const units = products.reduce((sum, p) => sum + p.quantity, 0);
  const alerts = products.filter((p) => stockStatus(p) !== "available").length;
  return (
    <div className="site-container">
      <div className="hero-grid">
        <div className="hero-copy"><span className="hero-kicker"><span className="status-dot" />LA GESTION DE STOCK, SIMPLEMENT</span><h1>Votre inventaire.<br /><span>Enfin sous contrôle.</span></h1><p>Centralisez vos produits, suivez vos quantités et anticipez les ruptures. Tout ce dont vous avez besoin pour gérer votre stock avec clarté.</p><div className="hero-actions"><Link to="/login" className="button button-primary button-large">Découvrir mon espace<Icon name="arrow" size={19} /></Link><a href="#catalog" className="button button-secondary button-large">Voir l’aperçu</a></div><div className="hero-proof"><span><Icon name="check" size={15} />Démo prête à explorer</span><span><Icon name="check" size={15} />Sans installation</span></div></div>
        <div className="hero-product-scene">
          <div className="hero-preview">
            <div className="preview-window-bar"><span className="window-dots"><i /><i /><i /></span><span>ProductStore / Vue d’ensemble</span><Icon name="lock" size={12} /></div>
            <div className="preview-content"><div className="preview-heading"><div><span className="eyebrow">MON ESPACE</span><h2>Votre stock, en un coup d’œil.</h2></div><span className="preview-live"><span className="status-dot" />Démo</span></div><div className="preview-stats"><div><Icon name="box" size={18} /><strong>{products.length}</strong><span>Produits</span></div><div><Icon name="layers" size={18} /><strong>{units}</strong><span>Unités en stock</span></div><div><Icon name="alert" size={18} /><strong>{alerts}</strong><span>Alertes</span></div></div><div className="preview-table-head"><span>PRODUIT</span><span>DISPONIBILITÉ</span></div>{products.slice(0, 3).map((p) => <div className="preview-product" key={p.id}><ProductMark categoryId={p.categoryId} small /><strong>{p.name}</strong><StockBadge product={p} /></div>)}{!products.length && <p className="muted">Votre premier produit vous attend dans l’espace de gestion.</p>}</div>
          </div>
          <div className="floating-stock-note"><span><Icon name="check" size={19} /></span><div><strong>Une vue claire de votre stock</strong><small>Produits, quantités et alertes réunis</small></div></div>
          <div className="hero-orbit" aria-hidden="true" />
        </div>
      </div>
      <div className="hero-capabilities">{[["box", "Un catalogue centralisé"], ["chart", "Des indicateurs utiles"], ["alert", "Des alertes visibles"], ["layers", "Des catégories organisées"]].map(([icon, label]) => <div key={icon}><Icon name={icon} size={21} /><span>{label}</span></div>)}</div>
    </div>
  );
}
