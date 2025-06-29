import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import QuantityClaim from '../components/shared/QuantityClaim';
import { useAuth } from '../firebase/AuthProvider'; 

export default function MarketplaceItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:5000/marketplace/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const onClaim = async (qty) => {
    if (!item || qty > item.quantity) return;

    try {
      await axios.patch(`http://localhost:5000/marketplace/${id}`, {
        quantity: item.quantity - qty,
        claimed: item.quantity - qty === 0,
      });

      setItem(prev => ({
        ...prev,
        quantity: prev.quantity - qty,
        claimed: prev.quantity - qty === 0,
      }));
    } catch (err) {
      console.error('Error claiming item:', err);
    }
  };

  //change to toast
  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/marketplace/${id}`);
      alert("Item removed successfully");
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <LayoutWrapper>
      <div className="p-6">
        <img
          src={`http://localhost:5000${item.image_url}`}
          alt={item.name}
          className="rounded w-96 mb-4"
        />
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <p className="mt-2 text-gray-600">{item.description}</p>
        <p className="mt-2">
          Pickup Location: <strong>{item.pickup_location}</strong>
        </p>
        <p>Expiry Date: {item.expiry_date}</p>
        <p>Quantity Available: {item.quantity}</p>

        {/* Quantity Claim Component */}
        <QuantityClaim
          maxQty={item.quantity}
          onClaim={onClaim}
          instructions={item.instructions}
        />

        {/* Admin remove button */}
        {user?.role === 'admin' && (
          <button
            onClick={handleRemove}
            className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove Item
          </button>
        )}
      </div>
    </LayoutWrapper>
  );
}
