import { GoogleGenAI, Type } from "@google/genai";
import type { ApiResponse, Recipe, WeekPlanResponse, Household } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const recipeObjectSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The title of the recipe." },
        description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
        ingredientsYouHave: {
            type: Type.ARRAY,
            description: "List of ingredients from the input that are used in this recipe.",
            items: { type: Type.STRING }
        },
        ingredientsToBuy: {
            type: Type.ARRAY,
            description: "List of ingredients required for the recipe that are not in the input list.",
            items: { type: Type.STRING }
        },
        instructions: {
            type: Type.ARRAY,
            description: "Step-by-step cooking instructions.",
            items: { type: Type.STRING }
        }
    },
    required: ['name', 'description', 'ingredientsYouHave', 'ingredientsToBuy', 'instructions']
};

const shoppingListSchema = {
    type: Type.ARRAY,
    description: "A consolidated list of all unique ingredients to buy, grouped by category (e.g., Produce, Dairy, Meat, Pantry).",
    items: {
        type: Type.OBJECT,
        properties: {
            category: { type: Type.STRING, description: "The category of the ingredients (e.g., 'Produce', 'Dairy & Eggs', 'Meat & Fish', 'Pantry Staples')." },
            items: {
                type: Type.ARRAY,
                description: "A list of ingredients in this category.",
                items: { type: Type.STRING }
            }
        },
        required: ['category', 'items']
    }
};

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipes: {
            type: Type.ARRAY,
            description: "A list of 3-5 recipe suggestions.",
            items: recipeObjectSchema
        },
        shoppingList: shoppingListSchema
    },
    required: ['recipes', 'shoppingList']
};

const weeklyPlanSchema = {
    type: Type.OBJECT,
    properties: {
        dailyPlan: {
            type: Type.ARRAY,
            description: "A 7-day meal plan, with one recipe per day.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "The day of the week (e.g., 'Monday')." },
                    recipe: recipeObjectSchema
                },
                required: ['day', 'recipe']
            }
        },
        shoppingList: shoppingListSchema
    },
    required: ['dailyPlan', 'shoppingList']
};


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const generateRecipes = async (prompt: string, imagePart?: any): Promise<ApiResponse> => {
    try {
        const contents = imagePart ? { parts: [imagePart, { text: prompt }] } : prompt;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        // Basic validation
        if (!data.recipes || !Array.isArray(data.recipes)) {
            throw new Error("Invalid response format from API: missing recipes array.");
        }
        if (!data.shoppingList || !Array.isArray(data.shoppingList)) {
            throw new Error("Invalid response format from API: missing shoppingList array.");
        }

        return data as ApiResponse;

    } catch (error) {
        console.error("Error generating recipes:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate recipes: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating recipes.");
    }
};

export const generateRecipesFromText = (ingredients: string, measurementSystem: 'imperial' | 'metric'): Promise<ApiResponse> => {
    const measurementInstruction = `All ingredient quantities in recipes and the shopping list must be in the ${measurementSystem} system.`;
    const prompt = `You are a helpful culinary assistant specializing in budget-friendly meals. Based on the following ingredients: ${ingredients}, suggest 3-5 delicious, easy-to-make, and low-cost recipes for lunch or dinner. For each recipe, list the ingredients I have, the ingredients I need to buy, and the step-by-step instructions. Also, provide a simple consolidated shopping list of all the items I need to buy, grouped by category (e.g., Produce, Dairy, Meat, Pantry Staples). ${measurementInstruction}`;
    return generateRecipes(prompt);
};

export const generateRecipesFromImage = async (image: File, measurementSystem: 'imperial' | 'metric'): Promise<ApiResponse> => {
    const measurementInstruction = `All ingredient quantities in recipes and the shopping list must be in the ${measurementSystem} system.`;
    const prompt = `You are a helpful culinary assistant specializing in budget-friendly meals. Analyze the attached image of the inside of a fridge and/or cupboard. Identify the available ingredients. Based on what you see, suggest 3-5 delicious, easy-to-make, and low-cost recipes for lunch or dinner. For each recipe, list the ingredients I have, the ingredients I need to buy, and the step-by-step instructions. Also, provide a simple consolidated shopping list of all the items I need to buy, grouped by category (e.g., Produce, Dairy, Meat, Pantry Staples). If the image is unclear, make your best guess or state that you cannot identify the ingredients clearly. ${measurementInstruction}`;
    const imagePart = await fileToGenerativePart(image);
    return generateRecipes(prompt, imagePart);
};


export const generateWeeklyPlan = async (ingredients: string, images: File[], favorites: Recipe[], household: Household, craving: string, measurementSystem: 'imperial' | 'metric'): Promise<WeekPlanResponse> => {
    const favoriteNames = favorites.map(f => f.name).join(', ');
    const householdDescription = `The household consists of ${household.adults} adult(s), ${household.teens} teen(s), and ${household.toddlers} toddler(s). Teens generally eat adult-sized portions, while toddlers eat much smaller portions.`;
    const measurementInstruction = `All ingredient quantities in recipes and the shopping list must be in the ${measurementSystem} system.`;

    const prompt = `You are an expert meal planner helping users create a budget-friendly 7-day dinner plan.
    
    Here is the context:
    1.  **Household Size:** ${householdDescription} **This is a critical instruction. All ingredient quantities for recipes AND the final shopping list MUST be adjusted to feed this number of people accurately.**
    2.  **Measurement System:** ${measurementInstruction} **This is also a critical instruction. Ensure all units are correct.**
    3.  **Available Ingredients (from text):** ${ingredients || 'None listed.'}
    4.  **Available Ingredients (from images):** Analyze the attached images of the user's fridge and pantry to identify more ingredients.
    5.  **User's Favorite Recipes:** ${favoriteNames || 'None listed.'} Please try to incorporate one or two of these favorites into the plan if they are a good fit with the available ingredients.
    6.  **User's Craving:** "${craving || 'None specified.'}" If the user has specified a craving, please include at least one meal in the weekly plan that satisfies it (e.g., if they crave "pasta", include a pasta dish).

    Your task:
    - Create a 7-day dinner plan with a unique, delicious, and easy-to-make recipe for each day.
    - For each recipe, detail the ingredients the user has and what they need to buy. **Ensure the ingredient amounts are scaled for the specified household size and are in the requested measurement system.**
    - Provide a single, consolidated shopping list for the entire week, containing all unique ingredients the user needs to buy. Group this list by category. **Ensure the shopping list quantities are also scaled and in the correct measurement system.**
    - Ensure the plan is varied and cost-effective.`;

    try {
        const imageParts = await Promise.all(images.map(fileToGenerativePart));
        const contents = { parts: [...imageParts, { text: prompt }] };
        
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: weeklyPlanSchema,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        if (!data.dailyPlan || !Array.isArray(data.dailyPlan)) {
            throw new Error("Invalid response format from API: missing dailyPlan array.");
        }
         if (!data.shoppingList || !Array.isArray(data.shoppingList)) {
            throw new Error("Invalid response format from API: missing shoppingList array.");
        }

        return data as WeekPlanResponse;

    } catch (error) {
        console.error("Error generating weekly plan:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate week plan: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the week plan.");
    }
};