import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useInventory } from "../../context/AppContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Icon from "../ui/Icon";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { warning, notice, dismissNotice } = useInventory();
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };
  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    drawerRef.current?.querySelector("button, a")?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); }
      if (event.key === "Tab") {
        const nodes = drawerRef.current?.querySelectorAll("a, button");
        if (!nodes?.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", handleKey); };
  }, [menuOpen]);
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <div className="desktop-sidebar"><Sidebar /></div>
      {menuOpen && <div className="mobile-drawer-layer">
        <div className="drawer-backdrop" onClick={closeMenu} />
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation" ref={drawerRef}>
          <button type="button" className="icon-button drawer-close" onClick={closeMenu} aria-label="Fermer le menu"><Icon name="close" /></button>
          <Sidebar onNavigate={closeMenu} />
        </div>
      </div>}
      <div className="admin-workspace">
        <Header onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} menuButtonRef={menuButtonRef} />
        <main id="main-content" className="admin-main" tabIndex="-1">
          {warning && <div className="banner banner-warning" role="status"><Icon name="alert" /><span>{warning}</span></div>}
          {notice && <div className="banner banner-success" role="status"><Icon name="check" /><span>{notice}</span><button className="icon-button" onClick={dismissNotice} aria-label="Fermer la confirmation"><Icon name="close" size={16} /></button></div>}
          <Outlet />
          <footer className="admin-footer"><span>© {new Date().getFullYear()} ProductStore</span><span>Espace de démonstration · Données locales</span></footer>
        </main>
      </div>
    </div>
  );
}
