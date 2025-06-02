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

  const addItem = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append('name', formData.name);
    formDataToSend.append('expiry_date', formData.expiry);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('room_no', "101");  // dummy data for room_no
    formDataToSend.append('owner_id', 1);     // dummy data for owner_id
    formDataToSend.append('pantry_id', 1);    // dummy data for pantry_id

    
  
    try {
      await axios.post("http://localhost:5000/items", formDataToSend, {
        headers: {
            "Content-Type": "multipart/form-data",  // Required for file uploads
        }

      });
      const res = await axios.get("http://localhost:5000/items");
      setItems(res.data);
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

  const adjustQty = (index, delta) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta)
    setItems(newItems);
  }

  const fetchItem= async() => {
    try{
      const res = await axios.get(`http://localhost:5000/items/${item.id}`);
      setItems(res.data)

    } catch (err) {
      console.error("Item not found:", err)

    }

  };

  const removeItem = async (index) => {
  const itemId = items[index].id;  // Get the item ID based on the index
  
  try {
    // Send DELETE request to remove the item from the backend
    await axios.delete(`http://localhost:5000/items/${itemId}`);
    const updatedItems = items.filter((_, i) => i !== index);  // Filter out the deleted item
    setItems(updatedItems);  // Update the state with the new list
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};

  useEffect(() => {
    axios.get("http://localhost:5000/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  return { items, formData, addItem, updateForm, onImageChange, setItems, adjustQty, removeItem, fetchItem};
}
