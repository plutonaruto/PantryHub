import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuantityClaim from '../shared/QuantityClaim';
import { useAuth } from '../../firebase/AuthProvider';
import { api } from '../../api';

export default function MarketplaceItemCard({ item, onClaim }) {
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = user?.uid === item.owner_id;
  const isAdmin = user?.role === "admin"; 

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;
    try {
      await api.deleteMarketplaceItem(item.id);
      if (onDelete) onDelete(item.id);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col justify-between">
      {item.image_url && (
        <img
          src={
            item.image_url.startsWith("http")
              ? item.image_url
              : `${import.meta.env.VITE_API_URL}${item.image_url}`
          }
          alt={item.name}
          className="max-h-24 w-full object-contain rounded mb-2"
        />
      )}
      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
      <div className="text-sm text-gray-500 mt-1">
        <p>Available: {item.quantity}</p>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button
          className="border border-gray-400 rounded px-4 py-1 text-sm hover:bg-slate-100 mb-2"
          onClick={() => navigate(`/marketplace/${item.id}`)}
        >
          More Info
        </button>

        {(isOwner || isAdmin) && (
          <button
            className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>

      <QuantityClaim
        maxQty={item.quantity}
        onClaim={onClaim}
        instructions={item.instructions}
      />
    </div>
  );
}
