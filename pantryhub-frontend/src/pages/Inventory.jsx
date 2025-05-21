import ItemForm from '../components/forms/ItemForm';
import ItemCard from '../components/cards/ItemCard';
import { useInventory } from '../hooks/useInventory';

export default function Inventory() {
  const { items, formData, addItem, updateForm, setItems } = useInventory();

  const adjustQty = (index, delta) => {
    const updated = [...items];
    updated[index].quantity = Math.max(0, Number(updated[index].quantity) + delta);
    setItems(updated);
  };

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        <ItemForm formData={formData} onChange={updateForm} onSubmit={addItem} />
        <div className="grid grid-cols-4 gap-4">
            {items.map((item, i) => (
            <ItemCard
                key={i}
                item={item}
                onIncrement={() => adjustQty(i, 1)}
                onDecrement={() => adjustQty(i, -1)}
            />
            ))}
      </div>
    </div>
  );
}