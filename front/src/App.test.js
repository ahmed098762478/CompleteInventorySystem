import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { initialInventory, money, STORAGE_KEYS } from "./context/AppContext";

const open = (path = "/", authenticated = false) => {
  window.history.replaceState({}, "", path);
  if (authenticated) sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ email: "ahmed@gmail.com" }));
  return render(<App />);
};
const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const inventory = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.inventory));
const stat = (label) => screen.getByText(label).closest(".stat-card");

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.scrollTo = jest.fn();
  HTMLElement.prototype.scrollIntoView = jest.fn();
});
afterEach(() => { jest.restoreAllMocks(); });

test("la vitrine présente la gestion de stock et conserve le thème après rechargement", () => {
  const app = open();
  expect(screen.getByRole("heading", { name: /Votre inventaire.*Enfin sous contrôle/i })).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Passer en mode sombre" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe("dark");
  app.unmount();
  open("/login");
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  userEvent.click(screen.getByRole("button", { name: "Passer en mode clair" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
});

test("la connexion valide les champs et permet de révéler le mot de passe", () => {
  open("/login");
  expect(screen.getByLabelText("Adresse email")).toHaveValue("ahmed@gmail.com");
  expect(screen.getByLabelText("Mot de passe")).toHaveValue("ahmed123");
  userEvent.click(screen.getByRole("button", { name: "Afficher le mot de passe" }));
  expect(screen.getByLabelText("Mot de passe")).toHaveAttribute("type", "text");
  fill("Adresse email", "invalide");
  fill("Mot de passe", "");
  userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
  expect(screen.getByText("Saisissez une adresse email valide.")).toBeInTheDocument();
  expect(screen.getByText("Le mot de passe est requis.")).toBeInTheDocument();
  expect(screen.getByLabelText("Adresse email")).toHaveFocus();
  expect(sessionStorage.getItem(STORAGE_KEYS.session)).toBeNull();
});

test("la connexion retrouve la route protégée, survit au rechargement et se déconnecte", () => {
  const app = open("/admin/products");
  expect(window.location.pathname).toBe("/login");
  userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
  expect(window.location.pathname).toBe("/admin/products");
  expect(screen.getByRole("heading", { name: "Produits", level: 1 })).toBeInTheDocument();
  expect(JSON.parse(sessionStorage.getItem(STORAGE_KEYS.session))).toEqual({ email: "ahmed@gmail.com" });
  app.unmount();
  open("/admin/products");
  userEvent.click(screen.getByRole("button", { name: "Se déconnecter" }));
  expect(window.location.pathname).toBe("/login");
  expect(sessionStorage.getItem(STORAGE_KEYS.session)).toBeNull();
});

test("le tableau de bord calcule les indicateurs et les alertes depuis les produits", () => {
  open("/admin", true);
  expect(stat("Produits référencés")).toHaveTextContent("8");
  expect(stat("Unités en stock")).toHaveTextContent("189");
  expect(stat("Valeur du stock")).toHaveTextContent(money(initialInventory.products.reduce((sum, p) => sum + p.price * p.quantity, 0)));
  expect(stat("Alertes de stock")).toHaveTextContent("3");
  expect(screen.getByRole("img", { name: "5 produits en stock, 2 en stock faible, 1 en rupture" })).toBeInTheDocument();
});

test("un nouveau produit est sauvegardé, visible et conservé au rechargement", () => {
  const app = open("/admin/add-product", true);
  fill("Nom du produit *", "Routeur de test");
  fill("Description", "Routeur Wi-Fi");
  fill("Catégorie *", "computers");
  fill("Prix unitaire (DH) *", "1500");
  fill("Quantité en stock *", "6");
  fill("Seuil d’alerte *", "6");
  userEvent.click(screen.getByRole("button", { name: "Créer le produit" }));
  expect(window.location.pathname).toBe("/admin/products");
  const row = screen.getByText("Routeur de test").closest("tr");
  expect(row).toHaveTextContent("Stock faible");
  expect(row).toHaveTextContent(money(1500));
  expect(screen.getByText("Le produit a été ajouté à votre inventaire.")).toBeInTheDocument();
  expect(inventory().products).toHaveLength(9);
  app.unmount();
  open("/admin");
  expect(stat("Unités en stock")).toHaveTextContent("195");
  expect(stat("Alertes de stock")).toHaveTextContent("4");
});

test("le formulaire refuse les champs vides et les quantités négatives ou décimales", () => {
  open("/admin/add-product", true);
  fill("Nom du produit *", "  ");
  fill("Catégorie *", "");
  fill("Prix unitaire (DH) *", "-1");
  fill("Quantité en stock *", "1.5");
  fill("Seuil d’alerte *", "-2");
  userEvent.click(screen.getByRole("button", { name: "Créer le produit" }));
  expect(screen.getByText("Le nom du produit est requis.")).toBeInTheDocument();
  expect(screen.getByText("Sélectionnez une catégorie.")).toBeInTheDocument();
  expect(screen.getByText("Saisissez un prix positif ou nul.")).toBeInTheDocument();
  expect(screen.getAllByText("Saisissez un nombre entier positif ou nul.")).toHaveLength(2);
  expect(screen.getByLabelText("Nom du produit *")).toHaveFocus();
  expect(inventory().products).toHaveLength(8);
  fill("Nom du produit *", "Produit");
  fill("Prix unitaire (DH) *", "");
  fill("Quantité en stock *", "");
  fill("Seuil d’alerte *", "");
  userEvent.click(screen.getByRole("button", { name: "Créer le produit" }));
  expect(screen.getByText("Saisissez un prix positif ou nul.")).toBeInTheDocument();
  expect(screen.getAllByText("Saisissez un nombre entier positif ou nul.")).toHaveLength(2);
});

test("la modification actualise le statut, la quantité et la valeur sans dupliquer le produit", () => {
  const app = open("/admin/products/p5/edit", true);
  fill("Prix unitaire (DH) *", "100");
  fill("Quantité en stock *", "10");
  userEvent.click(screen.getByRole("button", { name: "Enregistrer les modifications" }));
  const row = screen.getByText("Casque Sony WH-1000XM5").closest("tr");
  expect(row).toHaveTextContent("En stock");
  expect(inventory().products).toHaveLength(8);
  app.unmount();
  open("/admin");
  expect(stat("Alertes de stock")).toHaveTextContent("2");
  expect(stat("Unités en stock")).toHaveTextContent("199");
  expect(stat("Valeur du stock")).toHaveTextContent(money(initialInventory.products.reduce((sum, p) => sum + p.price * p.quantity, 0) + 1000));
});

test("la recherche ignore les accents et les filtres se combinent et se réinitialisent", () => {
  open("/admin/products", true);
  fill("Rechercher un produit", "ecran");
  expect(screen.getByText("Écran Dell 24 pouces")).toBeInTheDocument();
  expect(screen.queryByText("MacBook Air M2")).not.toBeInTheDocument();
  fill("Filtrer par catégorie", "audio");
  expect(screen.getByText("Aucun produit trouvé")).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Réinitialiser les filtres" }));
  fill("Filtrer par catégorie", "computers");
  fill("Filtrer par statut", "low");
  expect(screen.getByText("Écran Dell 24 pouces")).toBeInTheDocument();
  expect(screen.queryByText("MacBook Air M2")).not.toBeInTheDocument();
  fill("Filtrer par catégorie", "");
  fill("Filtrer par statut", "out");
  expect(screen.getByText("Casque Sony WH-1000XM5")).toBeInTheDocument();
  expect(screen.queryByText("Écran Dell 24 pouces")).not.toBeInTheDocument();
});

test("une catégorie peut être créée et renommée sans perdre ses produits", () => {
  const app = open("/admin/categories", true);
  fill("Nom de la catégorie *", "Réseau");
  userEvent.click(screen.getByRole("button", { name: "Créer la catégorie" }));
  expect(screen.getByRole("heading", { name: "Réseau" })).toBeInTheDocument();
  fill("Nom de la catégorie *", "réseau");
  userEvent.click(screen.getByRole("button", { name: "Créer la catégorie" }));
  expect(screen.getByText("Cette catégorie existe déjà.")).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Renommer Informatique" }));
  fill("Nom de la catégorie *", "Ordinateurs");
  userEvent.click(screen.getByRole("button", { name: "Enregistrer le nom" }));
  const category = inventory().categories.find((c) => c.id === "computers");
  expect(category.name).toBe("Ordinateurs");
  expect(inventory().products.filter((p) => p.categoryId === category.id)).toHaveLength(2);
  app.unmount();
  open("/admin/products");
  fill("Filtrer par catégorie", "computers");
  expect(screen.getAllByText("Ordinateurs").length).toBeGreaterThan(1);
  expect(screen.getByText("MacBook Air M2")).toBeInTheDocument();
});

test("le menu mobile peut être ouvert, parcouru et fermé au clavier", () => {
  open("/admin", true);
  const trigger = screen.getByRole("button", { name: "Ouvrir le menu" });
  userEvent.click(trigger);
  const drawer = screen.getByRole("dialog", { name: "Navigation" });
  expect(within(drawer).getByRole("link", { name: /Produits/ })).toBeInTheDocument();
  expect(within(drawer).getByRole("button", { name: "Fermer le menu" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(within(drawer).getByRole("link", { name: "Retour au site" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Tab" });
  expect(within(drawer).getByRole("button", { name: "Fermer le menu" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  userEvent.click(trigger);
  userEvent.click(within(screen.getByRole("dialog")).getByRole("link", { name: /Catégories/ }));
  expect(screen.getByRole("heading", { name: "Catégories", level: 1 })).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("les inventaires vides et les références introuvables ont un état dédié", () => {
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify({ categories: [], products: [] }));
  const app = open("/admin/products", true);
  expect(screen.getByText("Aucun produit pour le moment")).toBeInTheDocument();
  app.unmount();
  const form = open("/admin/products/inconnu/edit");
  expect(screen.getByText("Produit introuvable")).toBeInTheDocument();
  form.unmount();
  open("/admin");
  expect(stat("Produits référencés")).toHaveTextContent("0");
  expect(screen.getByText("Votre inventaire commence ici")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "0 produits en stock, 0 en stock faible, 0 en rupture" })).toHaveClass("is-empty");
  expect(inventory().products).toEqual([]);
});

test("un stockage corrompu est remplacé par une démo valide avec une explication", () => {
  localStorage.setItem(STORAGE_KEYS.inventory, "{invalide");
  open("/admin", true);
  expect(screen.getByText(/stockage local est indisponible ou illisible/)).toBeInTheDocument();
  expect(stat("Produits référencés")).toHaveTextContent("8");
  expect(inventory().products).toHaveLength(8);
});

test("une erreur de stockage conserve une démo utilisable en mémoire", () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
  open("/admin/add-product");
  // sessionStorage is unavailable as well; log in to keep using the in-memory session.
  userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
  fill("Nom du produit *", "Produit en mémoire");
  fill("Prix unitaire (DH) *", "0");
  fill("Quantité en stock *", "0");
  userEvent.click(screen.getByRole("button", { name: "Créer le produit" }));
  expect(screen.getByText("Produit en mémoire")).toBeInTheDocument();
  expect(screen.getByText(/Vos modifications restent utilisables pendant cette visite/)).toBeInTheDocument();
});
