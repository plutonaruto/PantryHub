import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';


export default function QuantityClaim({ maxQty, onClaim, instructions }) {
    const [claimQty, setClaimQty] = useState(1);
    const [warning, setWarning] = useState('');
    
    useEffect(() => {
        if (claimQty > maxQty) {
            setWarning(maxQty === 0 ? 'Fully claimed.' : `Only ${maxQty} items available.`);
        } else {
            setWarning('');
        }
    }, [claimQty, maxQty]);

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) {
            setClaimQty(1);
            return;
        }
        setClaimQty(val);
    };

    const handleClaim = () => {
        if (claimQty < 1 || claimQty > maxQty) return;

        onClaim(claimQty);

        toast.custom((t) => (
        <div
            className={`transform transition-all duration-300 ease-out ${
            t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                    Claimed {claimQty} item{claimQty > 1 ? 's' : ''}!
                </p>
                {instructions && (
                    <p className="mt-1 text-sm text-gray-500">
                    Pickup instructions: <br />
                    <span className="font-semibold">{instructions}</span>
                    </p>
                )}
                </div>
            </div>
            </div>
            <div className="flex border-l border-gray-200">
            <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
                Close
            </button>
            </div>
        </div>
        ));
    };

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={maxQty}
          value={claimQty}
          onChange={handleChange}
          className="w-16 px-2 py-1 border rounded text-center text-sm"
        />
        <button
          onClick={handleClaim}
          disabled={claimQty < 1 || claimQty > maxQty}
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Claim
        </button>
      </div>
      {warning && <p className="text-sm text-red-500">{warning}</p>}
    </div>
  );
} 