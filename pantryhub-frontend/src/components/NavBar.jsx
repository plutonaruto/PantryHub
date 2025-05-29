import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
   <nav className="bg-purple-700 text-white px-8 py-3 flex justify-between items-center shadow">
      <div className="text-xl font-bold">PantryHub</div>
      <div className="flex gap-x-16 text-sm">
        <Link to="/" className="px-3 py-1 hover:text-purple-200 transition">Home</Link>
        <Link to="/inventory" className="px-3 py-1 hover:text-purple-200 transition">Inventory</Link>
        <Link to="/marketplace" className="px-3 py-1 hover:text-purple-200 transition">Marketplace</Link>
      </div>
    </nav>
  );
}
