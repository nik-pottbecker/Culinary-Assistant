
import React from 'react';
import { Ingredient } from '../types';

interface ShoppingListProps {
    items: Ingredient[];
    onRemoveItem: (itemName: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem }) => {
    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Shopping List</h2>
            {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your shopping list is empty.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                        <li key={index} className="py-4 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.quantity}</p>
                            </div>
                            <button 
                                onClick={() => onRemoveItem(item.name)}
                                className="text-red-500 hover:text-red-700 font-semibold"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingList;
