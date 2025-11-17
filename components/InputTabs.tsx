import React from 'react';
import type { InputMode } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { CameraIcon } from './icons/CameraIcon';

interface InputTabsProps {
    activeMode: InputMode;
    onModeChange: (mode: InputMode) => void;
}

const InputTabs: React.FC<InputTabsProps> = ({ activeMode, onModeChange }) => {
    const commonButtonClasses = "flex-1 flex items-center justify-center py-3 px-4 text-lg font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500";
    const activeButtonClasses = "bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-300 shadow-md";
    const inactiveButtonClasses = "bg-transparent text-stone-500 dark:text-stone-400 hover:bg-emerald-50 dark:hover:bg-stone-800";

    return (
        <div className="flex space-x-2 bg-stone-100 dark:bg-stone-800 p-2 rounded-xl max-w-md mx-auto border border-stone-200 dark:border-stone-700">
            <button
                onClick={() => onModeChange('text')}
                className={`${commonButtonClasses} ${activeMode === 'text' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={activeMode === 'text'}
            >
                <PencilIcon className="w-6 h-6 mr-2"/>
                List Ingredients
            </button>
            <button
                onClick={() => onModeChange('image')}
                className={`${commonButtonClasses} ${activeMode === 'image' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={activeMode === 'image'}
            >
                <CameraIcon className="w-6 h-6 mr-2"/>
                Use Photo
            </button>
        </div>
    );
};

export default InputTabs;