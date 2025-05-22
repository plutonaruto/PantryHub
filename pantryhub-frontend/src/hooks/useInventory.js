import { useState } from 'react';

export function useInventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', expiry: '', quantity: 1 });

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, formData]);
    setFormData({ name: '', expiry: '', quantity: 1 });
  };

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return { items, formData, addItem, updateForm, setItems };
}
