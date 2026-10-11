import { useEffect } from "react";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import HomePage from "./HomePage";
import CatalogPage from "./CatalogPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

export default function SitePage() {
  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); }, []);
  return (
    <div className="site-page">
      <a className="skip-link" href="#site-content">Aller au contenu</a>
      <SiteHeader />
      <main id="site-content" tabIndex="-1">
        <section id="home" className="hero-section"><HomePage /></section>
        <section id="catalog" className="site-section catalog-section"><CatalogPage /></section>
        <section id="about" className="site-section about-section"><AboutPage /></section>
        <section id="contact" className="site-section contact-section"><ContactPage /></section>
      </main>
      <SiteFooter />
    </div>
  );
}
