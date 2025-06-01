import { useState } from 'react';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import HeroBanner from '../components/layout/HeroBanner';
import MarketplaceForm from '../components/forms/MarketplaceForm';
import MarketplaceItemCard from '../components/cards/MarketplaceItemCard';
import { useMarketplace } from '../hooks/useMarketplace';
import { ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Marketplace() {
  const { items, formData, addItem, updateForm, claimItem, onImageChange} = useMarketplace();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

   const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    await addItem(e);
    setIsFormVisible(false);
  };

  const cartImage = '/assets/cart-banner.png'; // Replace with actual banner asset path

  return (
    <LayoutWrapper
      showTopbar={true}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onPostItem={() => setIsFormVisible(true)}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Hero banner */}
        <HeroBanner
          title="Welcome to the Marketplace."
          subtitle="Share more, Waste less."
          image={cartImage}
        />

        {/* Form modal */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Post a New Item</h2>
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <MarketplaceForm
                  formData={formData}
                  onChange={updateForm}
                  onSubmit={handleSubmit}
                  onImageChange={onImageChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">All Items</h2>
            <div className="flex gap-2">
              <button className="bg-gray-200 p-1 rounded-full">
                <ChevronLeft size={18} />
              </button>
              <button className="bg-gray-200 p-1 rounded-full">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? `No items match your search for "${searchQuery}"`
                  : 'The marketplace is currently empty. Be the first to post!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <MarketplaceItemCard
                  key={item.id}
                  item={item}
                  onClaim={(qty) => claimItem(index, qty)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </LayoutWrapper>
  );
}
