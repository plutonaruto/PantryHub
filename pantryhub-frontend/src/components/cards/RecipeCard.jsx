export default function RecipeCard({ recipe, onUnsave, onView, onSave }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">{recipe.name || "Untitled Recipe"}</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic mb-4">No ingredients listed.</p>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        {onView && (
          <button
            className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            onClick={onView}
          >
            See Full Recipe
          </button>
        )}
        {onSave && (
          <button
            className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            onClick={onSave}
          >
            Save
          </button>
        )}
        {onUnsave && (
          <button
            className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-red-400"
            onClick={onUnsave}
          >
            Unsave
          </button>
        )}
      </div>
    </div>
  );
}
