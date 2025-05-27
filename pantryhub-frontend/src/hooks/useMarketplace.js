import { useState } from 'react';

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', expiry: '' , quantity: 1}); //default quantity that can be changed

  const addItem = (e) => {
    e.preventDefault();
    const newItem = { 
      ...formData, 
      quantity: parseInt(formData.quantity, 10)
    };
    setItems([...items, newItem]);
    setFormData({ name: '', description: '', expiry: '', quantity: 1});
  };

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const claimItem = (index, quantityToClaim) => {
    const updated = [...items];
    updated[index].quantity -= quantityToClaim;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1); // remove the item if none left
    }
    setItems(updated);
  };

  return { items, formData, addItem, updateForm, claimItem };
}
