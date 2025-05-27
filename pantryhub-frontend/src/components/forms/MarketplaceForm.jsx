import TextInput from '../shared/TextInput';

export default function MarketplaceForm({ formData, onChange, onSubmit, onImageChange, imagePreview}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6 w-full max-w-md">
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
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="h-5 w-5 mt-2 rounded object-cover shadow border"/>
        )}
      </div>
      
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Post to Marketplace
      </button>
    </form>
  );
}
