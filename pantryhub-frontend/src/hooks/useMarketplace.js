import { useState, useEffect } from 'react';
import axios from 'axios';

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', expiry: '' , quantity: 1, image: null});

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/marketplace");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("expiry_date", formData.expiry);
    form.append("quantity", formData.quantity);
    form.append("room_no", "101"); //dummy still
    form.append("owner_id", 1);
    form.append("pantry_id", 1);
    
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
      setFormData({ name: '', description: '', expiry: '', quantity: 1, image: null });
    } catch (err) {
      console.error("Failed to post marketplace item:", err.response?.data || err.message);
    }
};



  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const claimItem = async (index, quantityToClaim) => {
    const item = items[index];
    const remainingQty = item.quantity - quantityToClaim;

    if (remainingQty <= 0) {
      try {
        await axios.patch(`http://localhost:5000/marketplace/${item.id}`, {
          quantity: 0,
          claimed: true
        });
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
      } catch (err) {
        console.error("Failed to mark item as claimed:", err);
      }
    } else {
      try {
        await axios.patch(`http://localhost:5000/marketplace/${item.id}`, {
          quantity: remainingQty
        });
        const updated = [...items];
        updated[index].quantity = remainingQty;
        setItems(updated);
      } catch (err) {
        console.error("Failed to decrement item:", err);
      }
    }
  };


  useEffect(() => {
    fetchItems();
  }, []);



  return { items, formData, addItem, updateForm, claimItem, onImageChange, fetchItems };
}
