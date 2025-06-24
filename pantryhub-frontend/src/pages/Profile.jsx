import React from "react";
import { useAuth } from "../firebase/AuthProvider";
import Sidebar from "../components/Sidebar";
import profileicon from "../assets/profileicon.png"; 
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async() => {
    await logout();
    navigate("/login");
  }

  return (
     <div className = "flex flex-row min-h screen ">
      <div className="w-64 bg-primary text-white flex flex-col p-2 flex-shrink-0">
      <Sidebar />
      </div>
      <div className= "flex flex-1 items-center text-center justify-center"> 
      <div className= "bg-[#9C6B98] py-10 px-12 w-[600px] rounded-xl shadow-md shadow-lg center">

        <img src={profileicon} 
        alt="profile" 
        className="h-48 w-48 mx-auto object-contain bg-white rounded-full"/> 
        <p className="pt-6 text-white text-3xl"><strong>{user.name}</strong> </p>
        <p className=" text-white text-lg"><strong>Email: </strong> {user.email}</p>
        <button className = "text-white font-semibold border border-white rounded-lg px-6 py-2 mt-16 hover:bg-white hover:text-[#9C6B98] hover:border-[#9C6B98]" onClick={handleLogout}>Log Out</button>

      </div>
     </div>

    </div>

    

    
  );
};

export default Profile;


    