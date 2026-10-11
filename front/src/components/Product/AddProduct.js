import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { money, useInventory } from "../../context/AppContext";
import { EmptyState, Field, PageHeading, ProductMark, StockBadge } from "../ui/UI";
import Icon from "../ui/Icon";

function ProductForm({ product }) {
  const { categories, saveProduct } = useInventory();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [values, setValues] = useState(product || { name: "", description: "", categoryId: categories[0]?.id || "", price: "", quantity: "", threshold: 5 });
  const [errors, setErrors] = useState({});
  const edit = Boolean(product);
  const update = (key) => (e) => { setValues((previous) => ({ ...previous, [key]: e.target.value })); setErrors((previous) => ({ ...previous, [key]: "" })); };
  const attrs = (key) => ({ id: key, value: values[key], onChange: update(key), className: `input ${errors[key] ? "input-invalid" : ""}`, "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `${key}-error` : undefined });
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Le nom du produit est requis.";
    if (!categories.some((c) => c.id === values.categoryId)) next.categoryId = "Sélectionnez une catégorie.";
    if (String(values.price).trim() === "" || !Number.isFinite(Number(values.price)) || Number(values.price) < 0) next.price = "Saisissez un prix positif ou nul.";
    ["quantity", "threshold"].forEach((key) => {
      if (String(values[key]).trim() === "" || !Number.isSafeInteger(Number(values[key])) || Number(values[key]) < 0) next[key] = "Saisissez un nombre entier positif ou nul.";
    });
    setErrors(next);
    if (Object.keys(next).length) { formRef.current?.querySelector(`#${Object.keys(next)[0]}`)?.focus(); return; }
    saveProduct({ ...values, name: values.name.trim(), description: values.description.trim(), price: Number(values.price), quantity: Number(values.quantity), threshold: Number(values.threshold) }, product?.id);
    navigate("/admin/products");
  };
  const preview = { ...values, price: Number(values.price) || 0, quantity: Number(values.quantity) || 0, threshold: Number(values.threshold) || 0 };
  return (
    <>
      <Link to="/admin/products" className="back-link"><Icon name="back" size={16} />Retour aux produits</Link>
      <PageHeading eyebrow="INVENTAIRE" title={edit ? "Modifier le produit" : "Ajouter un produit"} description={edit ? "Actualisez les informations et le stock de votre référence." : "Une nouvelle référence, un inventaire plus complet."} />
      <div className="product-form-layout">
        <form ref={formRef} onSubmit={submit} noValidate className="panel product-form">
          <div className="panel-heading"><div><h2>Informations du produit</h2><p>Les champs marqués d’un * sont obligatoires.</p></div><Icon name="box" /></div>
          <div className="form-section">
            <Field id="name" label="Nom du produit *" error={errors.name}><input {...attrs("name")} placeholder="Ex. Clavier Logitech MX Keys" required maxLength={120} /></Field>
            <Field id="description" label="Description"><textarea {...attrs("description")} placeholder="Caractéristiques, modèle, détails utiles…" rows={3} maxLength={600} /></Field>
            <div className="form-grid">
              <Field id="categoryId" label="Catégorie *" error={errors.categoryId}><select {...attrs("categoryId")} required><option value="">Sélectionner une catégorie</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
              <Field id="price" label="Prix unitaire (DH) *" error={errors.price}><input {...attrs("price")} type="number" min="0" step="0.01" placeholder="0,00" required /></Field>
            </div>
            {!categories.length && <p className="field-hint">Créez d’abord une catégorie dans <Link className="text-link" to="/admin/categories">la gestion des catégories</Link>.</p>}
          </div>
          <div className="form-section stock-form-section">
            <div className="section-heading"><span className="stat-icon tone-teal"><Icon name="layers" /></span><div><h2>Gestion du stock</h2><p>Définissez les quantités et anticipez les ruptures.</p></div></div>
            <div className="form-grid">
              <Field id="quantity" label="Quantité en stock *" error={errors.quantity}><input {...attrs("quantity")} type="number" min="0" step="1" placeholder="0" required /></Field>
              <Field id="threshold" label="Seuil d’alerte *" error={errors.threshold} hint="Une alerte apparaît à ce seuil ou en dessous."><input {...attrs("threshold")} aria-describedby={errors.threshold ? "threshold-error" : "threshold-hint"} type="number" min="0" step="1" required /></Field>
            </div>
          </div>
          <div className="form-actions"><Link to="/admin/products" className="button button-secondary">Annuler</Link><button type="submit" className="button button-primary"><Icon name="check" size={18} />{edit ? "Enregistrer les modifications" : "Créer le produit"}</button></div>
        </form>
        <aside className="form-aside">
          <section className="panel product-preview"><p className="eyebrow">APERÇU DU PRODUIT</p><ProductMark categoryId={values.categoryId} /><h2>{values.name.trim() || "Votre nouveau produit"}</h2><p>{categories.find((c) => c.id === values.categoryId)?.name || "Sans catégorie"}</p><StockBadge product={preview} /><dl><div><dt>Prix unitaire</dt><dd>{money(preview.price)}</dd></div><div><dt>Quantité</dt><dd>{preview.quantity} unités</dd></div><div><dt>Valeur du stock</dt><dd>{money(preview.price * preview.quantity)}</dd></div></dl></section>
          <div className="help-card"><Icon name="info" /><h3>Le bon seuil, au bon moment.</h3><p>Choisissez un seuil adapté au rythme de sortie de vos produits. Les références à surveiller apparaîtront sur le tableau de bord.</p></div>
        </aside>
      </div>
    </>
  );
}
export default function AddProduct() {
  const { id } = useParams();
  const { products } = useInventory();
  const product = id ? products.find((p) => p.id === id) : null;
  if (id && !product) return <EmptyState title="Produit introuvable" description="Cette référence n’existe pas dans votre inventaire." to="/admin/products" action="Retour aux produits" />;
  return <ProductForm key={id || "new"} product={product} />;
}
