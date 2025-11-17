import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ComputerDesktopIcon } from './icons/ComputerDesktopIcon';
import type { Theme } from '../types';

interface ThemeSwitcherProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const options: { name: Theme; icon: React.ReactNode }[] = [
    { name: 'light', icon: <SunIcon className="w-5 h-5" /> },
    { name: 'dark', icon: <MoonIcon className="w-5 h-5" /> },
    { name: 'system', icon: <ComputerDesktopIcon className="w-5 h-5" /> },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onThemeChange }) => {
    return (
        <div className="flex items-center p-1 rounded-full bg-black/20 text-white">
            {options.map((option) => (
                <button
                    key={option.name}
                    onClick={() => onThemeChange(option.name)}
                    className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        theme === option.name ? 'bg-white/30' : 'hover:bg-white/10'
                    }`}
                    aria-label={`Switch to ${option.name} theme`}
                    title={`Switch to ${option.name} theme`}
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
