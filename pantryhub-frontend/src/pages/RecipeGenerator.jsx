import { useState } from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroBanner from "../components/layout/HeroBanner";
import RecipeCard from "../components/cards/RecipeCard";
import { useRecipe } from "../context/RecipeContext";

export default function RecipeGenerator() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { savedRecipes, setSavedRecipes } = useRecipe();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ingredients = ingredientInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const response = await fetch(`${API_BASE_URL}//api/generate-recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    const data = await response.json();
    if (data.recipes && Array.isArray(data.recipes)) {
      setGeneratedRecipes(data.recipes);
    } else {
      console.error("Invalid recipes response:", data);
      setGeneratedRecipes([]);
    }

    setLoading(false);
  };

  const handleSave = (recipe) => {
    const alreadySaved = savedRecipes.some((r) => r.name === recipe.name);
    if (alreadySaved) {
      setSavedRecipes((prev) => prev.filter((r) => r.name !== recipe.name));
    } else {
      setSavedRecipes((prev) => [...prev, recipe]);
    }
  };

  return (
    <LayoutWrapper showTopbar={false}>
      <div className="container mx-auto px-4 py-8">
        <HeroBanner
          title="Generate Recipes with AI"
          subtitle="Select ingredients and let AI create recipes for you."
        />

        {/* Ingredient Input Form */}
        <section className="mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="e.g., chicken, rice, broccoli"
              className="flex-1 border rounded px-3 py-2"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
        </section>

        {/* Generated Recipes */}
        {Array.isArray(generatedRecipes) && generatedRecipes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Generated Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {generatedRecipes.map((recipe, index) => {
                const isSaved = savedRecipes.some((r) => r.name === recipe.name);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
                      <ul className="list-disc list-inside mb-4">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className={`flex-1 px-4 py-2 rounded ${
                          isSaved
                            ? "bg-primary-dark hover:bg-red-400 text-white"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                        onClick={() => handleSave(recipe)}
                      >
                        {isSaved ? "Unsave" : "Save"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </LayoutWrapper>
  );
}
