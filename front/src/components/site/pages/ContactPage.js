import { useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "../../ui/UI";
import Icon from "../../ui/Icon";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const prepareEmail = (event) => {
    event.preventDefault();
    const body = `Nom : ${name}\nEmail : ${email}\n\n${message}`;
    window.location.href = `mailto:contact@productstore.com?subject=${encodeURIComponent("Contact ProductStore")}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div className="site-container">
      <div className="contact-grid">
        <div className="contact-copy"><p className="eyebrow">PARLONS DE VOTRE INVENTAIRE</p><h2>Une question ?<br />Faisons le point.</h2><p>Découvrez l’espace de démonstration ou préparez un message pour nous présenter votre besoin.</p><a className="contact-email" href="mailto:contact@productstore.com"><span className="feature-icon"><Icon name="mail" /></span><span><small>CONTACT EMAIL</small>contact@productstore.com</span><Icon name="arrow" size={18} /></a><div className="contact-demo"><Icon name="dashboard" size={24} /><div><h3>Envie de voir comment ça fonctionne ?</h3><p>Votre espace de démonstration est prêt.</p><Link className="text-link" to="/login">Ouvrir la démonstration<Icon name="arrow" size={16} /></Link></div></div></div>
        <form onSubmit={prepareEmail} className="panel contact-form"><h3>Préparer un message</h3><div className="form-grid"><Field id="contact-name" label="Votre nom"><input id="contact-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Votre nom" required /></Field><Field id="contact-email" label="Votre email"><input id="contact-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="vous@entreprise.ma" required /></Field></div><Field id="contact-message" label="Votre message"><textarea id="contact-message" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Comment pouvons-nous vous aider ?" required /></Field><button type="submit" className="button button-primary">Ouvrir ma messagerie<Icon name="arrow" size={17} /></button><p className="field-hint">Le message s’ouvre dans votre application email pour que vous puissiez l’envoyer.</p></form>
      </div>
    </div>
  );
}
