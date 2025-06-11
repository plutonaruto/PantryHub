import { useState, useEffect } from 'react';

export default function QuantityClaim({ maxQty, onClaim }) {
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
        if (claimQty >= 1 && claimQty <= maxQty) {
            onClaim(claimQty);
            setClaimQty(1);
        }
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
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={claimQty < 1 || claimQty > maxQty}
            >
            Claim
            </button>
        </div>
        {warning && <p className="text-sm text-red-500">{warning}</p>}
        </div>
    );
}