import Icon from "../../ui/Icon";

export default function AboutPage() {
  const features = [
    ["box", "Vos produits, bien renseignés.", "Nom, description, catégorie et prix : gardez toutes les informations utiles au même endroit."],
    ["alert", "Les ruptures n’attendent pas.", "Définissez un seuil par produit et repérez les références à réapprovisionner depuis votre tableau de bord."],
    ["chart", "Des chiffres qui ont du sens.", "Visualisez le nombre de références, les quantités disponibles et la valeur totale de votre stock."],
    ["layers", "Une organisation à votre mesure.", "Créez vos catégories, renommez-les et filtrez votre inventaire pour retrouver un produit rapidement."],
  ];
  return (
    <div className="site-container">
      <div className="about-intro"><div><p className="eyebrow">PENSÉ POUR LE QUOTIDIEN</p><h2>Moins de recherches.<br />Plus de maîtrise.</h2></div><p>ProductStore rassemble les outils essentiels à une gestion de stock lisible. Une interface simple, qui laisse toute la place à votre travail.</p></div>
      <div className="features-grid">{features.map(([icon, title, description], i) => <article className="feature-card" key={icon}><div className="feature-top"><span className="feature-icon"><Icon name={icon} size={25} /></span><span>0{i + 1}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
  );
}
