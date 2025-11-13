
import React, { useState, useMemo } from 'react';
import { analyzeFridgeAndSuggestRecipes } from './services/geminiService';
import { Recipe, Ingredient } from './types';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import ShoppingList from './components/ShoppingList';
import Spinner from './components/Spinner';
import { LogoIcon } from './components/icons';

type ActiveTab = 'recipes' | 'shoppingList';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setRecipes([]);
      setSelectedRecipe(null);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        const suggestedRecipes = await analyzeFridgeAndSuggestRecipes(base64Image, activeFilters);
        setRecipes(suggestedRecipes);
        setIsLoading(false);
      };
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleAddToShoppingList = (item: Ingredient) => {
    setShoppingList(prev => {
        if (!prev.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
            return [...prev, item];
        }
        return prev;
    });
  };

  const handleRemoveFromShoppingList = (itemName: string) => {
      setShoppingList(prev => prev.filter(i => i.name !== itemName));
  }

  const filteredRecipes = useMemo(() => {
    if (activeFilters.length === 0) {
      return recipes;
    }
    return recipes.filter(recipe => 
      activeFilters.every(filter => 
        recipe.dietaryTags.some(tag => tag.toLowerCase() === filter.toLowerCase())
      )
    );
  }, [recipes, activeFilters]);

  const resetApp = () => {
    setImage(null);
    setRecipes([]);
    setSelectedRecipe(null);
    setError(null);
    setIsLoading(false);
    setActiveTab('recipes');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
       <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          shoppingListCount={shoppingList.length}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

      <main className="flex-1 flex flex-col transition-all duration-300">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm md:justify-start">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center cursor-pointer" onClick={resetApp}>
              <LogoIcon className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-gray-800 ml-2">Culinary Assistant</h1>
            </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {selectedRecipe ? (
                 <RecipeDetail 
                    recipe={selectedRecipe} 
                    onBack={() => setSelectedRecipe(null)} 
                    onAddToShoppingList={handleAddToShoppingList}
                    shoppingList={shoppingList}
                 />
            ) : (
                <>
                  {activeTab === 'recipes' ? (
                      <div className="max-w-7xl mx-auto w-full">
                          {!image && !isLoading && <ImageUploader onImageUpload={handleImageUpload} />}
                          {isLoading && <div className="flex flex-col items-center justify-center mt-16"><Spinner /><p className="text-gray-600 mt-4">Analyzing your fridge...</p></div>}
                          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                          {image && !isLoading && filteredRecipes.length > 0 && 
                            <RecipeList recipes={filteredRecipes} onSelectRecipe={setSelectedRecipe} />
                          }
                          {image && !isLoading && recipes.length > 0 && filteredRecipes.length === 0 &&
                            <p className="text-center text-gray-600 mt-8">No recipes match your selected filters.</p>
                          }
                          {image && !isLoading && recipes.length === 0 && !error &&
                            <p className="text-center text-gray-600 mt-8">Could not find any recipes. Please try another photo.</p>
                          }
                      </div>
                  ) : (
                      <ShoppingList items={shoppingList} onRemoveItem={handleRemoveFromShoppingList}/>
                  )}
                </>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
