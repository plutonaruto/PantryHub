import { useState } from 'react';

export default function MarketplaceItemCard({ item, onClaim }) {
  const [claimQty, setClaimQty] = useState(1);
  const [warning, setWarning] = useState('');

  //restrict claimQty to max quantity available
  const handleQuantityChange = (e) => { 
    const newQty = parseInt(e.target.value);
    if (newQty > item.quantity) {
      setWarning(`Only ${item.quantity} items available.`);
    } else {
      setWarning('');
    }

    setClaimQty(newQty);
  };

  const handleClaim = () => {
    if (claimQty > item.quantity || claimQty < 1) return;
    onClaim(claimQty);
    setClaimQty(1);
  };

  return (
    <div className="p-4 border rounded bg-gray-50 shadow">
      {item.imageUrl && (
        <img src={`http://localhost:5000/${item.imageUrl}`} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
      )}
      <h3 className="font-bold">{item.name}</h3>
      <p className="text-sm italic text-gray-600">{item.description}</p>
      <p className="text-sm">Expires: {item.expiry_date}</p>
      <p className="text-sm font-medium">Available: {item.quantity}</p>

      <div className="flex items-center mt-2">
        <input
          type="number"
          min="1"
          max={item.quantity}
          value={claimQty}
          onChange={handleQuantityChange}
          className="w-16 p-1 border text-center"
       />
       <button 
          onClick={handleClaim} 
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={claimQty < 1 || claimQty > item.quantity}
        >
          Claim
        </button>
      </div>

      {warning && (
        <p className="text-red-500 text-sm mt-1">
          {warning}
        </p>
      )}
    </div>
  );
}

  