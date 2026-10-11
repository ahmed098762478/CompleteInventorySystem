import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppProviders, useAuth } from "./context/AppContext";
import SitePage from "./components/site/pages/SitePage";
import LoginPage from "./components/Auth/LoginPage";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard";
import ProductTable from "./components/Product/ProductTable";
import AddProduct from "./components/Product/AddProduct";
import CategoryTable from "./components/Category/CategoryTable";
import { EmptyState } from "./components/ui/UI";

function RequireSession({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SitePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<RequireSession><Layout /></RequireSession>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductTable />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<AddProduct />} />
            <Route path="categories" element={<CategoryTable />} />
            <Route path="*" element={<EmptyState title="Page introuvable" description="Cet écran n’existe pas." to="/admin" action="Retour au tableau de bord" />} />
          </Route>
          <Route path="*" element={<div className="standalone-empty"><EmptyState title="Page introuvable" description="Retrouvez la présentation de ProductStore." to="/" action="Retour à l’accueil" /></div>} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
