
import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import ItemForm from '../components/forms/ItemForm';
import ItemCard from '../components/cards/ItemCard';
import { useState, useEffect } from 'react';




export default function InventoryView({name, items}) {
    const [updatedItems, setUpdatedItems] = useState(items);

    const onAdjustQty = (index, delta) => {
        const newItem =[...updatedItems];
    
    const newQuantity = Math.max(1, newItems[index].quantity + delta);
    newItems[index].quantity = newQuantity;

    setUpdatedItems(newItems);

    };

    const [expiringItems, setExpiringItems] = useState([]);


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

    return (
    <>
      <section className="px-8 py-6 bg-[#9C6B98] rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-1 text-white">
          Welcome Back, {name}!
        </h1>
        <p className="text-lg text-white">What would you like to do today?</p>
      </section>

      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-black flex items-center mb-4">
            Your Inventory <FaChevronRight className="ml-1" />
          </h2>
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
        </div>

        {/* Right Column */}
        <div className="w-[300px] flex flex-col gap-6">
          {/* Expiring Items */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="text-lg font-bold text-black">Expiring Soon</div>
            {expiringItems.map((item) => (
              <p key={item.id}>
                <span className="font-bold">{item.name}</span>{" "}
                <em className="text-sm text-gray-600">expiring in 1 day</em>
              </p>
            ))}
          </div>

          {/* Marketplace Link */}
          <div className="bg-[#9C6B98] p-4 rounded-lg text-center">
            <Link to="/marketplace">
              <button className="text-white bg-white/20 px-4 py-2 rounded-full flex items-center justify-center gap-2">
                Explore Marketplace <FaChevronRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
