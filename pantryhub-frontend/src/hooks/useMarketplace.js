import { useState } from 'react';

export function useMarketplace() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', expiry: '' });

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, formData]);
    setFormData({ name: '', description: '', expiry: '' });
  };

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const claimItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1); // remove the item
    setItems(updated);
  };

  return { items, formData, addItem, updateForm, claimItem };
}
