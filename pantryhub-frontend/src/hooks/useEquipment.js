import axios from 'axios';
import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../firebase/AuthProvider'; 


export function useEquipment() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ label: '', description: '', usage_instructions: '' });
  const { user } = useAuth();
  const ownerId = user?.uid;


  const fetchItems = async () => {
    try {
      
        const data = await api.getAllEquipment();
        setItems(data);
    } catch (err) {
      console.error("Error fetching Equipment:", err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append('label', formData.label);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('usage_instructions', formData.usage_instructions);
    formDataToSend.append('pantry_id', formData.pantry_id);

  
    try {
      await api.createEquipment(formDataToSend);
    
      const data = await api.getAllEquipment();
      setItems(data);
      setFormData({ label: '', description: '', usage_instructions: '', pantry_id: ''});
    } catch (err) {
      console.error("Failed to post item to backend:", err);
    }
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, formData, addItem, setItems, fetchItems, updateForm};
}
