import React from 'react';
import type { Recipe } from '../types';
import { ShareIcon } from './icons/ShareIcon';
import { HeartIcon } from './icons/HeartIcon';

interface RecipeCardProps {
    recipe: Recipe;
    isFavorite: boolean;
    onToggleFavorite: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onToggleFavorite }) => {

    const handleShare = async () => {
        if (!navigator.share) {
            alert('Sharing is not supported on your browser.');
            return;
        }

        const haveText = recipe.ingredientsYouHave.length > 0
            ? recipe.ingredientsYouHave.map(ing => `- ${ing}`).join('\n')
            : 'None';
        const buyText = recipe.ingredientsToBuy.length > 0
            ? recipe.ingredientsToBuy.map(ing => `- ${ing}`).join('\n')
            : 'None';
        const instructionsText = recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');

        const shareText = `
Check out this recipe: ${recipe.name}

${recipe.description}

---
Ingredients You Have:
${haveText}

---
Ingredients To Buy:
${buyText}

---
Instructions:
${instructionsText}

Shared from Culinary Companion!
        `.trim();

        try {
            await navigator.share({
                title: `Recipe: ${recipe.name}`,
                text: shareText,
            });
        } catch (error) {
            console.error('Error sharing recipe:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg overflow-hidden border border-stone-200 dark:border-stone-700 transition-shadow duration-300 hover:shadow-2xl">
            <div className="p-6">
                 <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{recipe.name}</h3>
                        <p className="mt-2 text-stone-600 dark:text-stone-400 italic">{recipe.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                            onClick={() => onToggleFavorite(recipe)}
                            className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-100 dark:bg-red-900/30' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-red-500 dark:hover:text-red-500'}`}
                            aria-label={isFavorite ? 'Unfavorite recipe' : 'Favorite recipe'}
                            title={isFavorite ? 'Unfavorite recipe' : 'Favorite recipe'}
                        >
                            <HeartIcon className="w-6 h-6" filled={isFavorite} />
                        </button>
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            aria-label="Share recipe"
                            title="Share recipe"
                        >
                            <ShareIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-900/70 p-6 border-t border-b border-stone-200 dark:border-stone-700">
                <h4 className="font-bold text-lg text-stone-800 dark:text-stone-200 mb-4">Ingredients</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">You Have:</h5>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                            {recipe.ingredientsYouHave.length > 0 ? (
                                recipe.ingredientsYouHave.map((ing, i) => <li key={i}>{ing}</li>)
                            ) : (
                                <li>None from your list</li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">To Buy:</h5>
                         <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                            {recipe.ingredientsToBuy.length > 0 ? (
                                recipe.ingredientsToBuy.map((ing, i) => <li key={i}>{ing}</li>)
                            ) : (
                                <li>Nothing!</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-6">
                 <h4 className="font-bold text-lg text-stone-800 dark:text-stone-200 mb-4">Instructions</h4>
                 <ol className="list-decimal list-inside space-y-3 text-stone-700 dark:text-stone-300">
                    {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                 </ol>
            </div>
        </div>
    );
};

export default RecipeCard;