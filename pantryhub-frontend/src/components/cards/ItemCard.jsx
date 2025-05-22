import QuantityControl from '../shared/QuantityControl';

export default function ItemCard({ item, onIncrement, onDecrement }) {
  return (
    <div className="p-4 border rounded bg-gray-100">
      <h3 className="font-bold">{item.name}</h3>
      <p>Expiry: {item.expiry}</p>
      <QuantityControl value={item.quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
    </div>
  );
}
