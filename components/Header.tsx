import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import ThemeSwitcher from './ThemeSwitcher';
import type { Theme } from '../types';

interface HeaderProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
    return (
        <header className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 shadow-md mb-8">
            <div className="container mx-auto flex items-center justify-center text-white relative">
                <div className="flex items-center">
                    <SparklesIcon className="w-10 h-10 mr-4" />
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Culinary Companion</h1>
                        <p className="text-emerald-100">Your AI-Powered Recipe Helper</p>
                    </div>
                </div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
                </div>
            </div>
        </header>
    );
};

export default Header;