import { createContext, useContext, useEffect, useState } from "react";

export const STORAGE_KEYS = { inventory: "productstore.inventory.v1", theme: "productstore.theme", session: "productstore.session" };
export const initialInventory = {
  categories: [
    { id: "computers", name: "Informatique" }, { id: "accessories", name: "Accessoires" },
    { id: "office", name: "Bureautique" }, { id: "audio", name: "Audio" },
  ],
  products: [
    { id: "p1", name: "MacBook Air M2", description: "Ordinateur portable · 13 pouces · 256 Go", categoryId: "computers", price: 11900, quantity: 18, threshold: 5 },
    { id: "p2", name: "Clavier Logitech MX Keys", description: "Clavier sans fil · AZERTY", categoryId: "accessories", price: 1090, quantity: 42, threshold: 10 },
    { id: "p3", name: "Écran Dell 24 pouces", description: "Moniteur Full HD · USB-C", categoryId: "computers", price: 2190, quantity: 4, threshold: 5 },
    { id: "p4", name: "Souris Logitech MX Master", description: "Souris ergonomique · Bluetooth", categoryId: "accessories", price: 890, quantity: 36, threshold: 8 },
    { id: "p5", name: "Casque Sony WH-1000XM5", description: "Casque audio · Réduction de bruit", categoryId: "audio", price: 3490, quantity: 0, threshold: 5 },
    { id: "p6", name: "Imprimante HP LaserJet", description: "Imprimante laser · Wi-Fi", categoryId: "office", price: 2790, quantity: 3, threshold: 5 },
    { id: "p7", name: "Hub USB-C 7 en 1", description: "Adaptateur multiport · HDMI · USB 3.0", categoryId: "accessories", price: 450, quantity: 64, threshold: 15 },
    { id: "p8", name: "Enceinte JBL Flip 6", description: "Enceinte portable · Bluetooth", categoryId: "audio", price: 1290, quantity: 22, threshold: 5 },
  ],
};
export const money = (value) => `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 2 }).format(value)} DH`;
export const stockStatus = (p) => p.quantity === 0 ? "out" : p.quantity <= p.threshold ? "low" : "available";
export const statusLabels = { available: "En stock", low: "Stock faible", out: "Rupture" };

function validInventory(data) {
  return data && Array.isArray(data.categories) && Array.isArray(data.products)
    && data.categories.every((c) => typeof c.id === "string" && typeof c.name === "string" && c.name.trim())
    && new Set(data.categories.map((c) => c.id)).size === data.categories.length
    && data.products.every((p) => typeof p.id === "string" && typeof p.name === "string" && p.name.trim()
      && typeof p.description === "string" && data.categories.some((c) => c.id === p.categoryId)
      && Number.isFinite(p.price) && p.price >= 0 && Number.isInteger(p.quantity) && p.quantity >= 0
      && Number.isInteger(p.threshold) && p.threshold >= 0)
    && new Set(data.products.map((p) => p.id)).size === data.products.length;
}
function readInventory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.inventory);
    if (!stored) return { data: initialInventory, warning: "" };
    const data = JSON.parse(stored);
    if (validInventory(data)) return { data, warning: "" };
    return { data: initialInventory, warning: "Les données locales sont illisibles. Un inventaire de démonstration a été chargé." };
  } catch {
    return { data: initialInventory, warning: "Le stockage local est indisponible ou illisible. Un inventaire de démonstration a été chargé." };
  }
}
const ThemeContext = createContext(null);
const AuthContext = createContext(null);
const InventoryContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);
export const useInventory = () => useContext(InventoryContext);

export function AppProviders({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEYS.theme) === "dark" ? "dark" : "light"; } catch { return "light"; }
  });
  const [user, setUser] = useState(() => {
    try {
      const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.session));
      return session && typeof session.email === "string" && session.email.trim() ? session : null;
    } catch { return null; }
  });
  const [loaded] = useState(readInventory);
  const [inventory, setInventory] = useState(loaded.data);
  const [warning, setWarning] = useState(loaded.warning);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem(STORAGE_KEYS.theme, theme); } catch { /* Theme remains usable in memory. */ }
  }, [theme]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory)); }
    catch { setWarning("Le stockage local est indisponible. Vos modifications restent utilisables pendant cette visite, mais ne seront pas conservées."); }
  }, [inventory]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const login = (email) => {
    const session = { email: email.trim() };
    setUser(session);
    try { sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session)); } catch { /* In-memory demo session. */ }
  };
  const logout = () => {
    setUser(null);
    setNotice("");
    try { sessionStorage.removeItem(STORAGE_KEYS.session); } catch { /* In-memory session is cleared. */ }
  };
  const makeId = (prefix) => `${prefix}-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  const saveProduct = (values, id) => {
    const product = { ...values, id: id || makeId("p") };
    setInventory((previous) => ({ ...previous, products: id ? previous.products.map((p) => p.id === id ? product : p) : [...previous.products, product] }));
    setNotice(id ? "Le produit a été mis à jour." : "Le produit a été ajouté à votre inventaire.");
  };
  const saveCategory = (name, id) => {
    const cleanName = name.trim();
    if (!cleanName) return "Le nom de la catégorie est requis.";
    if (inventory.categories.some((c) => c.id !== id && c.name.toLocaleLowerCase("fr") === cleanName.toLocaleLowerCase("fr"))) return "Cette catégorie existe déjà.";
    const category = { id: id || makeId("c"), name: cleanName };
    setInventory((previous) => ({ ...previous, categories: id ? previous.categories.map((c) => c.id === id ? category : c) : [...previous.categories, category] }));
    setNotice(id ? "La catégorie a été renommée." : "La catégorie a été créée.");
    return "";
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((current) => current === "light" ? "dark" : "light") }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <InventoryContext.Provider value={{ ...inventory, saveProduct, saveCategory, warning, notice, dismissNotice: () => setNotice("") }}>
          {children}
        </InventoryContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
