import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase"; 
import { useAuth } from "../firebase/AuthProvider";
import { useNotifications } from "../hooks/useNotifications.jsx";

export function useMarketplace() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
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
  const { setNotifications } = useNotifications();

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/marketplace`);
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load marketplace items");
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!auth.currentUser) {
      console.warn("No logged-in user for notifications.");
      return [];
    }
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get(
      `${API_BASE_URL}/notifications/${auth.currentUser.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const addItem = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("expiry_date", formData.expiry_date);
    form.append("quantity", Number(formData.quantity));
    form.append("room_no", "101"); // dummy
    form.append("owner_id", 1); // dummy
    form.append("pantry_id", 1);
    form.append("instructions", formData.instructions);
    form.append("pickup_location", formData.pickup_location);

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await axios.post(`${API_BASE_URL}/marketplace`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  const claimItem = async (index, quantityToClaim) => {
    const item = items[index];
    const remainingQty = Number(item.quantity) - quantityToClaim;

    if (!auth.currentUser) {
      console.error("No logged-in user.");
      return { success: false, error: "User not logged in" };
    }

    const token = await auth.currentUser.getIdToken();

    try {
      await axios.patch(
        `${API_BASE_URL}/marketplace/${item.id}`,
        {
          quantity: remainingQty < 0 ? 0 : remainingQty,
          claimer_id: auth.currentUser.uid,
          claimed: remainingQty <= 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      console.error("Failed to update item:", err.response?.data || err.message);
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
    addItem,
    updateForm,
    claimItem,
    onImageChange,
    fetchItems,
    getRecentItems,
  };
}
