import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/layout/Topbar";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.fetchItem(id)
      .then(res => setItem(res))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="rounded w-96 mb-4" />
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p className="mt-2 text-gray-600">{item.description}</p>
      <p>Expiry Date: {item.expiry_date}</p>
      <p>Quantity: {item.quantity}</p>
      <div className = 'flex flex-row gap-4 mt-4'>
        <button className="mt-4 bg-black text-white px-4 py-2 rounded"
        onClick = { async () => {
          try {
            await api.deleteItem(id);
            alert("Item removed successfully");
            window.location.href = "/inventory"; 
          } catch (error) {
            console.error("Error removing item:", error);
            alert("Failed to remove item. Please try again.");
          }
         }}>
          Remove
        </button>

        <button className="mt-4 bg-white text-black px-4 py-2 rounded"
        onClick= { () => {
          navigate("/marketplace", {
            state: {
              prefill: {
                name: item.name || "",
                description: item.description || "",
                imageUrl: item.image_url || "",
                expiryDate: item.expiry_date || "",
                quantity: item.quantity || 1,
              },
            },
          });
        }}>Offer on Marketplace</button>
      </div>
    </div>
  );
}