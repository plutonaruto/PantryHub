import { useState, useEffect } from 'react';
import TextInput from '../shared/TextInput';
import QuantityControl from '../shared/QuantityControl';

export default function MarketplaceForm({ formData, onChange, onSubmit, onImageChange, onSuccess }) {
  const [warning, setWarning] = useState('');
  const [localQuantity, setLocalQuantity] = useState(parseInt(formData.quantity, 10) || 1);
  const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  const [imageWarning, setImageWarning] = useState('');

  // keep localQuantity in sync with formData when form opens
  useEffect(() => {
    setLocalQuantity(parseInt(formData.quantity, 10) || 1);
  }, [formData.quantity]);

  // sync localQuantity to formData only if valid
  useEffect(() => {
    if (localQuantity >= 1) {
      onChange({ target: { name: 'quantity', value: localQuantity } });
    }

    if (localQuantity < 1) {
      setWarning('Quantity must be at least 1');
    } else {
      setWarning('');
    }
  }, [localQuantity]);

  const handleFormChange = (e) => {
    if (e.target.name !== 'quantity') {
      onChange(e); // pass non-quantity changes up
    }
    console.log(`Updated formData: ${name} = ${value}`); //debug 
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (localQuantity < 1) {
      setWarning('Quantity must be at least 1');
      return;
    }

    if (imageWarning) {
    setImageWarning('File type unsupported');
    return;
    }
    
    const success = await onSubmit(e); // should return true if API call worked

    if (success && typeof onSuccess === 'function') {
      console.log("hide now pls");
      onSuccess(); // Hide form
    }
  };


  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <TextInput
        label="Item Name"
        name="name"
        value={formData.name}
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

      <TextInput
        label="Expiry Date"
        name="expiry_date"
        type="date"
        value={formData.expiry_date}
        onChange={handleFormChange}
        required
        className="mb-4"
      />

      <div className="mb-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <QuantityControl
          value={localQuantity}
          onChange={setLocalQuantity}
        />
        {warning && (
          <p className="text-sm text-yellow-500 mt-1">{warning}</p>
        )}
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pickup Location
      </label>
      <select
        name="pickup_location"
        value={formData.pickup_location}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      >
        <option value="">Select a level</option>
        <option value="Level 1">Level 1</option>
        <option value="Level 2">Level 2</option>
        <option value="Level 3">Level 3</option>
        <option value="Level 4">Level 4</option>
      </select>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Instructions
        </label>
        <textarea
          name="instructions"
          placeholder="Be as descriptive as possible! eg. Pickup from Level 3 pantry fridge, white container wth red lid."
          value={formData.instructions}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Item Image
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && !SUPPORTED_IMAGE_TYPES.includes(file.type)) {
              setImageWarning('Unsupported image type. Please use PNG, JPG, JPEG, or GIF.');
            } else {
              setImageWarning('');
              onImageChange(e);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {imageWarning && (
          <p className="text-sm text-yellow-500 mt-1">{imageWarning}</p>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={!!warning || !!imageWarning}
        className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
          warning || imageWarning ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'
        }`}
      >
        Post to Marketplace
      </button>
    </form>
  );
}
