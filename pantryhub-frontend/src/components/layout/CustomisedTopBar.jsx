import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useAuth } from "../../firebase/AuthProvider";
import { useNavigate } from 'react-router-dom';

const CustomisedTopbar = ({ searchQuery, onSearchChange, onPostItem }) => {

  const { user } = useAuth() || {};
    if (!user) return null;
  
  const navigate = useNavigate();

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
          {user.role === 'admin' && (
          <div className="flex justify-end w-full md:w-auto gap-4">
            <button
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
              onClick={onPostItem}
            >
              <Plus size={18} />
              Add Equipment
            </button>

            <button
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
              onClick={() => navigate('/equipment/log')}
            >
              Equipment Log
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomisedTopbar;