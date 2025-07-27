import { useState, useEffect } from "react";

export function useRecipe() {
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem("savedRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  return {
    savedRecipes,
    setSavedRecipes,
    availableIngredients,
  };
}
