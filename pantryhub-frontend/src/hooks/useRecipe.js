export function useRecipe() {
  const savedRecipes = [
    {
      name: 'Vanilla Cake',
      servings: 3,
      image: null,
    },
    {
      name: 'Chocolate Cake',
      servings: 2,
      image: null,
    },
  ];

  const availableIngredients = [
    { name: 'Flour', quantity: 1, image: '/images/flour.png' },
    { name: 'Eggs', quantity: 4, image: '/images/eggs.png' },
    { name: 'Sugar', quantity: 2, image: '/images/sugar.png' },
    { name: 'Butter', quantity: 1, image: '/images/butter.png' },
  ];

  const generateRecipes = () => {
    // TODO: Call AI API in the future
    console.log('Generate clicked. Integrate AI here.');
  };

  return { savedRecipes, availableIngredients, generateRecipes };
}
