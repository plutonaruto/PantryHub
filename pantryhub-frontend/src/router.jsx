import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import MarketplaceItemPage from "./pages/MarketplaceItemPage";
import FirebaseAuthPage from "./pages/FirebaseAuthPage";
import Profile from "./pages/Profile";
import ProtectedRoute from './ProtectedRoute';
import Login from "./pages/Login";
import ItemPage from './pages/ItemPage';
import Equipment from "./pages/Equipment";

export const router = createBrowserRouter([
  { path: "/", element: <ProtectedRoute> <Home /> </ProtectedRoute>} ,
  { path: "/inventory", element: <ProtectedRoute> <Inventory /> </ProtectedRoute> },
  { path: "/marketplace", element: <ProtectedRoute> <Marketplace /> </ProtectedRoute> },
  { path: "/marketplace/:id", element: <ProtectedRoute> <MarketplaceItemPage /> </ProtectedRoute>},
  { path: "/items/:id", element: <ProtectedRoute> <ItemPage /> </ProtectedRoute>},
  { path: "*", element: <Home /> }, // fallback
  { path: "/register", element: <FirebaseAuthPage /> },
  { path:"/login", element: <Login /> },
  { path: "/profile", element: <ProtectedRoute> <Profile /> </ProtectedRoute>},
  { path: "/equipment", element: <ProtectedRoute> <Equipment /> </ProtectedRoute> }
]);

