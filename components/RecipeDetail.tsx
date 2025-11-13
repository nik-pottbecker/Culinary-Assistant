
import React, { useState, useEffect } from 'react';
import { Recipe, Ingredient } from '../types';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onAddToShoppingList: (item: Ingredient) => void;
  shoppingList: Ingredient[];
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, onAddToShoppingList, shoppingList }) => {
  const { isSpeaking, isPaused, speak, pause, resume, cancel } = useSpeechSynthesis();
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      cancel(); // Stop speaking when component unmounts
    };
  }, [cancel]);

  const handleSpeak = (text: string, index: number) => {
    if (isSpeaking && currentStep === index) {
      if(isPaused) resume();
      else pause();
    } else {
      cancel();
      speak({ 
        text, 
        onEnd: () => setCurrentStep(null)
      });
      setCurrentStep(index);
    }
  };

  const stopSpeaking = () => {
    cancel();
    setCurrentStep(null);
  };
  
  const allIngredients = [...recipe.ingredients, ...recipe.missingIngredients];

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
      <button onClick={onBack} className="flex items-center text-primary font-semibold mb-6 hover:text-primary-dark transition-colors">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Recipes
      </button>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{recipe.recipeName}</h1>
      <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {allIngredients.map((item, index) => {
                const isMissing = recipe.missingIngredients.some(mi => mi.name === item.name);
                const isInShoppingList = shoppingList.some(slItem => slItem.name === item.name);
                return (
                    <li key={index} className="flex items-center justify-between text-gray-700 text-lg">
                        <span>{item.quantity} <strong>{item.name}</strong></span>
                        {isMissing && (
                             <button
                                onClick={() => onAddToShoppingList(item)}
                                disabled={isInShoppingList}
                                className={`text-xs font-semibold py-1 px-2 rounded-full transition-colors ${
                                    isInShoppingList 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-accent text-white hover:bg-opacity-80'
                                }`}
                            >
                                {isInShoppingList ? 'Added' : '+ List'}
                            </button>
                        )}
                    </li>
                );
            })}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4">Instructions</h2>
           {isSpeaking && (
              <button onClick={stopSpeaking} className="w-full mb-4 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors">
                  Stop Reading
              </button>
           )}
          <ol className="space-y-6">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 bg-primary text-white font-bold rounded-full mr-4">{index + 1}</span>
                <div className="flex-1">
                  <p className="text-gray-800 text-lg leading-relaxed">{step}</p>
                   <button onClick={() => handleSpeak(step, index)} className="text-sm text-primary hover:underline mt-1">
                        {isSpeaking && !isPaused && currentStep === index ? 'Pause' : (isPaused && currentStep === index ? 'Resume' : 'Read Aloud')}
                   </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
