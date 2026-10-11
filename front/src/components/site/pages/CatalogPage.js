import { Link } from "react-router-dom";
import { money, useInventory } from "../../../context/AppContext";
import { ProductMark, StockBadge } from "../../ui/UI";
import Icon from "../../ui/Icon";

export default function CatalogPage() {
  const { products, categories } = useInventory();
  return (
    <div className="site-container">
      <div className="site-section-heading"><div><p className="eyebrow">UN APERÇU CONCRET</p><h2>L’essentiel de votre inventaire.</h2><p>Des références lisibles, des quantités précises, des statuts qui parlent.</p></div><Link className="text-link" to="/login">Explorer la démo<Icon name="arrow" size={17} /></Link></div>
      <div className="public-inventory-grid">{products.slice(0, 4).map((p) => <article className="public-product-card" key={p.id}><div className="public-product-top"><ProductMark categoryId={p.categoryId} /><StockBadge product={p} /></div><span className="product-category-label">{categories.find((c) => c.id === p.categoryId)?.name}</span><h3>{p.name}</h3><p>{p.description || "Référence de votre inventaire"}</p><div className="public-product-bottom"><div><span>Prix unitaire</span><strong>{money(p.price)}</strong></div><div><span>En stock</span><strong>{p.quantity}<small> unités</small></strong></div></div></article>)}</div>
      {!products.length && <div className="panel empty-state"><h3>Un inventaire prêt à accueillir vos produits.</h3><p>Ajoutez votre première référence dans l’espace de gestion.</p></div>}
      <p className="public-demo-caption"><Icon name="info" size={15} />Aperçu de l’inventaire de démonstration enregistré dans ce navigateur.</p>
    </div>
  );
}
