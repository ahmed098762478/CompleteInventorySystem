import { useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { Brand, Field, ThemeToggle } from "../ui/UI";
import Icon from "../ui/Icon";

export default function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("ahmed@gmail.com");
  const [password, setPassword] = useState("ahmed123");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const from = location.state?.from;
  const destination = typeof from === "string" && (from === "/admin" || from.startsWith("/admin/")) ? from : "/admin";
  if (user) return <Navigate to={destination} replace />;
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!email.trim()) next.email = "L’adresse email est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Saisissez une adresse email valide.";
    if (!password.trim()) next.password = "Le mot de passe est requis.";
    setErrors(next);
    if (Object.keys(next).length) { formRef.current?.querySelector(`#login-${Object.keys(next)[0]}`)?.focus(); return; }
    login(email);
    navigate(destination, { replace: true });
  };
  return (
    <div className="login-page">
      <aside className="login-story">
        <Link to="/" className="login-brand"><Brand inverse subtitle="GESTION DE STOCK" /></Link>
        <div className="login-story-content">
          <span className="story-label"><span className="status-dot" />Un stock maîtrisé, chaque jour.</span>
          <h1>Moins de complexité.<br /><span>Plus de visibilité.</span></h1>
          <p>Retrouvez vos produits, suivez les quantités et anticipez vos besoins depuis un seul espace.</p>
          <div className="login-visual" aria-hidden="true"><div className="visual-top"><span className="visual-icon"><Icon name="box" size={24} /></span><span>Votre inventaire<strong>Sous contrôle.</strong></span><span className="visual-check"><Icon name="check" size={18} /></span></div><div className="visual-chart">{[40, 64, 48, 82, 62, 94, 76, 100, 88].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div><div className="visual-bottom"><span><i />Vue d’ensemble du stock</span><Icon name="chart" size={18} /></div></div>
          <div className="login-benefits"><span><Icon name="check" size={16} />Produits & catégories</span><span><Icon name="check" size={16} />Alertes de stock</span></div>
        </div>
        <p className="login-story-footer">L’essentiel pour mieux gérer votre inventaire.</p>
        <div className="story-decoration" aria-hidden="true" />
      </aside>
      <main className="login-main">
        <div className="login-topbar"><Link to="/" className="back-link"><Icon name="back" size={16} />Retour au site</Link><ThemeToggle /></div>
        <div className="login-form-wrap">
          <div className="login-mobile-brand"><Brand /></div>
          <span className="login-lock"><Icon name="lock" size={25} /></span>
          <p className="eyebrow">VOTRE ESPACE DE GESTION</p><h2>Heureux de vous retrouver.</h2><p className="login-subtitle">Connectez-vous pour retrouver votre inventaire.</p>
          <form onSubmit={submit} noValidate ref={formRef} className="login-form">
            <Field id="login-email" label="Adresse email" error={errors.email}><div className="input-with-icon"><Icon name="mail" size={18} /><input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((previous) => ({ ...previous, email: "" })); }} className={`input ${errors.email ? "input-invalid" : ""}`} placeholder="vous@entreprise.ma" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} /></div></Field>
            <Field id="login-password" label="Mot de passe" error={errors.password}><div className="input-with-icon password-input"><Icon name="lock" size={18} /><input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((previous) => ({ ...previous, password: "" })); }} className={`input ${errors.password ? "input-invalid" : ""}`} required aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} /><button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword}><Icon name={showPassword ? "eyeOff" : "eye"} size={19} /></button></div></Field>
            <button type="submit" className="button button-primary login-submit">Se connecter<Icon name="arrow" size={18} /></button>
          </form>
          <div className="login-demo-info"><Icon name="info" size={19} /><div><strong>Découvrez la démonstration</strong><p>Les champs sont préremplis. Vous pouvez aussi utiliser votre propre email et un mot de passe de votre choix.</p></div></div>
          <p className="login-local-note">Votre inventaire de démonstration est conservé dans ce navigateur.</p>
        </div>
        <footer className="login-footer">© {new Date().getFullYear()} ProductStore · Gestion de stock</footer>
      </main>
    </div>
  );
}
