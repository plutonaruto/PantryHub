// src/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser({ ...firebaseUser, ...userDoc.data() });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signup = (email, password, userData) =>
    createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const { uid } = userCredential.user;
      await setDoc(doc(db, "users", uid), userData);
    });

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
};