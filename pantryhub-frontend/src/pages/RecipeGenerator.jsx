import { useState } from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroBanner from "../components/layout/HeroBanner";
import RecipeCard from "../components/cards/RecipeCard";

export default function RecipeGenerator() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // For now, simulate generation
    const ingredients = ingredientInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const dummyRecipes = Array.from({ length: 5 }, (_, i) => ({
      name: `Generated Recipe ${i + 1}`,
      ingredients,
    }));

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setGeneratedRecipes(dummyRecipes);
    setLoading(false);
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
        {generatedRecipes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Generated Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {generatedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  onView={() => console.log(`Viewing ${recipe.name}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </LayoutWrapper>
  );
}
