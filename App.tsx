import React, { useState, useCallback, useEffect } from 'react';
import type { InputMode, ApiResponse, Recipe, AppMode, WeekPlanResponse, Household, Theme, MeasurementSystem } from './types';
import { generateRecipesFromText, generateRecipesFromImage, generateWeeklyPlan } from './services/geminiService';
import Header from './components/Header';
import InputTabs from './components/InputTabs';
import IngredientInput from './components/IngredientInput';
import ImageInput from './components/ImageInput';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';
import FavoritesList from './components/FavoritesList';
import ModeSwitcher from './components/ModeSwitcher';
import WeekPlannerInput from './components/WeekPlannerInput';
import WeekPlanDisplay from './components/WeekPlanDisplay';
import { CogIcon } from './components/icons/CogIcon';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
    const [appMode, setAppMode] = useState<AppMode>('single');
    const [inputMode, setInputMode] = useState<InputMode>('text');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
    const [weekPlanResponse, setWeekPlanResponse] = useState<WeekPlanResponse | null>(null);
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [household, setHousehold] = useState<Household>({ adults: 2, teens: 0, toddlers: 0 });
    const [craving, setCraving] = useState<string>('');
    
    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('culinaryCompanionTheme') as Theme) || 'system');
    const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>(() => (localStorage.getItem('culinaryCompanionMeasurement') as MeasurementSystem) || 'imperial');
    const [dislikes, setDislikes] = useState<string>(() => localStorage.getItem('culinaryCompanionDislikes') || '');

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.classList.toggle('dark', isDark);
        localStorage.setItem('culinaryCompanionTheme', theme);
    }, [theme]);
    
    useEffect(() => {
        localStorage.setItem('culinaryCompanionMeasurement', measurementSystem);
    }, [measurementSystem]);
    
    useEffect(() => {
        localStorage.setItem('culinaryCompanionDislikes', dislikes);
    }, [dislikes]);


    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem('culinaryCompanionFavorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            localStorage.removeItem('culinaryCompanionFavorites');
        }
    }, []);

    useEffect(() => {
        try {
            const storedHousehold = localStorage.getItem('culinaryCompanionHousehold');
            if (storedHousehold) {
                const parsedHousehold = JSON.parse(storedHousehold);
                if (parsedHousehold.adults !== undefined && parsedHousehold.teens !== undefined && parsedHousehold.toddlers !== undefined) {
                    setHousehold(parsedHousehold);
                }
            }
        } catch (error) {
            console.error("Failed to parse household from localStorage", error);
            localStorage.removeItem('culinaryCompanionHousehold');
        }
    }, []);

    const handleToggleFavorite = useCallback((recipeToToggle: Recipe) => {
        setFavorites(prevFavorites => {
            const isFavorited = prevFavorites.some(fav => fav.name === recipeToToggle.name);
            let newFavorites;
            if (isFavorited) {
                newFavorites = prevFavorites.filter(fav => fav.name !== recipeToToggle.name);
            } else {
                newFavorites = [...prevFavorites, recipeToToggle];
            }
            localStorage.setItem('culinaryCompanionFavorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    }, []);
    
    const handleHouseholdChange = useCallback((newHousehold: Household) => {
        setHousehold(newHousehold);
        localStorage.setItem('culinaryCompanionHousehold', JSON.stringify(newHousehold));
    }, []);

    const handleModeChange = (newMode: AppMode) => {
        setAppMode(newMode);
        setError(null);
        setApiResponse(null);
        setWeekPlanResponse(null);
    };

    const handleTextSubmit = useCallback(async (ingredients: string) => {
        if (!ingredients.trim()) {
            setError("Please enter some ingredients.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setApiResponse(null);
        try {
            const response = await generateRecipesFromText(ingredients, measurementSystem, dislikes);
            setApiResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [measurementSystem, dislikes]);

    const handleImageSubmit = useCallback(async (imageFile: File) => {
        if (!imageFile) {
            setError("Please select an image file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setApiResponse(null);
        try {
            const response = await generateRecipesFromImage(imageFile, measurementSystem, dislikes);
            setApiResponse(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [measurementSystem, dislikes]);

    const handlePlannerSubmit = useCallback(async (ingredients: string, images: File[]) => {
        if (!ingredients.trim() && images.length === 0) {
            setError("Please provide ingredients or at least one image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setWeekPlanResponse(null);
        try {
            const response = await generateWeeklyPlan(ingredients, images, favorites, household, craving, measurementSystem, dislikes);
            setWeekPlanResponse(response);
        } catch (err) {
             setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [favorites, household, craving, measurementSystem, dislikes]);

    const renderSingleMealFinder = () => (
        <>
            <p className="text-center text-stone-600 dark:text-stone-400 mb-8 text-lg">
                Get recipe ideas for a single meal based on what you have now.
            </p>
            <InputTabs activeMode={inputMode} onModeChange={setInputMode} />
            <div className="mt-6">
                {inputMode === 'text' ? (
                    <IngredientInput onSubmit={handleTextSubmit} isLoading={isLoading} />
                ) : (
                    <ImageInput onSubmit={handleImageSubmit} isLoading={isLoading} />
                )}
            </div>
            <div className="mt-12">
               {apiResponse && apiResponse.shoppingList.length > 0 && <ShoppingList items={apiResponse.shoppingList} />}
               <RecipeList
                    recipes={apiResponse?.recipes}
                    isLoading={isLoading}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
               />
            </div>
        </>
    );

    const renderWeekPlanner = () => (
        <>
            <p className="text-center text-stone-600 dark:text-stone-400 mb-8 text-lg">
                Plan a week of dinners! List ingredients and upload photos of your pantry.
            </p>
            <WeekPlannerInput
                onSubmit={handlePlannerSubmit}
                isLoading={isLoading}
                household={household}
                onHouseholdChange={handleHouseholdChange}
                craving={craving}
                onCravingChange={setCraving}
            />
            <div className="mt-12">
                <WeekPlanDisplay 
                    plan={weekPlanResponse}
                    isLoading={isLoading}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                />
            </div>
        </>
    );

    return (
        <div className="min-h-screen font-sans text-stone-800 dark:text-stone-200">
            <Header theme={theme} onThemeChange={setTheme} />
            <main className="container mx-auto p-4 max-w-4xl pb-32">
                <ModeSwitcher activeMode={appMode} onModeChange={handleModeChange} />
                
                <div className="text-center my-8">
                     <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-stone-300 dark:border-stone-600 font-semibold text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                     >
                        <CogIcon className="w-5 h-5 mr-2" />
                        Settings
                    </button>
                </div>

                <SettingsModal 
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    measurementSystem={measurementSystem}
                    onMeasurementChange={(value) => setMeasurementSystem(value as MeasurementSystem)}
                    dislikes={dislikes}
                    onDislikesChange={setDislikes}
                />

                {appMode === 'single' ? renderSingleMealFinder() : renderWeekPlanner()}

                {error && (
                    <div className="mt-8 text-center bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <FavoritesList favorites={favorites} onToggleFavorite={handleToggleFavorite} />
            </main>
        </div>
    );
};

export default App;