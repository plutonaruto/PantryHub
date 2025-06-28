import { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [savedRecipes, setSavedRecipes] = useState([]);

  return (
    <RecipeContext.Provider value={{ savedRecipes, setSavedRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  return useContext(RecipeContext);
}
