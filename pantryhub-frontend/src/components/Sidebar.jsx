import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import React from 'react';


export default function Sidebar() {
    return (
        <div className="bg-primary shadow-sm flex flex-col h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-col justify-between items-center">
                    <div className="flex flex-col items-center gap-2"></div>
                        <img src ={logo} alt="PantryHub Logo"  className="h-5 w-5 object-contain max-w-[60px]" />
                    </div>

            <nav className="flex flex-col items-center gap-6">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/inventory" className="nav-link">Inventory</Link>
                <Link to="/marketplace" className="nav-link">Marketplace</Link>

            </nav>
           </div>
        </div>
    );

}
