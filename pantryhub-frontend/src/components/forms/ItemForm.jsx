import TextInput from "../src/shared/TextInput";

export default function ItemForm({formData, onChange, onSubmit}) {
    return (
        <form onSubmit={onSubmit} className="space-y-3 mb-6"> 
            <TextInput label="Name" name="name" value={formData.name} onChange={onChange} required />
            <TextInput label="Expiry Date" name="expiry" value={formData.expiry} onChange={onChange} type="date" required />
            <TextInput label="Quantity" name="quantity" value={formData.quantity} onChange={onChange} type="number"required />
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Add to Inventory</button>
        </form>
    );
}