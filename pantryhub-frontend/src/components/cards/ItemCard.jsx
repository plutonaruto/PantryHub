import QuantityControl from '../shared/QuantityControl';
import { Link } from 'react-router-dom';


export default function ItemCard({ item, onIncrement, onDecrement, isAdmin }) {
  return (
    <Link to={`/items/${item.id}`} className="block">
      <div className="p-4 border rounded bg-gray-100 cursor-pointer transition-colors hover:bg-[#9C6B98]">
        {item.imageUrl && (
          <img
            src={`http://localhost:5000/${item.imageUrl || item.image}`}
            alt={item.name}
            className="h-14 w-14 object-cover rounded mb-2"
          />
        )}
        <h3 className="font-bold">{item.name} (ID: {item.id})</h3>
        <p>Expiry: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</p>
        <QuantityControl value={item.quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
        <p> {isAdmin && ( `Owned By: ${item.owner_id}`) } </p>
      </div>
    </Link>
  );
}
