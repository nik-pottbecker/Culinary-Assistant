
import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe }) => {
  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipe Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} onSelectRecipe={onSelectRecipe} />
        ))}
        </div>
    </div>
  );
};

export default RecipeList;
