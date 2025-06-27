import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import MarketplaceItemPage from "./pages/MarketplaceItemPage";
import Recipe from "./pages/Recipe";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/inventory", element: <Inventory /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/marketplace/:id", element: <MarketplaceItemPage /> },
  { path: "/recipes", element: <Recipe />},
  { path: "*", element: <Home /> }, // fallback
]);

