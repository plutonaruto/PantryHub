import React from 'react';
import NavBar from '../NavBar';
import Topbar from './Topbar';

const LayoutWrapper = ({ children, showTopbar = false, searchQuery = '', onSearchChange = () => {}, onPostItem = () => {}, postButtonLabel }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {showTopbar && (
        <Topbar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onPostItem={onPostItem}
          postButtonLabel={postButtonLabel}
        />
      )}
      {children}
    </div>
  );
};

export default LayoutWrapper;