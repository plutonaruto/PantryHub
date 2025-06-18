import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import MarketplaceItemPage from "./pages/MarketplaceItemPage";
import FirebaseAuthPage from "./FirebaseAuthPage";
import Profile from "./pages/Profile";
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: "/", element: <ProtectedRoute> <Home /> </ProtectedRoute>} ,
  { path: "/inventory", element: <ProtectedRoute> <Inventory /> </ProtectedRoute> },
  { path: "/marketplace", element: <ProtectedRoute> <Marketplace /> </ProtectedRoute> },
  { path: "/marketplace/:id", element: <ProtectedRoute> <MarketplaceItemPage /> </ProtectedRoute>},
  //{ path: "*", element: <Home /> }, // fallback
  { path: "/register", element: <FirebaseAuthPage /> },
  { path: "/profile", element: <ProtectedRoute> <Profile /> </ProtectedRoute>}
]);

