import { useState, useEffect } from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroBanner from "../components/layout/HeroBanner";
import { useRecipe } from "../context/RecipeContext";
import { usePlanner } from "../hooks/usePlanner";
import SaveToPlannerDropdown from "../components/shared/SaveToPlannerDropdown";
import { getAuth } from "firebase/auth";

export default function RecipeGenerator() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState([]);
  const { savedRecipes, setSavedRecipes } = useRecipe();
  const { addRecipeToDay } = usePlanner();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailableItems(data);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      }
    };

    fetchItems();
  }, [user, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const manualIngredients = ingredientInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const inventoryIngredients = selectedInventory.map((item) => item.name);

    const ingredients = [...manualIngredients, ...inventoryIngredients];

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-recipes`, {
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
    } catch (err) {
      console.error("Error generating recipes:", err);
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

  const toggleInventorySelect = (item) => {
    setSelectedInventory((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      return exists
        ? prev.filter((i) => i.name !== item.name)
        : [...prev, item];
    });
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
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
        </section>

        {/* Inventory Selection */}
        {availableItems.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Or select from your inventory:</h3>
            <div className="flex flex-wrap gap-2">
              {availableItems.map((item, i) => {
                const selected = selectedInventory.some((inv) => inv.name === item.name);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInventorySelect(item)}
                    className={`px-3 py-1 rounded border ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </section>
        )}

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
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        className={`px-4 py-2 rounded ${
                          isSaved
                            ? "bg-primary-dark hover:bg-red-400 text-white"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                        onClick={() => handleSave(recipe)}
                      >
                        {isSaved ? "Unsave" : "Save to My Recipes"}
                      </button>
                      <SaveToPlannerDropdown
                        onSave={(day) => addRecipeToDay(day, recipe)}
                      />
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
