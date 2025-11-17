import React from 'react';

interface SettingsToggleProps {
    label: string;
    option1: string;
    option2: string;
    value: string;
    onChange: (newValue: string) => void;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, option1, option2, value, onChange }) => {
    const isOption1 = value === option1.toLowerCase();
    
    return (
        <div className="flex items-center justify-between w-full">
            <label className="text-stone-600 dark:text-stone-400 font-medium">{label}</label>
            <div className="flex items-center p-1 rounded-full bg-stone-200 dark:bg-stone-700">
                <button
                    onClick={() => onChange(option1.toLowerCase())}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                        isOption1 ? 'bg-white dark:bg-stone-500 text-emerald-700 dark:text-white' : 'text-stone-500 dark:text-stone-400'
                    }`}
                >
                    {option1}
                </button>
                <button
                    onClick={() => onChange(option2.toLowerCase())}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                        !isOption1 ? 'bg-white dark:bg-stone-500 text-emerald-700 dark:text-white' : 'text-stone-500 dark:text-stone-400'
                    }`}
                >
                    {option2}
                </button>
            </div>
        </div>
    );
};

export default SettingsToggle;
