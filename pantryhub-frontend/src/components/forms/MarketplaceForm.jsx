import TextInput from '../shared/TextInput';

export default function MarketplaceForm({ formData, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 mb-6">
      <TextInput
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
      />
      <TextInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={onChange}
      />
      <TextInput
        label="Expiry Date"
        name="expiry"
        type="date"
        value={formData.expiry}
        onChange={onChange}
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Post to Marketplace
      </button>
    </form>
  );
}
