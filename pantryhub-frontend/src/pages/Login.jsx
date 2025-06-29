import { useAuth } from "../firebase/AuthProvider";
import React, { useState } from 'react'; 
import Home from "./Home";
import LeftLogin from '../components/LeftLogin';
import { Link } from 'react-router-dom';

function Login() {
  const { user, login } = useAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => login(email, password);

  return user ? (
    <Home />
  ) : (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-screen">
        <LeftLogin />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-start bg-white rounded-xl shadow-lg p-8 justify-center items-center">
        <h1 className="text-black text-2xl font-bold mb-6">Welcome Back!</h1>
        <input className="rounded-md px-10 py-2 mb-3 border border-gray-300 w-80" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="rounded-md px-10 py-2 mb-3 border border-gray-300 w-80" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="text-white font-semibold px-2 py-4 rounded-md bg-[#9C6B98] w-80 mb-2" onClick={handleLogin}>Log In</button>
        <h2 className="text-black text-lg  mb-6">Don't have an account?
          <Link className="font-bold" to="/register"> Sign up </Link>
        </h2>
      </div>
    </div>
  );
}

export default Login;
