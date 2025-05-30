import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="w-64 bg-[#9C6B98] text-white flex flex-col p-6 h-screen">
            <div className="text-xl font-bold">PantryHub</div>
            <div className="flex gap-x-16 text-sm">
                <Link to="/" className="px-3 py-1 hover:text-purple-200 transition">Home</Link>
                <Link to="/inventory" className="px-3 py-1 hover:text-purple-200 transition">Inventory</Link>
                <Link to="/marketplace" className="px-3 py-1 hover:text-purple-200 transition">Marketplace</Link>

            </div>
        </div>
    );

}