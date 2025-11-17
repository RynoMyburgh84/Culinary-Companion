import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CameraIcon } from './icons/CameraIcon';
import type { Household } from '../types';
import { UserIcon } from './icons/UserIcon';
import { ChildIcon } from './icons/ChildIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface WeekPlannerInputProps {
    onSubmit: (ingredients: string, images: File[]) => void;
    isLoading: boolean;
    household: Household;
    onHouseholdChange: (household: Household) => void;
    craving: string;
    onCravingChange: (craving: string) => void;
}

const HouseholdCounter: React.FC<{
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    icon: React.ReactNode;
}> = ({ label, value, onChange, icon }) => {
    const handleChange = (delta: number) => {
        const newValue = Math.max(0, value + delta);
        onChange(newValue);
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-400">
                {icon}
                <label id={`${label}-label`} className="font-medium">{label}</label>
            </div>
            <div className="flex items-center space-x-3">
                <button type="button" onClick={() => handleChange(-1)} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors font-bold text-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label={`Decrease ${label}`}>-</button>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 w-8 text-center" role="status" aria-live="polite" aria-labelledby={`${label}-label`}>{value}</span>
                <button type="button" onClick={() => handleChange(1)} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors font-bold text-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label={`Increase ${label}`}>+</button>
            </div>
        </div>
    );
};


const WeekPlannerInput: React.FC<WeekPlannerInputProps> = ({ onSubmit, isLoading, household, onHouseholdChange, craving, onCravingChange }) => {
    const [ingredients, setIngredients] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Cleanup function to revoke object URLs on component unmount
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? [...e.target.files] : [];
        if (files.length > 0) {
            // Revoke old URLs to prevent memory leaks
            previewUrls.forEach(url => URL.revokeObjectURL(url));
            
            setImageFiles(files);
            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(ingredients, imageFiles);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };
    
    const handleHouseholdValueChange = (field: keyof Household, value: number) => {
        onHouseholdChange({ ...household, [field]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800/50 p-6 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="mb-6 pb-6 border-b border-stone-200 dark:border-stone-700">
                 <h2 id="household-size-label" className="block text-lg font-medium text-stone-700 dark:text-stone-300 mb-4 text-center">
                    Household Size
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4" role="group" aria-labelledby="household-size-label">
                     <HouseholdCounter
                        label="Adults"
                        value={household.adults}
                        onChange={(value) => handleHouseholdValueChange('adults', value)}
                        icon={<UserIcon className="w-6 h-6" />}
                    />
                    <HouseholdCounter
                        label="Teens"
                        value={household.teens}
                        onChange={(value) => handleHouseholdValueChange('teens', value)}
                        icon={<UserIcon className="w-6 h-6" />}
                    />
                    <HouseholdCounter
                        label="Toddlers"
                        value={household.toddlers}
                        onChange={(value) => handleHouseholdValueChange('toddlers', value)}
                        icon={<ChildIcon className="w-6 h-6" />}
                    />
                </div>
                 <p className="text-sm text-stone-500 dark:text-stone-400 mt-4 text-center">Your weekly plan will be scaled for this household size.</p>
            </div>
            
            <div className="mb-6 space-y-6">
                <div>
                    <label htmlFor="craving-input" className="flex items-center text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
                       <LightbulbIcon className="w-6 h-6 mr-2 text-amber-500" />
                        Any Cravings this Week? (Optional)
                    </label>
                    <input
                        id="craving-input"
                        type="text"
                        value={craving}
                        onChange={(e) => onCravingChange(e.target.value)}
                        placeholder="e.g., something with pasta, a steak dinner..."
                        className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-800 dark:text-stone-200 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="ingredients-planner" className="block text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
                        What ingredients do you have? (Optional)
                    </label>
                    <textarea
                        id="ingredients-planner"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g., chicken breast, rice, broccoli, soy sauce"
                        className="w-full h-24 p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-800 dark:text-stone-200 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                        disabled={isLoading}
                    />
                     <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">List any ingredients you have on hand.</p>
                </div>
            </div>


            <div className="pt-6 border-t border-stone-200 dark:border-stone-700">
                <label className="block text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Upload photos of your pantry/fridge (Optional)
                </label>
                <input
                    type="file"
                    id="image-upload-planner"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                />
                <div 
                    onClick={triggerFileSelect} 
                    className={`relative w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors ${previewUrls.length > 0 ? 'border-emerald-300 dark:border-emerald-700' : 'border-stone-300 dark:border-stone-600'}`}
                >
                    {previewUrls.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {previewUrls.map((url, index) => (
                                <img key={index} src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-stone-500 dark:text-stone-400 text-center">
                            <CameraIcon className="w-12 h-12 mx-auto mb-2 text-stone-400 dark:text-stone-500" />
                            <p className="font-semibold">Click to upload multiple images</p>
                            <p className="text-sm">Take pictures of your fridge, pantry, etc.</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || (!ingredients.trim() && imageFiles.length === 0)}
                className="mt-6 w-full flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-stone-400 dark:disabled:bg-stone-600 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-md disabled:shadow-none"
            >
                <SparklesIcon className="w-6 h-6 mr-2" />
                {isLoading ? 'Planning your week...' : 'Generate Weekly Plan'}
            </button>
        </form>
    );
};

export default WeekPlannerInput;