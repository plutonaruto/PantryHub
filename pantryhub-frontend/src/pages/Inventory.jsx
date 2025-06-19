import ItemForm from '../components/forms/ItemForm';
import ItemCard from '../components/cards/ItemCard';
import { useInventory } from '../hooks/useInventory';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/layout/HeroBanner';
import { X } from 'lucide-react';
import InventoryView from '../components/InventoryView';

export default function Inventory() {
  const { items, formData, addItem, updateForm, onImageChange, setItems, adjustQty, fetchItem, removeItem} = useInventory();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearchChange = (e) => { setSearchQuery(e.target.value); };
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  

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
  const cartImage = 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  

  return (
    <div className="flex min-h-screen gap-2">
      {/* Sidebar: fix width */}
      <div className="w-64 bg-primary text-white flex flex-col p-2 flex-shrink-0">
        <Sidebar />
      </div>

    <main className="flex-1 p-6 bg-gray-50">

      <div className="grid grid-cols-4 gap-4 mb-8">
        {items.map((item, i) => (
          <ItemCard
            key={i}
            item={item}
            onIncrement={() => adjustQty(i, 1)}
            onDecrement={() => adjustQty(i, -1)}
          />
        ))}
      </div>

      <div className="mt-8 ml-4 p-4">
        <InventoryView
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onPostItem={() => setIsFormVisible(true)} />

      {isFormVisible && (
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

      <ItemForm
            formData={formData}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onImageChange={onImageChange}
            onSuccess={() => setIsFormVisible(false)}
          />
        </div>
      </div>
    )}
      </div>
  </main>
  </div>
  );
}
