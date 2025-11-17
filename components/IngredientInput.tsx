import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface IngredientInputProps {
    onSubmit: (ingredients: string) => void;
    isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onSubmit, isLoading }) => {
    const [ingredients, setIngredients] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(ingredients);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800/50 p-6 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700">
            <label htmlFor="ingredients" className="block text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
                What ingredients do you have?
            </label>
            <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken breast, rice, broccoli, soy sauce"
                className="w-full h-32 p-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-stone-50 dark:bg-stone-800 dark:text-stone-200 placeholder:text-stone-500 dark:placeholder:text-stone-400"
                disabled={isLoading}
            />
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Separate ingredients with commas or new lines.</p>
            <button
                type="submit"
                disabled={isLoading || !ingredients.trim()}
                className="mt-4 w-full flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-stone-400 dark:disabled:bg-stone-600 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-md disabled:shadow-none"
            >
                <SparklesIcon className="w-6 h-6 mr-2" />
                {isLoading ? 'Thinking...' : 'Generate Recipes'}
            </button>
        </form>
    );
};

export default IngredientInput;