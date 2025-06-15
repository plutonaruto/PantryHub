import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', expiry_date: '' , quantity: 1, image: null, instructions: '', pickup_location: ''});

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/marketplace");
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
    form.append("instructions", formData.instructions);
    form.append("pickup_location", formData.pickup_location);
    
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await axios.post("http://localhost:5000/marketplace", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      await fetchItems();
      setFormData({ name: '', description: '', expiry_date: '', quantity: 1, image: null, instructions: '', pickup_location: '' });
      return true; //success flag

    } catch (err) {
      console.error("Failed to post marketplace item:", err.response?.data || err.message);
      return false; //failure
    }
};

  //not used yet
  const getRecentItems = (limit = 5) => {
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
        await axios.patch(`http://localhost:5000/marketplace/${item.id}`, {
          quantity: 0,
          claimed: true
        });
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
      } else {
        await axios.patch(`http://localhost:5000/marketplace/${item.id}`, {
          quantity: remainingQty
        });
        const updated = [...items];
        updated[index].quantity = remainingQty;
        setItems(updated);
      }

      return { success: true, instructions: item.instructions, claimedQty: quantityToClaim };

    } catch (err) {
      console.error("Failed to update item:", err.response?.data || err.message);
      return { success: false, error: err };
    }
  };




  useEffect(() => {
    fetchItems();
  }, []);



  return { items, formData, addItem, updateForm, claimItem, onImageChange, fetchItems, getRecentItems };
}
