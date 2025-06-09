// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzHICloCes3eY5HFir-r8Qq0ici1OcuiA",
  authDomain: "pantryhub-login-and-flow.firebaseapp.com",
  projectId: "pantryhub-login-and-flow",
  storageBucket: "pantryhub-login-and-flow.firebasestorage.app",
  messagingSenderId: "646676277099",
  appId: "1:646676277099:web:525f0748bb8ea2fc1e8e2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to Firebase Emulators for local development
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
