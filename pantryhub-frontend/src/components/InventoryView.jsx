import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import ItemForm from '../components/forms/ItemForm';
import ItemCard from './cards/ItemCard';
import { useState, useEffect } from 'react';
import cart from '../assets/cart.png';
import Topbar from '../components/layout/Topbar';


export default function InventoryView({name, items = [], showTopbar = false, onSearchChange = () => {}, onPostItem = () => {} }) {
    const [updatedItems, setUpdatedItems] = useState(items);
    const [expiringItems, setExpiringItems] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
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
    

    const onAdjustQty = (index, delta) => {
      const newItems =[...updatedItems];
    
      const newQuantity = Math.max(1, newItems[index].quantity + delta);
      newItems[index].quantity = newQuantity;

      setUpdatedItems(newItems);

    };

    useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); 

    const expiring = items.filter(item => {
      const expiryDate = new Date(item.expiry_date);
      return (
        expiryDate.getDate() === tomorrow.getDate() &&
        expiryDate.getMonth() === tomorrow.getMonth() &&
        expiryDate.getFullYear() === tomorrow.getFullYear()
      );
    });


    setExpiringItems(expiring);
    }, []);

    useEffect(() => {
  setUpdatedItems(items);
    }, []);

    return (
    <>
      <div className="hero-banner flex flex-col justify-between mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back, {name}!
        </h1>
        <p className="text-white text-opacity-90">What would you like to do today?</p>
      </div>

      <div className = "flex flex-col mb-6 mt-6">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onPostItem={onPostItem}/>
      </div>

      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-black flex items-center mb-4">
            Your Inventory <FaChevronRight className="ml-1" />
          </h2>
          <main className="flex-1 p-6 bg-gray-50">
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
                    onSubmit={addItem} 
                    onImageChange={onImageChange}
                  />
                </div>
              </div>
            )}
          <div className="grid grid-cols-3 gap-4">
            {items.map((item, i) => (
              <Link to={`/item/${item.id}`} key={item.id}>
                <ItemCard
                  item={item}
                  onIncrement={() => onAdjustQty(i, 1)}
                  onDecrement={() => onAdjustQty(i, -1)}
                />
              </Link>
            ))}
          </div>
        </main>
        </div>

        {/* Right Column */}
        <div className="w-[300px] flex flex-col gap-6 mb-6 ">
          {/* Expiring Items */}
          <div className="bg-[#cccccc] p-4 rounded-full text-center gap-2 items-center justify-center mb-6">
            <div className="text-lg font-extrabold text-black ">Expiring Soon</div>
            {expiringItems.map((item) => (
              <p key={item.id}>
                <span className="font-bold">{item.name}</span>{" "}
                <em className="text-sm text-gray-600">expiring in 1 day</em>
              </p>
            ))}
          </div>

          {/* Marketplace Link */}
          <div className="flex flex-col bg-[#9C6B98] container rounded-full text-center gap-2 items-center justify-center mt-6">
            <img src={cart} alt="Cart" className="h-5 w-5 object-contain max-w-[60px]"></img>
            <nav>
                <Link to="/marketplace">
                  <button className="text-white bg-white/20 px-4 py-2 rounded-full flex items-center justify-center gap-2">
                    Explore Marketplace <FaChevronRight />
                  </button>
                </Link>
            </nav>
            
          </div>
        </div>
      </div>
    </>
  );
}
