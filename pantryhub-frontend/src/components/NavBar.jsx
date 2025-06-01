import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="bg-primary py-3 px-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingCart size={20} className="mr-2" />
          <Link to="/" className="text-xl font-semibold">PantryHub</Link>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-white hover:underline">Home</Link>
          <Link to="/inventory" className="hover:text-white hover:underline">Inventory</Link>
          <Link to="/marketplace" className="hover:text-white hover:underline">Marketplace</Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;