import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(() => getAuth().currentUser); 

  useEffect(() => { //get auth runs once in the beginning
    const auth = getAuth();
    // gets firebase auth state and sets user
    // if user is logged in, it will set user to firebaseUser
    // if user is not logged in/undefined, it will set user to null
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        firebaseUser.getIdToken().then(token => {
          console.log(token);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return null; 
  if (!user) return <Navigate to="/register" />;
  return children;
}