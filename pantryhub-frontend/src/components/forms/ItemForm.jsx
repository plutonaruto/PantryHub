import TextInput from "../shared/TextInput";

export default function ItemForm({formData, onChange, onSubmit, onImageChange}) {
    return (
        <form onSubmit={onSubmit} className="space-y-3 mb-6"> 
                <TextInput 
                    label="Item Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={onChange} 
                    required 
                    className="mb-4"
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
            
                <TextInput 
                    label="Quantity" 
                    name="quantity" 
                    value={formData.quantity} 
                    onChange={onChange} 
                    type="number"
                    required 
                    className="mb-4"
                />
            </div> 

            <div>
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
                Add to Inventory
            </button>
        </form>
    );
}
