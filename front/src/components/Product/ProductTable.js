import { useState } from "react";
import { Link } from "react-router-dom";
import { money, stockStatus, useInventory } from "../../context/AppContext";
import { EmptyState, PageHeading, ProductMark, StockBadge } from "../ui/UI";
import Icon from "../ui/Icon";

export default function ProductTable() {
  const { products, categories } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const normalize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
  const filtered = products.filter((p) => normalize(p.name).includes(normalize(query.trim())) && (!category || p.categoryId === category) && (!status || stockStatus(p) === status));
  const reset = () => { setQuery(""); setCategory(""); setStatus(""); };
  return (
    <>
      <PageHeading eyebrow="INVENTAIRE" title="Produits" description="Retrouvez, organisez et mettez à jour vos références."><Link to="/admin/add-product" className="button button-primary"><Icon name="plus" size={18} />Ajouter un produit</Link></PageHeading>
      <section className="panel">
        <div className="panel-heading"><div className="heading-inline"><h2>Tous les produits</h2><span className="count-pill">{products.length}</span></div><span className="muted small-text">Prix en dirhams marocains</span></div>
        <div className="table-toolbar">
          <div className="search-field"><Icon name="search" size={19} /><input aria-label="Rechercher un produit" placeholder="Rechercher un produit…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <select className="input filter-select" aria-label="Filtrer par catégorie" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Toutes les catégories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className="input filter-select" aria-label="Filtrer par statut" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tous les statuts</option><option value="available">En stock</option><option value="low">Stock faible</option><option value="out">Rupture</option></select>
        </div>
        {!products.length ? <EmptyState title="Aucun produit pour le moment" description="Créez votre première référence pour commencer à gérer votre stock." to="/admin/add-product" action="Ajouter un produit" /> : !filtered.length ? <EmptyState title="Aucun produit trouvé" description="Essayez un autre nom ou ajustez les filtres."><button className="button button-secondary" onClick={reset}>Réinitialiser les filtres</button></EmptyState> : <div className="table-scroll"><table className="data-table"><caption className="sr-only">Produits de votre inventaire</caption><thead><tr><th scope="col">Produit</th><th scope="col">Catégorie</th><th scope="col">Prix unitaire</th><th scope="col">Quantité</th><th scope="col">Statut</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>
          {filtered.map((p) => <tr key={p.id}><td><div className="product-cell"><ProductMark categoryId={p.categoryId} /><span><strong>{p.name}</strong><small>{p.description || "Aucune description"}</small></span></div></td><td><span className="category-tag">{categories.find((c) => c.id === p.categoryId)?.name}</span></td><td className="price-cell">{money(p.price)}</td><td><strong className={stockStatus(p) !== "available" ? "stock-attention" : ""}>{p.quantity}</strong><span className="unit-label"> unités</span></td><td><StockBadge product={p} /></td><td><Link to={`/admin/products/${p.id}/edit`} className="icon-button" aria-label={`Modifier ${p.name}`} title="Modifier le produit"><Icon name="edit" size={18} /></Link></td></tr>)}
        </tbody></table></div>}
        <div className="table-footer"><span role="status">{filtered.length} produit{filtered.length > 1 ? "s" : ""} sur {products.length}</span><span>Votre inventaire, toujours à jour.</span></div>
      </section>
      <div className="info-strip"><Icon name="info" size={18} /><p>Un produit passe en <strong>stock faible</strong> lorsque sa quantité atteint son seuil d’alerte, et en <strong>rupture</strong> lorsqu’elle atteint zéro.</p></div>
    </>
  );
}
