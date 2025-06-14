import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getToken } from 'firebase/app-check';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import React, { useEffect, useState } from 'react'; 


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
export const db = getFirestore(app);
export const auth = getAuth(app);

// Connect to Firebase Emulators for local development
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

{/*
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Lc8N10rAAAAAOZe38WePRvlahRuL37i8wrICu52'), // Replace with your ReCAPTCHA key
  isTokenAutoRefreshEnabled: true,  // Automatically refresh token when expired
});


const requestAppCheckToken = async () => {
  try {
    // Retrieve Firebase App Check token
    const appCheckToken = await getToken(appCheck);

    if (appCheckToken) {
      console.log("App Check Token:", appCheckToken);

      // Send the App Check token to your backend
      await sendTokenToBackend(appCheckToken);
    }
  } catch (error) {
    console.error("Error getting App Check token:", error);
  }

  useEffect(() => {
  requestAppCheckToken();}, []);
};

export { appCheck };


const sendTokenToBackend = async (appCheckToken, formData) => {
  try {
    const response = await fetch("http://localhost:5000/marketplace", {
      method: "POST", // POST request to create marketplace item
      headers: {
        "X-Firebase-AppCheck": appCheckToken,  // Send the App Check token in the header
      },
      body: formData,  // Use form data as the request body (instead of JSON)
    });

    const result = await response.json();
    console.log("Backend received token:", result);
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};

const fetchData = async (appCheckToken, endpoint) => {
  try {
    const response = await fetch(`http://localhost:5000/${endpoint}`, {
      method: "GET",
      headers: {
        "X-Firebase-AppCheck": appCheckToken,  // Send the token in the header
      },
    });

    const result = await response.json();
    console.log("Data from Backend:", result);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const deleteItem = async (appCheckToken, itemId, endpoint) => {
  try {
    const response = await fetch(`http://localhost:5000/${endpoint}/${itemId}`, {
      method: "DELETE",
      headers: {
        "X-Firebase-AppCheck": appCheckToken,  // Send the token in the header
      },
    });

    const result = await response.json();
    console.log("Item deleted:", result);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

const updateItem = async (appCheckToken, itemId, updatedData, endpoint) => {
  try {
    const response = await fetch(`http://localhost:5000/${endpoint}/${itemId}`, {
      method: "PATCH",
      headers: {
        "X-Firebase-AppCheck": appCheckToken,  // Send the token in the header
        "Content-Type": "application/json",  // Sending JSON data
      },
      body: JSON.stringify(updatedData),  // Send the updated item data
    });

    const result = await response.json();
    console.log("Item updated:", result);
  } catch (error) {
    console.error("Error updating item:", error);
  }
};



*/}

