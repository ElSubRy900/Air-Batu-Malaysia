import { GoogleGenAI } from "@google/genai";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getFlavorRecommendation = async (mood: string, weather: string, timeContext: string, retries = 3) => {
  // Use API key from process.env as per SDK instructions
  if (!process.env.API_KEY) {
    console.warn("Gemini: API Key missing");
    return "The spirits suggest a cooling Watermelon treat for today!";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Current mood: ${mood}. Weather: ${weather}. Time of day: ${timeContext}. 
        Recommend ONE flavor from our menu: (Watermelon, Brown Sugar Milk Tea, Hazelnut Coffee, Vanilla Blue, Bubblegum, Chocolate, Honeydew, Durian).`,
        config: {
          systemInstruction: `You are a nostalgic AI assistant for 'Air Batu / Ice Lollies Sg'. 
          Rules:
          1. Write exactly 2 short sentences.
          2. If it's Hot/Sunny, suggest Watermelon or Honeydew.
          3. If it's Cloudy/Raining, suggest Chocolate or Hazelnut Coffee.
          4. If it's Late at Night, suggest Vanilla Blue (dreamy vibes).
          5. Use a nostalgic tone, mentioning childhood memories like playing in the sun or 'lepak' with friends.
          6. Use Malaysian words like 'Shiok', 'Mantap', or 'Panas Terik' appropriately.`,
        }
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error: any) {
      console.error(`Gemini Attempt ${i + 1} failed:`, error);
      
      // If we have retries left, wait and try again
      if (i < retries) {
        const delay = 1000 * (i + 1); // Linear backoff: 1s, 2s, 3s
        await sleep(delay);
        continue;
      }
    }
  }

  // Final fallback if all retries fail
  return "Panas terik today! Grab a cooling Watermelon stick, just like when we used to lepak after school. Shiok!";
};