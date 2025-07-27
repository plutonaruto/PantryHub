import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import HeroBanner from '../components/layout/HeroBanner';
import RecipeCard from '../components/cards/RecipeCard';
import { useRecipe } from '../context/RecipeContext';
import { usePlanner } from '../hooks/usePlanner';
import { ChefHat } from 'lucide-react';

export default function RecipePage() {
  const { savedRecipes, setSavedRecipes } = useRecipe();
  const { mealPlan, addRecipeToDay, removeRecipeFromDay } = usePlanner();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnsave = (recipeIndex) => {
    setSavedRecipes((prev) => prev.filter((_, idx) => idx !== recipeIndex));
  };

  return (
    <LayoutWrapper
      showTopbar={true}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onPostItem={() => navigate("/recipes/generate")}
      postButtonLabel="Generate a Recipe"
    >
      <div className="container mx-auto px-4 py-8">
        <HeroBanner
          title="Welcome to your Recipe Book."
          subtitle="A Recipe for Responsibility."
        />

        {/* Saved Recipes */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Saved Recipes</h2>

          {filteredRecipes.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <ChefHat size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No recipes found</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? `No recipes match your search for "${searchQuery}".`
                  : 'No recipes generated yet. Click Generate to create some!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  onUnsave={() => handleUnsave(index)}
                  onPlannerSave={(day) => addRecipeToDay(day, recipe)}
                />
              ))}
            </div>
          )}
        </section>

        {/*Recipe Planner */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Weekly Recipe Planner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {Object.entries(mealPlan).map(([day, recipes]) => (
              <div key={day} className="bg-white rounded shadow p-4">
                <h3 className="font-semibold text-lg mb-2">{day}</h3>
                {recipes.length === 0 ? (
                  <p className="text-gray-500 italic">No recipes planned.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {recipes.map((r, i) => (
                      <li key={i} className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          {r.url ? (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {r.name}
                            </a>
                          ) : (
                            <span>{r.name}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeRecipeFromDay(day, r.name)}
                          className="text-red-500 hover:underline text-sm ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </LayoutWrapper>
  );
}
