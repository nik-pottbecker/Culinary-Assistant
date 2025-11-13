
import React from 'react';
import { Recipe } from '../types';
import { TimeIcon, FireIcon, DifficultyIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelectRecipe }) => {
  const { recipeName, description, difficulty, prepTimeMinutes, calories } = recipe;

  const difficultyColor = {
    Easy: 'text-green-600 bg-green-100',
    Medium: 'text-yellow-600 bg-yellow-100',
    Hard: 'text-red-600 bg-red-100',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="p-6 flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{recipeName}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
          <div className="flex items-center">
            <TimeIcon className="w-5 h-5 mr-1 text-primary" />
            <span>{prepTimeMinutes} min</span>
          </div>
          <div className="flex items-center">
            <FireIcon className="w-5 h-5 mr-1 text-accent" />
            <span>{calories} kcal</span>
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full ${difficultyColor[difficulty]}`}>
            <DifficultyIcon className="w-4 h-4 mr-1" />
            <span>{difficulty}</span>
          </div>
        </div>

        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.dietaryTags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 bg-gray-50">
        <button
          onClick={() => onSelectRecipe(recipe)}
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
