import React from 'react';
import { Search, Plus } from 'lucide-react';

const Topbar = ({ searchQuery, onSearchChange, onPostItem }) => {
  return (
    <div className="topbar">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e)}
              className="search-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <button 
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
            onClick={onPostItem}
          >
            <Plus size={18} />
            Post an Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;