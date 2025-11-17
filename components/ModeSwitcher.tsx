import React from 'react';
import type { AppMode } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ModeSwitcherProps {
    activeMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ activeMode, onModeChange }) => {
    const commonButtonClasses = "flex-1 flex items-center justify-center py-3 px-4 text-lg font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500";
    const activeButtonClasses = "bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-300 shadow-md";
    const inactiveButtonClasses = "bg-transparent text-stone-500 dark:text-stone-400 hover:bg-emerald-50 dark:hover:bg-stone-800";

    return (
        <div className="flex space-x-2 bg-stone-100 dark:bg-stone-800 p-2 rounded-xl max-w-lg mx-auto border border-stone-200 dark:border-stone-700 mb-8">
            <button
                onClick={() => onModeChange('single')}
                className={`${commonButtonClasses} ${activeMode === 'single' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={activeMode === 'single'}
            >
                <DocumentIcon className="w-6 h-6 mr-2"/>
                Single Meal Finder
            </button>
            <button
                onClick={() => onModeChange('planner')}
                className={`${commonButtonClasses} ${activeMode === 'planner' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={activeMode === 'planner'}
            >
                <CalendarIcon className="w-6 h-6 mr-2"/>
                Week Planner
            </button>
        </div>
    );
};

export default ModeSwitcher;