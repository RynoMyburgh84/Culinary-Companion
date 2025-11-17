export interface Recipe {
  name: string;
  description: string;
  ingredientsYouHave: string[];
  ingredientsToBuy: string[];
  instructions: string[];
}

export interface ShoppingListCategory {
  category: string;
  items: string[];
}

export interface ApiResponse {
  recipes: Recipe[];
  shoppingList: ShoppingListCategory[];
}

export interface DailyPlanItem {
    day: string;
    recipe: Recipe;
}

export interface WeekPlanResponse {
    dailyPlan: DailyPlanItem[];
    shoppingList: ShoppingListCategory[];
}

export interface Household {
  adults: number;
  teens: number;
  toddlers: number;
}

export type InputMode = 'text' | 'image';
export type AppMode = 'single' | 'planner';
export type Theme = 'light' | 'dark' | 'system';
export type MeasurementSystem = 'imperial' | 'metric';