import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(); // share auth state w/ app (user, signup, login)

export const useAuth = () => useContext(AuthContext); //accesss authcontext (user, signup, login, logout) abt curr user

export const AuthProvider = ({ children }) => { //authprovider provides auth context to app--> wrap inside authcontext
  const [user, setUser] = useState(null); //holds users curr info--> initally null cuz no one logged in

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
      if (userData.name) {
        await updateProfile(userCredential.user, { displayName: userData.name });
      }
      console.log("signup button clicked");
      await setDoc(doc(db, "users", uid), userData);
    });

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
};