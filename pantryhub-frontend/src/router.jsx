import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import MarketplaceItemPage from "./pages/MarketplaceItemPage";
import FirebaseAuthPage from "./FirebaseAuthPage";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/inventory", element: <Inventory /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/marketplace/:id", element: <MarketplaceItemPage /> },
  //{ path: "*", element: <Home /> }, // fallback
  { path: "/register", element: <FirebaseAuthPage /> },
  { path: "/profile", element: <Profile /> }
]);

