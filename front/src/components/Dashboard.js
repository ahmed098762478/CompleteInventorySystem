import { Link } from "react-router-dom";
import { money, stockStatus, useInventory } from "../context/AppContext";
import { EmptyState, PageHeading, ProductMark, StatCard, StockBadge } from "./ui/UI";
import Icon from "./ui/Icon";

export default function Dashboard() {
  const { products, categories } = useInventory();
  const units = products.reduce((sum, p) => sum + p.quantity, 0);
  const value = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  const alerts = products.filter((p) => stockStatus(p) !== "available");
  const out = alerts.filter((p) => p.quantity === 0).length;
  const counts = { available: products.filter((p) => stockStatus(p) === "available").length, low: alerts.length - out, out };
  const availablePercent = products.length ? Math.round(counts.available / products.length * 100) : 0;
  const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return (
    <>
      <PageHeading eyebrow="VUE D’ENSEMBLE" title="Tableau de bord" description="Gardez une longueur d’avance sur votre inventaire.">
        <span className="date-label"><Icon name="clock" size={16} />{date}</span>
        <Link to="/admin/add-product" className="button button-primary"><Icon name="plus" size={18} />Ajouter un produit</Link>
      </PageHeading>
      <div className="stats-grid">
        <StatCard label="Produits référencés" value={products.length} caption={`${categories.length} catégories dans votre catalogue`} icon="box" />
        <StatCard label="Unités en stock" value={units.toLocaleString("fr")} caption="Quantité totale disponible" icon="layers" tone="blue" />
        <StatCard label="Valeur du stock" value={money(value)} caption="Calculée au prix unitaire" icon="wallet" tone="purple" />
        <StatCard label="Alertes de stock" value={alerts.length} caption={`${out} en rupture · ${alerts.length - out} à réapprovisionner`} icon="alert" tone="amber" />
      </div>
      <div className="dashboard-grid">
        <section className="panel inventory-panel">
          <div className="panel-heading"><div><h2>Votre inventaire</h2><p>Une vue rapide de vos produits</p></div><Link to="/admin/products" className="text-link">Tout voir<Icon name="arrow" size={16} /></Link></div>
          {products.length ? <div className="table-scroll"><table className="data-table compact-table"><caption className="sr-only">Aperçu de l’inventaire</caption><thead><tr><th scope="col">Produit</th><th scope="col">Stock</th><th scope="col">Statut</th></tr></thead><tbody>
            {products.slice(0, 5).map((p) => <tr key={p.id}><td><Link to={`/admin/products/${p.id}/edit`} className="product-cell"><ProductMark categoryId={p.categoryId} small /><span><strong>{p.name}</strong><small>{categories.find((c) => c.id === p.categoryId)?.name}</small></span></Link></td><td className="quantity-cell">{p.quantity}<small> unités</small></td><td><StockBadge product={p} /></td></tr>)}
          </tbody></table></div> : <EmptyState title="Votre inventaire commence ici" description="Ajoutez votre premier produit pour suivre votre stock." to="/admin/add-product" action="Ajouter un produit" />}
          <div className="panel-footnote"><span className="status-dot" />Inventaire mis à jour à chaque modification</div>
        </section>
        <section className="panel health-panel">
          <div className="panel-heading"><div><h2>État du stock</h2><p>Répartition de vos références</p></div><Icon name="chart" /></div>
          <div className={`stock-donut ${products.length ? "" : "is-empty"}`} style={{ "--available-angle": `${products.length ? counts.available / products.length * 360 : 0}deg`, "--low-angle": `${products.length ? (counts.available + counts.low) / products.length * 360 : 0}deg` }} role="img" aria-label={`${counts.available} produits en stock, ${counts.low} en stock faible, ${counts.out} en rupture`}><div><strong>{availablePercent}<span>%</span></strong><small>en stock suffisant</small></div></div>
          <div className="stock-legend">{[["available", "En stock"], ["low", "Stock faible"], ["out", "En rupture"]].map(([status, label]) => <div key={status}><span><i className={`legend-dot legend-${status}`} />{label}</span><strong>{counts[status]}<small> produits</small></strong></div>)}</div>
        </section>
      </div>
      <div className="dashboard-lower">
        <section className="panel">
          <div className="panel-heading"><div><h2>À surveiller</h2><p>Les produits qui demandent votre attention</p></div><span className="count-pill">{alerts.length}</span></div>
          {alerts.length ? <div className="alert-list">{alerts.map((p) => <Link to={`/admin/products/${p.id}/edit`} className="alert-row" key={p.id}><span className={`alert-product-icon tone-${p.quantity ? "amber" : "red"}`}><Icon name={p.quantity ? "alert" : "box"} size={19} /></span><span><strong>{p.name}</strong><small>{p.quantity ? `${p.quantity} unités restantes · Seuil : ${p.threshold}` : "Ce produit est en rupture de stock"}</small></span><Icon name="chevron" size={16} /></Link>)}</div> : <div className="all-good"><Icon name="check" /><p>{products.length ? "Tous vos produits disposent d’un stock suffisant." : "Les alertes apparaîtront avec vos premiers produits."}</p></div>}
        </section>
        <section className="quick-start-card"><span className="quick-start-icon"><Icon name="layers" size={28} /></span><p className="eyebrow">UN INVENTAIRE BIEN ORGANISÉ</p><h2>Chaque produit à sa place.</h2><p>Regroupez vos références par catégorie pour retrouver l’essentiel plus rapidement.</p><Link to="/admin/categories" className="button button-secondary">Gérer les catégories<Icon name="arrow" size={17} /></Link><div className="card-grid-decoration" aria-hidden="true" /></section>
      </div>
    </>
  );
}
