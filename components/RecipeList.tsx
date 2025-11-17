import React from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import Spinner from './Spinner';

interface RecipeListProps {
    recipes: Recipe[] | undefined | null;
    isLoading: boolean;
    favorites: Recipe[];
    onToggleFavorite: (recipe: Recipe) => void;
}

const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl mt-12">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">Ready for some culinary inspiration?</h2>
        <p className="text-stone-600 dark:text-stone-300">Enter your ingredients above to get started!</p>
    </div>
);

const RecipeList: React.FC<RecipeListProps> = ({ recipes, isLoading, favorites, onToggleFavorite }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-12">
                <Spinner />
                <p className="mt-4 text-lg text-stone-600 dark:text-stone-300 font-semibold">Crafting your delicious options...</p>
            </div>
        );
    }

    if (!recipes) {
        return <WelcomeMessage />;
    }
    
    if(recipes.length === 0){
        return <p className="text-center text-stone-600 dark:text-stone-400 mt-8">No recipes could be generated. Try adding more ingredients!</p>
    }

    return (
        <div className="space-y-8 mt-8">
            <h2 className="text-3xl font-bold text-center text-stone-800 dark:text-stone-200 border-b-2 border-emerald-500 pb-2">
                Your Recipe Suggestions
            </h2>
            {recipes.map((recipe, index) => {
                const isFavorite = favorites.some(fav => fav.name === recipe.name);
                return (
                    <RecipeCard
                        key={index}
                        recipe={recipe}
                        isFavorite={isFavorite}
                        onToggleFavorite={onToggleFavorite}
                    />
                );
            })}
        </div>
    );
};

export default RecipeList;