import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzHICloCes3eY5HFir-r8Qq0ici1OcuiA",
  authDomain: "pantryhub-login-and-flow.firebaseapp.com",
  projectId: "pantryhub-login-and-flow",
  storageBucket: "pantryhub-login-and-flow.appspot.com",
  messagingSenderId: "646676277099",
  appId: "1:646676277099:web:525f0748bb8ea2fc1e8e2e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
