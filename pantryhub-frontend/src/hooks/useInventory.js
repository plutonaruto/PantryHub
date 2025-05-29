import axios from 'axios';
import { useEffect, useState } from 'react';

export function useInventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', expiry: '', quantity: 1, image: null });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const adjustQty = async (index, delta) => {
    const updated = [...items];
    const item = updated[index];
    const currentQty = parseInt(item.quantity, 10);
    const newQty = Math.max(0, currentQty + delta);
  
    try {
      if (newQty === 0) {
          await axios.delete(`http://localhost:5000/items/${item.id}`);
          updated.splice(index, 1);
        } else {
          await axios.put(`http://localhost:5000/items/${item.id}`, {
          quantity: newQty
        });
        item.quantity = newQty;
      }

    setItems(updated);
    } catch (err) {
    console.error("Failed to update item:", err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      expiry_date: formData.expiry,
      room_no: "101", //dummy room no.
      owner_id: 1, //dummy id
      pantry_id: 1, //dummy id
      quantity: parseInt(formData.quantity, 10),
      imageUrl: "https://via.placeholder.com/100"
    };
  
    try {
      await axios.post("http://localhost:5000/items", payload);
      await fetchItems();
      setFormData({ name: '', expiry: '', quantity: 1, image: null });
    } catch (err) {
      console.error("Failed to post item to backend:", err);
    }
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, formData, addItem, updateForm, onImageChange, setItems, adjustQty, fetchItems };
}
