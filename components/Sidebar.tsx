
import React from 'react';
import { DIETARY_FILTERS } from '../constants';
import { LogoIcon } from './icons';

interface SidebarProps {
  activeTab: 'recipes' | 'shoppingList';
  setActiveTab: (tab: 'recipes' | 'shoppingList') => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  shoppingListCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    activeTab, 
    setActiveTab, 
    activeFilters, 
    setActiveFilters, 
    shoppingListCount,
    isOpen,
    setIsOpen,
}) => {

  const handleFilterChange = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setIsOpen(false)}>
      </div>
      <aside className={`absolute md:relative flex flex-col w-64 bg-white border-r border-gray-200 h-full z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <LogoIcon className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-gray-800 ml-2">Menu</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-500 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('recipes'); }}
            className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${activeTab === 'recipes' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            Recipes
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('shoppingList'); }}
            className={`flex items-center justify-between px-4 py-2 text-gray-700 rounded-md ${activeTab === 'shoppingList' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            <span>Shopping List</span>
            {shoppingListCount > 0 && <span className="ml-2 text-sm font-semibold bg-secondary text-gray-800 rounded-full px-2">{shoppingListCount}</span>}
          </a>
        </nav>
        
        <div className="px-4 py-4 border-t">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dietary Filters</h3>
          <div className="mt-4 space-y-3">
            {DIETARY_FILTERS.map(filter => (
              <label key={filter} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={activeFilters.includes(filter)}
                  onChange={() => handleFilterChange(filter)}
                />
                <span className="ml-3 text-sm text-gray-600">{filter}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
