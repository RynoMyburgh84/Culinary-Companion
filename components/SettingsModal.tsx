import React, { useEffect, useRef } from 'react';
import type { MeasurementSystem } from '../types';
import SettingsToggle from './SettingsToggle';
import { XMarkIcon } from './icons/XMarkIcon';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    measurementSystem: MeasurementSystem;
    onMeasurementChange: (value: string) => void;
    dislikes: string;
    onDislikesChange: (value: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, measurementSystem, onMeasurementChange, dislikes, onDislikesChange }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200">Settings</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Close settings"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <SettingsToggle
                        label="Measurement System"
                        option1="Imperial"
                        option2="Metric"
                        value={measurementSystem}
                        onChange={onMeasurementChange}
                    />

                    <div>
                        <label htmlFor="dislikes-input" className="block text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
                            Disliked Foods or Ingredients (Optional)
                        </label>
                        <textarea
                            id="dislikes-input"
                            value={dislikes}
                            onChange={(e) => onDislikesChange(e.target.value)}
                            placeholder="e.g., mushrooms, cilantro, olives"
                            className="w-full h-24 p-3 bg-stone-50 dark:bg-stone-700/50 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-800 dark:text-stone-200 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                        />
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                            Separate items with commas. Recipes will avoid these ingredients.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <button
                        onClick={onClose}
                        className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md"
                    >
                        Done
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fadeInScale {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SettingsModal;
