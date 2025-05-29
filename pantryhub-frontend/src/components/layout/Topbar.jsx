export default function Topbar() {
  return (
    <div className="bg-white shadow px-8 py-3 flex justify-between items-center">
      <input
        type="text"
        placeholder="Search for anything..."
        className="w-2/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
}
