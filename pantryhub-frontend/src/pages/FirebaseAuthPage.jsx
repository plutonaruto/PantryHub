import { useAuth } from "../firebase/AuthProvider";
import Profile from "./Profile";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";  
import React, { useEffect, useState } from 'react'; 
import Home from "./Home";
import logo from '../assets/logo.png';
import LeftLogin from '../components/LeftLogin';
import { Link } from 'react-router-dom';
import Login from "./Login";


{/*Register */}

function App() {
  const { user, signup, login } = useAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = () => signup(email, password, {name});
  const handleLogin = () => login(email, password)

  return user ? (
    <Home />
  ) : (
    
  <div className="min-h-screen flex flex-col md:flex-row">
    <div className="w-full md:w-1/2 h-screen">
      <LeftLogin className="w-1/2" />
    </div>
    <div className="w-full md:w-1/2 flex flex-col items-start bg-white rounded-xl shadow-lg p-8 justify-center items-center">
    <h1 className="text-black text-2xl font-bold mb-6">Create your account</h1>
    <input className="rounded-md px-10 py-2 mb-3 border border-gray-300 w-80" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
    <input className="rounded-md px-10 py-2 mb-3 border border-gray-300 w-80" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input className="rounded-md px-10 py-2 mb-3 border border-gray-300 w-80" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button className="text-white font-semibold px-2 py-4 rounded-md bg-[#9C6B98] w-80 mb-2" onClick={handleSignup}>Sign Up</button>
    <h2 className= "text-black text-lg  mb-6"> Already have an account? 
      <Link className="font-bold" to ="/login" > Sign in </Link>  
      </h2>
  </div>
</div>
 
 
  );
}

export default App;
