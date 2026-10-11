import { Link } from "react-router-dom";
import { statusLabels, stockStatus, useTheme } from "../../context/AppContext";
import logo from "../../assets/logo.png";
import Icon from "./Icon";

export function Brand({ subtitle, inverse = false }) {
  return <span className={`brand ${inverse ? "brand-inverse" : ""}`}><span className="brand-wordmark"><img className="brand-logo" src={logo} alt="ProductStore" />{subtitle && <small>{subtitle}</small>}</span></span>;
}
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" className="icon-button theme-toggle" onClick={toggleTheme} title={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"} aria-label={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}><Icon name={theme === "light" ? "moon" : "sun"} /></button>;
}
export function StockBadge({ product }) {
  const status = stockStatus(product);
  return <span className={`badge badge-${status}`}><span className="status-dot" />{statusLabels[status]}</span>;
}
export function ProductMark({ categoryId, small = false }) {
  const icons = { computers: "monitor", accessories: "mouse", office: "printer", audio: "headphones" };
  return <span className={`product-mark ${small ? "product-mark-small" : ""} mark-${categoryId in icons ? categoryId : "other"}`}><Icon name={icons[categoryId] || "box"} size={small ? 19 : 25} /></span>;
}
export function PageHeading({ eyebrow, title, description, children }) {
  return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{children && <div className="page-actions">{children}</div>}</div>;
}
export function EmptyState({ title, description, to, action, children }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name="box" size={30} /></span><h2>{title}</h2><p>{description}</p>{to && <Link className="button button-primary" to={to}>{action}<Icon name="arrow" size={17} /></Link>}{children}</div>;
}
export function Field({ id, label, error, hint, children, className = "" }) {
  return <div className={`field ${className}`}><label htmlFor={id}>{label}</label>{children}{error ? <p id={`${id}-error`} className="field-error" role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className="field-hint">{hint}</p> : null}</div>;
}
export function StatCard({ label, value, caption, icon, tone = "teal" }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon tone-${tone}`}><Icon name={icon} /></span></div><p className="stat-value">{value}</p><p className="stat-caption">{caption}</p></div>;
}
