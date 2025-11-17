import React, { useState, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ImageInputProps {
    onSubmit: (imageFile: File) => void;
    isLoading: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onSubmit, isLoading }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageFile) {
            onSubmit(imageFile);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800/50 p-6 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 text-center">
            <label htmlFor="image-upload" className="block text-lg font-medium text-stone-700 dark:text-stone-300 mb-4">
                Upload a photo of your ingredients
            </label>
            <input
                type="file"
                id="image-upload"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
            />
             <div 
                onClick={triggerFileSelect} 
                className={`relative w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors ${previewUrl ? 'border-emerald-300 dark:border-emerald-700' : 'border-stone-300 dark:border-stone-600'}`}
             >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="text-stone-500 dark:text-stone-400">
                        <CameraIcon className="w-16 h-16 mx-auto mb-2 text-stone-400 dark:text-stone-500" />
                        <p className="font-semibold">Click to upload an image</p>
                        <p className="text-sm">PNG, JPG, or WEBP</p>
                    </div>
                )}
            </div>
            
            <button
                type="submit"
                disabled={isLoading || !imageFile}
                className="mt-6 w-full flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-stone-400 dark:disabled:bg-stone-600 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-md disabled:shadow-none"
            >
                <SparklesIcon className="w-6 h-6 mr-2" />
                {isLoading ? 'Analyzing...' : 'Generate Recipes from Photo'}
            </button>
        </form>
    );
};

export default ImageInput;