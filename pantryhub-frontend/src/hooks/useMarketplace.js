import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api';
import { useAuth } from '../firebase/AuthProvider'; 

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', expiry_date: '' , quantity: 1, image: null});

  const { user } = useAuth();
  const ownerId = user?.uid;

  const fetchItems = async () => {
    try {
      const res = await api.getMarketplaceItems();
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load marketplace items");
      setLoading(false);
    }
  };

  const addItem = async () => {
    console.log("addItem called", formData);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("expiry_date", formData.expiry_date);
    form.append("quantity", Number(formData.quantity)); // force cast
    form.append("room_no", "101"); //dummy still
    form.append("owner_id", 1);
    form.append("pantry_id", 1);
    
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await api.createMarketplaceItem(form), {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      await fetchItems();
      setFormData({ name: '', description: '', expiry_date: '', quantity: 1, image: null });
      return true; //success flag

    } catch (err) {
      console.error("Failed to post marketplace item:", err.response?.data || err.message);
      return false; //failure
    }
};

  //not used yet
  const getRecentItems = (limit = 5) => {
    if (!Array.isArray(items)) return []; // added due to potential issues with items being undefined
    return [...items]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
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

    try {
      if (remainingQty <= 0) {
        // mark as claimed and remove item
        await api.updateMarketplaceItem(item.id,{
          quantity: 0,
          claimed: true
        });
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
      } else {
        // Just update quantity
        await api.updateMarketplaceItem(item.id, {
          quantity: remainingQty
        });
        const updated = [...items];
        updated[index].quantity = remainingQty;
        setItems(updated);
      }
    } catch (err) {
      console.error("Failed to update item:", err.response?.data || err.message);
    }
  };



  useEffect(() => {
    fetchItems();
  }, []);



  return { items, formData, setFormData, addItem, updateForm, claimItem, onImageChange, fetchItems, getRecentItems };
}
