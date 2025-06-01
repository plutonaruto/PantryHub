import TextInput from '../shared/TextInput';

export default function MarketplaceForm({ formData, onChange, onSubmit, onImageChange}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <TextInput
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
        />
      </div>

      <div>
        <TextInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={onChange}
        />
      </div>

      <div>
        <TextInput
          label="Expiry Date"
          name="expiry"
          type="date"
          value={formData.expiry}
          onChange={onChange}
          required
        />
      </div> 

      <div>
        <TextInput
          label="Quantity"
          name="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={onImageChange}
        />
      </div>
      
      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
        Post to Marketplace
      </button>
    </form>
  );
}
