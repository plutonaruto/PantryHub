import SaveToPlannerDropdown from "../shared/SaveToPlannerDropdown";
import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, onUnsave, onView, onSave, onPlannerSave }) {
  const recipeSlug = (recipe.title || recipe.name || "untitled")
    .toLowerCase()
    .replace(/\s+/g, "-");

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

      <div className="flex gap-2 mt-2 flex-wrap">
        <Link to={`/recipes/${recipeSlug}`}>
          <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            View Full Recipe
          </button>
        </Link>

        {onSave && (
          <button
            className="px-4 py-1 bg-primary text-white rounded hover:bg-primary-dark"
            onClick={onSave}
          >
            Save
          </button>
        )}

        {onUnsave && (
          <button
            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onUnsave}
          >
            Unsave
          </button>
        )}

        {typeof onPlannerSave === "function" && (
          <SaveToPlannerDropdown onSave={onPlannerSave} />
        )}
      </div>
    </div>
  );
}
