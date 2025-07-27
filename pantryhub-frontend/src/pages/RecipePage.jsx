import { useParams } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext";

export default function RecipePage() {
  const { id } = useParams();
  const { savedRecipes } = useRecipe();

  const title = id.replace(/-/g, " ");
  const recipe = savedRecipes.find((r) => r.name?.toLowerCase() === title.toLowerCase());

  if (!recipe) {
    return <div className="p-6">Recipe not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">{recipe.name}</h1>
      <h2 className="text-xl font-semibold">Ingredients</h2>
      <ul className="list-disc ml-6 mb-4">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold">Instructions</h2>
      <p className="whitespace-pre-line text-gray-700">
        {recipe.instructions || "No instructions provided."}
      </p>
    </div>
  );
}
