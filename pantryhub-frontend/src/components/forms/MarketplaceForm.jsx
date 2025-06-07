import { useState, useEffect } from 'react';
import TextInput from '../shared/TextInput';
import QuantityControl from '../shared/QuantityControl';

export default function MarketplaceForm({ formData, onChange, onSubmit, onImageChange }) {
  const [warning, setWarning] = useState('');
  const [localQuantity, setLocalQuantity] = useState(parseInt(formData.quantity, 10) || 1);

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
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (localQuantity < 1) {
      setWarning('Quantity must be at least 1');
      return;
    }
    
    onSubmit();
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Item Image
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={onImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={!!warning}
        className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
          warning ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'
        }`}
      >
        Post to Marketplace
      </button>
    </form>
  );
}
