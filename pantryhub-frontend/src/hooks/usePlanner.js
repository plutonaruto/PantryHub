import { useEffect, useState } from "react";

const emptyPlan = {
  Monday: [], Tuesday: [], Wednesday: [],
  Thursday: [], Friday: [], Saturday: [], Sunday: [],
};

export function usePlanner() {
  const [mealPlan, setMealPlan] = useState(() => {
    const stored = localStorage.getItem("mealPlan");
    return stored ? JSON.parse(stored) : emptyPlan;
  });

  useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  const addRecipeToDay = (day, recipe) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: [...prev[day], recipe],
    }));
  };

  const removeRecipeFromDay = (day, name) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: prev[day].filter(r => r.name !== name),
    }));
  };

  return { mealPlan, addRecipeToDay, removeRecipeFromDay };
}
