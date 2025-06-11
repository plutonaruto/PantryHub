import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import QuantityClaim from '../components/shared/QuantityClaim';

export default function MarketplaceItemPage({ onClaim }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/marketplace/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <LayoutWrapper>
    <div className="p-6">
      <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="rounded w-96 mb-4" />
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p className="mt-2 text-gray-600">{item.description}</p>
      <p className="mt-2">Pickup Location: <strong>{item.pickup_location || "N/A"}</strong></p>
      <p>Expiry Date: {item.expiry_date}</p>
      <p>Quantity Available: {item.quantity}</p>
      <QuantityClaim
        maxQty={item.quantity}
        onClaim={onClaim}
      />
    </div>
  </LayoutWrapper>
);
}
 