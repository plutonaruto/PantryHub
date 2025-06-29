import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api";

export default function MarketplaceItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:5000/marketplace/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="rounded w-96 mb-4" />
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p className="mt-2 text-gray-600">{item.description}</p>
      <p className="mt-2">Pickup Location: <strong>{item.pickup_location}</strong></p>
      <p>Expiry Date: {item.expiry_date}</p>
      <p>Quantity Available: {item.quantity}</p>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded">Claim Now</button>
      {user.role === 'admin' & (
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick = { async() => {
          try {
            await api.removeMarketplaceItem(itemId);
            alert("Marketplace Item removed successfully");
            navigate("/marketplace");
          } catch (error) {
              console.error("Error removing Marketplace Item:", error);
              alert("Failed to remove Marketplace Item. Please try again.");
            }
          }}>
        Remove Item 
        </button>
      )}
    </div>
  );
}
 