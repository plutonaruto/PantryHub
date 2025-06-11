import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuantityClaim from '../shared/QuantityClaim';

export default function MarketplaceItemCard({ item, onClaim }) {
  const [warning, setWarning] = useState('');

  const navigate = useNavigate();

  return (
    <div className=" bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col justify-between">
      {item.imageUrl && (
        <img
          src={`http://localhost:5000/${item.imageUrl}`}
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
      <div className="flex items-center gap-2">
        <QuantityClaim
          maxQty={item.quantity}
          onClaim={onClaim}
        />
        {/* debugging 
        <h3 className="text-lg font-bold text-gray-800">
          (ID: {item.id})
        </h3> */}

      </div>
      {warning && <p className="text-sm text-red-500 mt-1">{warning}</p>}
    </div>
  );
}
