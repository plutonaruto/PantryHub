import TextInput from '../shared/TextInput';

export default function MarketplaceForm({ formData, onChange, onSubmit, onImageChange }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <TextInput
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={onChange}
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
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <TextInput
        label="Expiry Date"
        name="expiry_date"
        type="date"
        value={formData.expiry_date}
        onChange={onChange}
        required
        className="mb-4"
      />

      <TextInput
        label="Quantity"
        name="quantity"
        type="number"
        min="1"
        value={formData.quantity}
        onChange={onChange}
        required
        className="mb-4"
      />

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
        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Post to Marketplace
      </button>
    </form>
  );
}