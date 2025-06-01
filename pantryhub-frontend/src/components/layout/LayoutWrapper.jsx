import React from 'react';
import Topbar from './Topbar';
import Navbar from '../Navbar'; 

const LayoutWrapper = ({ children, showTopbar = false, searchQuery = '', onSearchChange = () => {}, onPostItem = () => {} }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {showTopbar && (
        <Topbar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onPostItem={onPostItem}
        />
      )}
      {children}
    </div>
  );
};

export default LayoutWrapper;