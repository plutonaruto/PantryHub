import { useState } from 'react';

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', expiry: '' , quantity: 1, image: null});

  const addItem = (e) => {
    e.preventDefault();
    const newItem = { 
      ...formData, 
      quantity: parseInt(formData.quantity, 10),
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : null
    };
    setItems([...items, newItem]);
    setFormData({ name: '', description: '', expiry: '', quantity: 1, image: null});
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

  const claimItem = (index, quantityToClaim) => {
    const updated = [...items];
    updated[index].quantity -= quantityToClaim;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1); // remove the item if none left
    }
    setItems(updated);
  };

  return { items, formData, addItem, updateForm, claimItem, onImageChange };
}
