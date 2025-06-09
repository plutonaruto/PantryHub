import { useState, useEffect } from 'react';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import HeroBanner from '../components/layout/HeroBanner';
import MarketplaceForm from '../components/forms/MarketplaceForm';
import MarketplaceItemCard from '../components/cards/MarketplaceItemCard';
import { useMarketplace } from '../hooks/useMarketplace';
import { ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Marketplace = () => {
  const { 
    items, 
    formData, 
    addItem, 
    updateForm, 
    onImageChange,
    claimItem, 
    getRecentItems 
  } = useMarketplace();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recentItems = getRecentItems();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("handleSubmit triggered");
      const success = await addItem(); // no need to pass event
      if (success) {
        setIsFormVisible(false);
        setSearchQuery('');
      }
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartImage = 'https://img.freepik.com/premium-psd/3d-illustration-supermarket-shopping-cart-with-grocery_763562-48.jpg';

  return (
    <LayoutWrapper 
      showTopbar={true}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onPostItem={() => setIsFormVisible(true)}
    >
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

          <MarketplaceForm
            formData={formData}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onImageChange={onImageChange}
            onSuccess={() => setIsFormVisible(false)}
          />
        </div>
      </div>
    )}


      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <HeroBanner 
          title="Welcome to the Marketplace."
          subtitle="Share items, reduce waste."
          image={cartImage}
        />

        {/* All Items Section */}
        <section>
          <div className="section-title">
            <h2>All Items</h2>
            <div className="flex space-x-2">
              <button className="p-1 bg-gray-200 rounded-full">
                <ChevronLeft size={18} />
              </button>
              <button className="p-1 bg-gray-200 rounded-full">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No items match your search for "${searchQuery}"`
                  : "The marketplace is empty. Be the first to share something!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
};

export default Marketplace;