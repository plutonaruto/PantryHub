// src/App.js
import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import Profile from "./Profile";

function App() {
  const { user, signup, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const handleSignup = () => signup(email, password, { age, gender, address });
  const handleLogin = () => login(email, password);

  return user ? (
    <Profile />
  ) : (
    <div>
      <h1>Firebase Emulator Demo</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
      <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default App;