import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import QuantityClaim from "../components/shared/QuantityClaim";
import { useNotifications } from "../context/NotificationContext";
import { api } from "../api";

export default function MarketplaceItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { setNotifications } = useNotifications();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await api.fetchMarketplaceItem(Number(id));
        setItem(data);
      } catch (err) {
        console.error("Failed to load item:", err);
        setError("Could not load item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const onClaim = async (qty) => {
    if (!item || qty > item.quantity) return;

    try {
      const remainingQty = item.quantity - qty;

      await api.updateMarketplaceItem(item.id, {
        quantity: remainingQty < 0 ? 0 : remainingQty,
        claimed: remainingQty <= 0,
      });

      setItem((prev) => ({
        ...prev,
        quantity: remainingQty,
        claimed: remainingQty <= 0,
      }));

      //re-fetch notifications:
      const latestNotifs = await api.getNotifications();
      setNotifications(latestNotifs);

      setMessage(`You claimed ${qty} of "${item.name}".`);
    } catch (err) {
      console.error("Error claiming item:", err);
      setError("Could not claim item.");
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <LayoutWrapper>
      <div className="p-6">
        <img
          src={
            item.image_url
              ? item.image_url.startsWith("http")
                ? item.image_url
                : `${import.meta.env.VITE_API_URL}${item.image_url}`
              : "/placeholder.jpg"
          }
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

        {message && <p className="text-green-600 mt-2">{message}</p>}

        <QuantityClaim
          maxQty={item.quantity}
          onClaim={onClaim}
          instructions={item.instructions}
        />
      </div>
    </LayoutWrapper>
  );
}
