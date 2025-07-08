import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import QuantityClaim from '../components/shared/QuantityClaim';
import { useAuth } from "../firebase/AuthProvider";

export default function MarketplaceItemPage() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/marketplace/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const onClaim = async (qty) => {
    if (!item || qty > item.quantity) return;

    try {

      const remainingQty = item.quantity - qty;

      await axios.patch(`${API_BASE_URL}/marketplace/${id}`, {
        quantity: item.quantity - qty,
        claimer_id: user.uid,
        claimed: remainingQty <= 0
      });

      setItem(prev => ({
        ...prev,
        quantity: remainingQty,
        claimed: remainingQty <= 0
      }));
    } catch (err) {
      console.error('Error claiming item:', err);
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <LayoutWrapper>
    <div className="p-6">
      <img src={`${API_BASE_URL}${item.image_url}`} alt={item.name} className="rounded w-96 mb-4" />
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p className="mt-2 text-gray-600">{item.description}</p>
      <p className="mt-2">Pickup Location: <strong>{item.pickup_location}</strong></p>
      <p>Expiry Date: {item.expiry_date}</p>
      <p>Quantity Available: {item.quantity}</p>
      <QuantityClaim
        maxQty={item.quantity}
        onClaim={onClaim}
        instructions={item.instructions}
      />
    </div>
  </LayoutWrapper>
);
}
 