import React from "react";
import { useAuth } from "../firebase/AuthProvider";

const Profile = () => {
  const { user, logout } = useAuth() || {};

  if (!user) return null;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Profile;