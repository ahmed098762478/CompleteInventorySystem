import { Link } from "react-router-dom";
import { Brand } from "../ui/UI";
import Icon from "../ui/Icon";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-top"><div><a href="#home"><Brand inverse /></a><p>Un inventaire organisé.<br />Des décisions plus simples.</p></div><div className="footer-links"><span>LA SOLUTION</span><a href="#catalog">Aperçu de l’inventaire</a><a href="#about">Fonctionnalités</a><a href="#contact">Contact</a></div><div className="footer-access"><span>VOTRE PROCHAIN PAS</span><p>Découvrez votre espace de gestion.</p><Link to="/login" className="button button-primary">Accéder à la démo<Icon name="arrow" size={16} /></Link></div></div>
        <div className="site-footer-bottom"><span>© {new Date().getFullYear()} ProductStore. Tous droits réservés.</span><span>Gestion de stock · Maroc</span></div>
      </div>
    </footer>
  );
}
