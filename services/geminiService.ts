import { GoogleGenAI } from "@google/genai";

export const getFlavorRecommendation = async (mood: string, weather: string, timeContext: string) => {
  // Use API key from process.env as per SDK instructions
  if (!process.env.API_KEY) {
    console.warn("Gemini: API Key missing");
    return "The spirits suggest a cooling Watermelon treat for today!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current mood: ${mood}. Weather: ${weather}. Time of day: ${timeContext}. 
      Recommend ONE flavor from our menu: (Watermelon, Brown Sugar Milk Tea, Hazelnut Coffee, Vanilla Blue, Bubblegum, Chocolate, Honeydew, Durian).`,
      config: {
        systemInstruction: `You are a nostalgic AI assistant for 'Air Batu Malaysia'. 
        Rules:
        1. Write exactly 2 short sentences.
        2. If it's Hot/Sunny, suggest Watermelon or Honeydew.
        3. If it's Cloudy/Raining, suggest Chocolate or Hazelnut Coffee.
        4. If it's Late at Night, suggest Vanilla Blue (dreamy vibes).
        5. Use a nostalgic tone, mentioning childhood memories like playing in the sun or 'lepak' with friends.
        6. Use Malaysian words like 'Shiok', 'Mantap', or 'Panas Terik' appropriately.`,
      }
    });

    return response.text || "Watermelon is always a classic choice!";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Cool down with our signature Vanilla Blue – a childhood favorite!";
  }
};