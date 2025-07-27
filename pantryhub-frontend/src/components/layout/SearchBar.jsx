import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange}) => {
  return (
    <div className="topbar">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="search-container relative">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e)}
              className="search-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
      
          </div>
        </div>
      </div>
  );
};

export default SearchBar;