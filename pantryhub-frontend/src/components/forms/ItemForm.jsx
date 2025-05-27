import TextInput from "../shared/TextInput";

export default function ItemForm({formData, onChange, onSubmit, onImageChange}) {
    return (
        <form onSubmit={onSubmit} className="space-y-3 mb-6"> 
            <div>
                <TextInput 
                    label="Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={onChange} 
                    required 
                />
            </div>
            
            <div>
                <TextInput 
                    label="Expiry Date" 
                    name="expiry" 
                    value={formData.expiry} 
                    onChange={onChange} 
                    type="date" 
                    required 
                />
            </div>
            
            <div>
                <TextInput 
                    label="Quantity" 
                    name="quantity" 
                    value={formData.quantity} 
                    onChange={onChange} 
                    type="number"
                    required 
                />
            </div> 

            <div>
                <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="block mt-1"
                />
            </div>
            
            <button 
                type="submit" 
                className="bg-purple-600 text-white px-4 py-2 rounded"
            >
                Add to Inventory
            </button>
        </form>
    );
}