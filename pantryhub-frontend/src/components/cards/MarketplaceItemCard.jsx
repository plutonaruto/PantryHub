import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuantityClaim from '../shared/QuantityClaim';

export default function MarketplaceItemCard({ item, onClaim }) {
  const [warning, setWarning] = useState('');

  const navigate = useNavigate();

  console.log("Image URL:", item.image_url);

  return (
    <div className=" bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col justify-between">
      {item.image_url && (
        <img
          src={
                item.image_url 
                ? (item.image_url?.startsWith("http")
                  ? item.image_url
                  : `${import.meta.env.VITE_API_URL}${item.image_url}`)
                : "/placeholder.jpg"
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
      </div>
      <QuantityClaim
        maxQty={item.quantity}
        onClaim={onClaim}
        instructions={item.instructions}
      />
    </div>
  );
}