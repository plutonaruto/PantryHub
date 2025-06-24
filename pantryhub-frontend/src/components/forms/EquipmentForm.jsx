import { useState } from 'react';
import TextInput from '../shared/TextInput';

export default function EquipmentForm({ formData, onChange, onSubmit, onImageChange, onSuccess }) {
  const [warning, setWarning] = useState('');

  const handleFormChange = (e) => {    
    onChange(e);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(e); // should return true if API call worked
    if (success && typeof onSuccess === 'function') {
      onSuccess(); // Hide form
    }
  };




  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <TextInput
        label="Equipment Name"
        name="label"
        value={formData.label}
        onChange={handleFormChange}
        required
        className="mb-4"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usage Instructions
        </label>
        <textarea
          name="usage_instructions"
          value={formData.usage_instructions}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="mb-1">
        {warning && (
          <p className="text-sm text-yellow-500 mt-1">{warning}</p>
        )}
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pantry Level
      </label>
      <select
        name="pantry_id"
        value={formData.pantry_id}
        onChange={handleFormChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      >
        <option value="">Select a level</option>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
        <option value="4">Level 4</option>
      </select>
      
      <button 
        type="submit" 
        className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
          warning ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'
        }`}
      >
        Post
      </button>
    </form>
  );
}
