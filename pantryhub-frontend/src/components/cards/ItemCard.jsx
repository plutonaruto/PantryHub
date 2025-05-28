import QuantityControl from '../shared/QuantityControl';

export default function ItemCard({ item, onIncrement, onDecrement }) {
  return (
    <div className="p-4 border rounded bg-gray-100">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-14 w-14 object-cover rounded mb-2"
        />
      )}
      <h3 className="font-bold">{item.name}</h3>
      <p>Expiry: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</p>
      <QuantityControl value={item.quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
    </div>
  );
}
