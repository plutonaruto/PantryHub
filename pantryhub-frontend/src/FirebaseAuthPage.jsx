import { useAuth } from "./firebase/AuthProvider";
import Profile from "./pages/Profile";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";  
import React, { useEffect, useState } from 'react'; 
import Home from "./pages/Home";

function App() {
  const { user, signup, login } = useAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = () => signup(email, password, {name});
  const handleLogin = () => login(email, password)

  {/*
  // get auth instance
   const authInstance = getAuth(); 

  //store and send token to backend 
  const storeAndSendToken = () => {
    authInstance.currentUser?.getIdToken(true)  // Fetch Firebase ID token
      .then((idToken) => {
        console.log("Token ID sent:", idToken);
        sendTokenToBackend(idToken);  // Send the ID token to the backend
      })
      .catch((error) => {
        console.log("Error in fetching Token ID:", error);
      });
  };


const sendTokenToBackend = async (idToken, endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,  // Send the ID token in the header
        },
        body: JSON.stringify({ someData: "value" }),  // Add any data you want to send
      });

      const result = await response.json();
      console.log("Backend received token:", result);
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  useEffect(() => {
    if (user) {
      storeAndSendToken();
    }
  }, [user]);
*/}

  return user ? (
    <Home />
  ) : (
    <div>
      <h1>PantryHub Sign Up</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default App;
