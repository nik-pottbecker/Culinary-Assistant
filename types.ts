
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTimeMinutes: number;
  calories: number;
  ingredients: Ingredient[];
  instructions: string[];
  missingIngredients: Ingredient[];
  dietaryTags: string[];
}
