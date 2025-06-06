// src/Profile.js
import React from "react";
import { useAuth } from "./AuthProvider";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Profile;