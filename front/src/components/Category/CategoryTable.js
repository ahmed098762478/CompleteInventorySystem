import { useRef, useState } from "react";
import { useInventory } from "../../context/AppContext";
import { EmptyState, Field, PageHeading, ProductMark } from "../ui/UI";
import Icon from "../ui/Icon";

export default function CategoryTable() {
  const { categories, products, saveCategory } = useInventory();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const reset = () => { setName(""); setEditing(null); setError(""); };
  const submit = (e) => {
    e.preventDefault();
    const message = saveCategory(name, editing);
    if (message) { setError(message); inputRef.current?.focus(); return; }
    reset();
  };
  const startEdit = (category) => { setName(category.name); setEditing(category.id); setError(""); inputRef.current?.focus(); inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  return (
    <>
      <PageHeading eyebrow="ORGANISATION" title="Catégories" description="Un catalogue structuré pour une gestion plus simple."><button type="button" className="button button-primary" onClick={() => { reset(); inputRef.current?.focus(); inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><Icon name="plus" size={18} />Nouvelle catégorie</button></PageHeading>
      <div className="categories-layout">
        <section className="panel">
          <div className="panel-heading"><div className="heading-inline"><h2>Vos catégories</h2><span className="count-pill">{categories.length}</span></div></div>
          {categories.length ? <div className="category-list">{categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            return <div className="category-row" key={c.id}><ProductMark categoryId={c.id} /><div><h3>{c.name}</h3><p>{count} produit{count > 1 ? "s" : ""} associé{count > 1 ? "s" : ""}</p></div><button type="button" className="button button-ghost" aria-label={`Renommer ${c.name}`} onClick={() => startEdit(c)}><Icon name="edit" size={16} />Renommer</button></div>;
          })}</div> : <EmptyState title="Organisez votre catalogue" description="Ajoutez une première catégorie à l’aide du formulaire." />}
        </section>
        <aside>
          <form className="panel category-form" onSubmit={submit} noValidate>
            <span className="stat-icon tone-teal"><Icon name="layers" /></span><h2>{editing ? "Renommer la catégorie" : "Créer une catégorie"}</h2><p className="muted">{editing ? "Les produits associés conserveront leur catégorie." : "Regroupez vos produits sous un nom clair."}</p>
            <Field id="category-name" label="Nom de la catégorie *" error={error}><input ref={inputRef} id="category-name" className={`input ${error ? "input-invalid" : ""}`} value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Ex. Équipements réseau" maxLength={60} required aria-invalid={Boolean(error)} aria-describedby={error ? "category-name-error" : undefined} /></Field>
            <button type="submit" className="button button-primary"><Icon name={editing ? "check" : "plus"} size={18} />{editing ? "Enregistrer le nom" : "Créer la catégorie"}</button>
            {editing && <button type="button" className="button button-ghost" onClick={reset}>Annuler</button>}
          </form>
          <div className="info-strip"><Icon name="info" size={18} /><p>Les catégories sont disponibles dans les formulaires et les filtres de produits.</p></div>
        </aside>
      </div>
    </>
  );
}
