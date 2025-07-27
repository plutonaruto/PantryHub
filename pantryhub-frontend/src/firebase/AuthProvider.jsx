import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // holds full user info
  const [isAdmin, setIsAdmin] = useState(false);  // additional flag for admin role

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();
        const mergedUser = { ...firebaseUser, ...userData, displayName: firebaseUser.displayName };
        setUser(mergedUser);
        setIsAdmin(userData?.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signup = (email, password, userData) =>
    createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const { uid } = userCredential.user;
      if (userData.name) {
        await updateProfile(userCredential.user, { displayName: userData.name });
      }
      console.log("signup button clicked");
      await setDoc(doc(db, "users", uid), { ...userData, role: "user" });
    });

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
