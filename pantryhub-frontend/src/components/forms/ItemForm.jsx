import TextInput from "../shared/TextInput";
import QuantityControl from '../shared/QuantityControl';
import { useState, useEffect } from 'react';

export default function ItemForm({formData, onChange, onSubmit, onImageChange}) {
    const [warning, setWarning] = useState('');
    const [localQuantity, setLocalQuantity] = useState(parseInt(formData.quantity, 10) || 1);
    const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    const [imageWarning, setImageWarning] = useState('');

    return (
        <form onSubmit={onSubmit} className="space-y-3 mb-6"> 
                <TextInput 
                    label="Item Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={onChange} 
                    required 
                    className="mbi-4"
                />
            <div className="mb-4">
            
            <div>
                <TextInput 
                    label="Expiry Date" 
                    name="expiry" 
                    value={formData.expiry} 
                    onChange={onChange} 
                    type="date" 
                    required 
                    className="mb-4"
                />
            </div>
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

            <div>
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
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
                Add to Inventory
            </button>
        </form>
    );
}
