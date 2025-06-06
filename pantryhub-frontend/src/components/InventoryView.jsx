import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import ItemCard from './cards/ItemCard';
import { useState, useEffect } from 'react';
import cart from '../assets/cart.png';

export default function InventoryView({ name, items = [] }) {
  const [updatedItems, setUpdatedItems] = useState(items);
  const [expiringItems, setExpiringItems] = useState([]);

  const onAdjustQty = (index, delta) => {
    const newItems = [...updatedItems];
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
  }, [items]);

  useEffect(() => {
    setUpdatedItems(items);
  }, [items]);

  return (
    <div className="flex flex-col gap-4"> {/* Unified vertical spacing */}
      {/* Hero Section */}
      <div className="hero-banner flex flex-col justify-between text-white mb-4">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, {name}!</h1>
        <p className="text-white text-opacity-90">What would you like to do today?</p>
      </div>

      {/* Content Section */}
      <div className="flex gap-4 items-start">
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-black flex items-center mb-4">
            Your Inventory <FaChevronRight className="ml-1" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {updatedItems.map((item, i) => (
              <Link to={`/item/${item.id}`} key={item.id}>
                <ItemCard
                  item={item}
                  onIncrement={() => onAdjustQty(i, 1)}
                  onDecrement={() => onAdjustQty(i, -1)}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[300px] flex flex-col gap-4 mx-4">
          {/* Expiring Items */}
          <div className="bg-[#cccccc] p-4 rounded-lg text-center shadow">
            <div className="text-lg font-extrabold text-black mb-2">Expiring Soon</div>
            {expiringItems.length > 0 ? (
              expiringItems.map(item => (
                <p key={item.id}>
                  <span className="font-bold">{item.name}</span>{' '}
                  <em className="text-sm text-gray-600">expiring in 1 day</em> {/*placeholder val*/}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-600">No items expiring tomorrow.</p>
            )}
          </div>

          {/* Marketplace Link */}
          <div className="bg-[#9C6B98] p-4 rounded-lg text-center shadow flex flex-col items-center gap-3">
            <img
              src={cart}
              alt="Cart"
              className="h-20 w-20 object-contain"
            />
            <Link to="/marketplace">
              <button className="text-white bg-white/20 px-4 py-2 rounded-full flex items-center justify-center gap-2">
                Explore Marketplace <FaChevronRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
