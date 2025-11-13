
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: "Name of the recipe." },
        description: { type: Type.STRING, description: "A short, enticing description of the dish." },
        difficulty: { type: Type.STRING, description: "Difficulty level: Easy, Medium, or Hard." },
        prepTimeMinutes: { type: Type.INTEGER, description: "Estimated preparation and cooking time in minutes." },
        calories: { type: Type.INTEGER, description: "Estimated calorie count per serving." },
        ingredients: {
            type: Type.ARRAY,
            description: "List of all ingredients required for the recipe.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING }
                },
                required: ["name", "quantity"]
            }
        },
        instructions: {
            type: Type.ARRAY,
            description: "Step-by-step cooking instructions.",
            items: { type: Type.STRING }
        },
        missingIngredients: {
            type: Type.ARRAY,
            description: "Essential ingredients likely needed but not identified in the fridge.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING }
                },
                required: ["name", "quantity"]
            }
        },
        dietaryTags: {
            type: Type.ARRAY,
            description: "Applicable dietary tags like Vegetarian, Keto, Gluten-Free, Vegan, Dairy-Free.",
            items: { type: Type.STRING }
        }
    },
    required: ["recipeName", "description", "difficulty", "prepTimeMinutes", "calories", "ingredients", "instructions", "missingIngredients", "dietaryTags"]
};

export const analyzeFridgeAndSuggestRecipes = async (imageBase64: string, dietaryRestrictions: string[]): Promise<Recipe[]> => {
    try {
        const dietaryPrompt = dietaryRestrictions.length > 0
            ? `The user has specified the following dietary restrictions: ${dietaryRestrictions.join(', ')}. Please ensure all suggested recipes adhere to these requirements.`
            : 'Consider a variety of dietary preferences.';

        const prompt = `
            Analyze the ingredients in this image of a refrigerator.
            Based on the visible ingredients, suggest 3-5 diverse recipes.
            ${dietaryPrompt}
            For each recipe, identify any essential ingredients that might be missing.
            Return the response as a JSON array of objects.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "A list of 3 to 5 recipe suggestions.",
                    items: recipeSchema
                }
            }
        });

        const jsonText = response.text.trim();
        const recipes = JSON.parse(jsonText);
        return recipes as Recipe[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get recipes from AI model.");
    }
};
