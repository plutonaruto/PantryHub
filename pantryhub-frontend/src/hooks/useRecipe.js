import { useState, useEffect } from "react";

export function useRecipe() {
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem("savedRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // dummy ingredients for now
  const availableIngredients = [
    { name: "Flour", quantity: 1, image: "/images/flour.png" },
    { name: "Eggs", quantity: 4, image: "/images/eggs.png" },
    { name: "Sugar", quantity: 2, image: "/images/sugar.png" },
    { name: "Butter", quantity: 1, image: "/images/butter.png" },
  ];

  return {
    savedRecipes,
    setSavedRecipes,
    availableIngredients,
  };
}
