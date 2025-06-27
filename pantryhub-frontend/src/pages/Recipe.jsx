import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import HeroBanner from '../components/layout/HeroBanner';
import RecipeCard from '../components/cards/RecipeCard';
import { useRecipe } from '../hooks/useRecipe';
import { ChefHat, X } from 'lucide-react';

export default function RecipePage() {
  const { availableIngredients, generateRecipes } = useRecipe();
  const [savedRecipes, setSavedRecipes] = useState([
    {
      name: "Tomato Soup",
      ingredients: [
        "2 cups diced tomatoes",
        "1 cup vegetable broth",
        "Salt & pepper"
      ]
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnsave = (recipeIndex) => {
    setSavedRecipes((prev) =>
      prev.filter((_, idx) => idx !== recipeIndex)
    );
  };

  const navigate = useNavigate();

  return (
    <LayoutWrapper
      showTopbar={true}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onPostItem={() => navigate("/recipes/generate")}
      postButtonLabel="Generate"
    >
      <div className="container mx-auto px-4 py-8">
        <HeroBanner
          title="Welcome to the Recipe Generator."
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
                />
              ))}
            </div>
          )}
        </section>

        {/* Available Ingredients */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Available Ingredients</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableIngredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md text-center bg-white shadow-sm"
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="h-24 mx-auto mb-2"
                />
                <p className="font-medium">{ingredient.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {ingredient.quantity}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LayoutWrapper>
  );
}
