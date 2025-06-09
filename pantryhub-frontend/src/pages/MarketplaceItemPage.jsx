import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MarketplaceItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

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
    </div>
  );
}
 