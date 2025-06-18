import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) { // not logged in, redirect to register
    return <Navigate to="/register" />;
  }
  return children;  
}