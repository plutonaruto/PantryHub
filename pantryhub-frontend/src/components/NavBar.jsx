import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const NavBar = () => {
  return (
    <div className="bg-primary shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="PantryHub Logo" className="h-12 w-12 object-contain max-w-[80px]" />
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/inventory" className="nav-link">
              Inventory
            </Link>
            <Link to="/marketplace" className="nav-link">
              Marketplace
            </Link>
            <Link to="/equipment" className="nav-link">
              Equipment
            </Link>
            <Link to ="/recipes" className="nav-link">
              Recipes
            </Link>
            <Link to ="/notifications" className="nav-link">
              Notifications
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;