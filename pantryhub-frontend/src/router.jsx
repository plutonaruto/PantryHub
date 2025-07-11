import { createBrowserRouter } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import MarketplaceItemPage from "./pages/MarketplaceItemPage";
import Recipe from "./pages/Recipe";
import RecipeGenerator from "./pages/RecipeGenerator";
import Profile from "./pages/Profile";
import ProtectedRoute from './ProtectedRoute';
import Login from "./pages/Login";
import ItemPage from './pages/ItemPage';
import FirebaseAuthPage from './pages/FirebaseAuthPage';
import Equipment from "./pages/Equipment";
import EquipmentPage from "./pages/EquipmentPage";
import EquipmentLog from "./pages/EquipmentLog";
import Notifications from "./pages/Notifications";

export const router = createBrowserRouter([
  { path: "/", element: <ProtectedRoute> <Inventory /> </ProtectedRoute>} ,
  { path: "/inventory", element: <ProtectedRoute> <Inventory /> </ProtectedRoute> },
  { path: "/marketplace", element: <ProtectedRoute> <Marketplace /> </ProtectedRoute> },
  { path: "/marketplace/:id", element: <ProtectedRoute> <MarketplaceItemPage /> </ProtectedRoute>},
  { path: "/items/:id", element: <ProtectedRoute> <ItemPage /> </ProtectedRoute>},
  { path: "/recipes", element: <ProtectedRoute> <Recipe /> </ProtectedRoute>},
  { path: "/recipes/generate", element: <ProtectedRoute> <RecipeGenerator /> </ProtectedRoute>},
  { path: "*", element: <ProtectedRoute> <Inventory /> </ProtectedRoute>}, // fallback
  { path: "/register", element: <FirebaseAuthPage /> },
  { path:"/login", element: <Login /> },
  { path: "/profile", element: <ProtectedRoute> <Profile /> </ProtectedRoute>},
  { path: "/equipment", element: <ProtectedRoute> <Equipment /> </ProtectedRoute> },
  { path : "/equipment/:id", element: <ProtectedRoute> <EquipmentPage /> </ProtectedRoute> },
  { path: "/equipment/log", element: <ProtectedRoute> <EquipmentLog /> </ProtectedRoute> },
  { path: "/notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> }
]);

