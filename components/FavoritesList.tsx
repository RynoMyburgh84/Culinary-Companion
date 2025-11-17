import React from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface FavoritesListProps {
    favorites: Recipe[];
    onToggleFavorite: (recipe: Recipe) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onToggleFavorite }) => {
    if (favorites.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="text-3xl font-bold text-center text-stone-800 dark:text-stone-200 border-b-2 border-red-500 pb-2 mb-8">
                Your Favorite Recipes
            </h2>
            <div className="space-y-8">
                {favorites.map((recipe) => (
                    <RecipeCard
                        key={recipe.name}
                        recipe={recipe}
                        isFavorite={true}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>
        </div>
    );
};

export default FavoritesList;