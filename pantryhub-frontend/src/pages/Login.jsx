import { useAuth } from "../firebase/AuthProvider";
import React, { useState } from 'react'; 
import Inventory from "./Inventory";
import LeftLogin from '../components/LeftLogin';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function Login() {
  const { user, login } = useAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const auth = getAuth();

  const handleLogin = () => login(email, password);

  function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch((error) => {
      alert("Error sending password reset email:" + error.message);
    });
  }

  return user ? (
    <Inventory />
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
        <h2 className=" text-black text-lg  mb-6  ">Don't have an account?
          <Link className="font-bold" to="/register"> Sign up </Link>
          <span className="flex flex-col font-bold items-center"
          onClick =  {() => setShowReset(true)}> 
          Forgot password? </span>
          


        </h2>
      </div>

       {showReset && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <button
              className="absolute top-2 right-2 text-gray hover:text-black text-xl"
              onClick={() => setShowReset(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="rounded-md px-4 py-2 border border-gray w-full mb-4"
            />
            <button
              className="bg-[#9C6B98] text-white px-4 py-2 rounded w-full hover:bg-gray-500"
              onClick={() => resetPassword(resetEmail)}
            >
              Send Reset Email
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;
