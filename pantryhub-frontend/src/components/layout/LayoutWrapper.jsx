import React from 'react';
import NavBar from '../NavBar';
import Topbar from './Topbar';

const LayoutWrapper = ({ children, showTopbar = false, searchQuery = '', onSearchChange = () => {}, onPostItem = () => {} }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
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