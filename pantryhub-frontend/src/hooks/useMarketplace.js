import { useState, useEffect } from 'react'; 
import { useAuth } from '../firebase/AuthProvider';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../api';

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expiry_date: "",
    quantity: 1,
    image: null,
    instructions: "",
    pickup_location: "",
  });

  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      const data = await api.getMarketplaceItems();
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load marketplace items");
      setLoading(false);
    }
  };

  const addItem = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("expiry_date", formData.expiry_date);
    form.append("quantity", Number(formData.quantity));
    form.append("room_no", "101"); // dummy
    form.append("pantry_id", 1);
    form.append("instructions", formData.instructions);
    form.append("pickup_location", formData.pickup_location);

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await api.createMarketplaceItem(form);
      await fetchItems();
      setFormData({
        name: "",
        description: "",
        expiry_date: "",
        quantity: 1,
        image: null,
        instructions: "",
        pickup_location: "",
      });
      return true;
    } catch (err) {
      console.error("Failed to post marketplace item:", err.response?.data || err.message);
      return false;
    }
  };

  const getRecentItems = (limit = 5) => {
    return [...items]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const { fetchNotifications, setNotifications } = useNotifications();

  const claimItem = async (index, quantityToClaim) => {
    const item = items[index];
    const remainingQty = Number(item.quantity) - quantityToClaim;

    if (!user || !user.uid) {
      console.error("No logged-in user.");
      return { success: false, error: "User not logged in" };
    }

    try {
      await api.updateMarketplaceItem(item.id, {
        quantity: remainingQty < 0 ? 0 : remainingQty,
        claimed: remainingQty <= 0,
      });

      const updated = [...items];
      if (remainingQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = remainingQty;
      }
      setItems(updated);

      const latestNotifications = await fetchNotifications();
      setNotifications(latestNotifications);

      return {
        success: true,
        instructions: item.instructions,
        claimedQty: quantityToClaim,
      };
    } catch (err) {
      console.error("Failed to update item:", err);
      return { success: false, error: err };
    }
  };


  useEffect(() => {
    fetchItems();
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  }, []);

  return {
    items,
    loading,
    error,
    formData,
    setFormData,
    addItem,
    updateForm,
    claimItem,
    onImageChange,
    fetchItems,
    getRecentItems,
  };
}
