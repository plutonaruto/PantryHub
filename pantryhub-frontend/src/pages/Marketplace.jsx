import MarketplaceForm from '../components/forms/MarketplaceForm';
import MarketplaceItemCard from '../components/cards/MarketplaceItemCard';
import { useMarketplace } from '../hooks/useMarketplace';

export default function Marketplace() {
  const { items, formData, addItem, updateForm, claimItem } = useMarketplace();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <MarketplaceForm formData={formData} onChange={updateForm} onSubmit={addItem} />
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, i) => (
          <MarketplaceItemCard key={i} item={item} onClaim={(qty) => claimItem(i, qty)} />
        ))}
      </div>
    </div>
  );
}
