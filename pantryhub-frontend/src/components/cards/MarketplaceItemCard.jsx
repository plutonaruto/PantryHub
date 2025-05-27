import { useState } from 'react';

export default function MarketplaceItemCard({ item, onClaim }) {
  const [claimQty, setClaimQty] = useState(1);

  const handleClaim = () => {
    const quantityToClaim = Math.min(claimQty, item.quantity);
    if (quantityToClaim > 0) {
      onClaim(quantityToClaim);
      setClaimQty(1);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 shadow">
      <h3 className="font-bold">{item.name}</h3>
      <p className="text-sm italic text-gray-600">{item.description}</p>
      <p className="text-sm">Expires: {item.expiry}</p>
      <p className="text-sm font-medium">Available: {item.quantity}</p>

      <div className="flex items-center mt-2">
        <input
          type="number"
          value={claimQty}
          onChange={(e) => setClaimQty(e.target.value)}
          className="w-16 p-1 border rounded"
       />
       <button 
          onClick={handleClaim} 
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Claim
        </button>
      </div>
    </div>
  );
}
  