import { useState } from 'react';

export function useInventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', expiry: '', quantity: 1, image: null });

  const addItem = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      quantity: parseInt(formData.quantity, 10),
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : null
    };
    setItems([...items, newItem]);
    setFormData({ name: '', expiry: '', quantity: 1, image: null });
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

  return { items, formData, addItem, updateForm, onImageChange, setItems };
}
