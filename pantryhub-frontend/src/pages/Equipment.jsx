import Sidebar from '../components/Sidebar';
import EquipmentForm from '../components/forms/EquipmentForm';
import EquipmentCard from '../components/cards/EquipmentCard';
import { useState } from 'react';
import CustomisedTopBar from '../components/layout/CustomisedTopBar';
import { useAuth } from "../firebase/AuthProvider";
import { api } from '../api';
import { useEquipment } from '../hooks/useEquipment';
import { CookingPot, X } from 'lucide-react';


export default function Equipment() {
    const { items, formData, addItem, setItems, fetchItems, updateForm } = useEquipment();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth() || {};
    if (!user) return null;

    const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    };

   const filteredItems = Array.isArray(items)
  ? items.filter(equipment =>
      (equipment.label || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await addItem(e);
      if (success) {
        setIsFormVisible(false);
      }
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
        <div className= "flex h-screen">
            <div className="w-64 bg-primary text-white flex flex-col p-2 flex-shrink-0">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col">
                <CustomisedTopBar 
                    showSearch={true}
                    searchQuery={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    onPostItem={() => setIsFormVisible(true)}
                />

                <h1 className= "px-8 py-4 font-bold text-gray-800 text-2xl"> Equipment </h1>

                {isFormVisible && user.role === 'admin' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white w-full max-w-xl mx-auto p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-xl font-semibold text-gray-800">Post a New Item</h2>
                                <button
                                 onClick={() => setIsFormVisible(false)}
                                 className="text-gray-500 hover:text-gray-700"
                                 >
                                <X size={20} />
                                </button>
                            </div>
                            <EquipmentForm 
                                formData={formData}
                                onChange={updateForm}
                                onSubmit={handleSubmit}
                                onSuccess={() => setIsFormVisible(false)}
                                />

                        </div>
                    </div>
    )}
              { filteredItems.length === 0 ? (
                <div className="bg-white px-12 py-8 rounded-lg shadow text-center">
                  <CookingPot size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No items found</h3>
                  <p className="text-gray-500">
                    {searchQuery 
                    ? `No items match your search for "${searchQuery}"`
                    : "No available equipment!"}
                    </p>
                </div>
                ) : (
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4">
                    {filteredItems.map((equipment, index) => (
                        <EquipmentCard 
                        key={equipment.id || index}
                        label = {equipment.label}
                        description={equipment.description} 
                        usage_instructions={equipment.usage_instructions} 
                        pantry_id = {equipment.pantry_id}
    
                />
              ))}
            </div>
            )}
        </div>
    </div>


        
    
    );
}