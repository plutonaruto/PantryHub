export default function MarketplaceItemCard({ item, onClaim }) {
    return (
      <div className="p-4 border rounded bg-gray-50 shadow">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-sm italic text-gray-600">{item.description}</p>
        <p className="text-sm">Expires: {item.expiry}</p>
        <button onClick={onClaim} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
          Claim
        </button>
      </div>
    );
  }
  