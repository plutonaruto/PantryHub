export default function RecipeCard({ recipe }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col items-center text-center">
      <img src={recipe.image} alt={recipe.name} className="h-24 object-cover mb-4" />
      <h3 className="font-semibold text-lg">{recipe.name}</h3>
      <p className="text-sm text-gray-600">Servings: {recipe.servings}</p>
      <div className="flex flex-col gap-2 mt-3 w-full">
        <button className="bg-purple-600 text-white py-1 rounded-md">Save</button>
        <button className="border border-purple-600 text-purple-600 py-1 rounded-md">See Full Recipe</button>
      </div>
    </div>
  );
}
