
import { GoogleGenAI } from "@google/genai";

export const getFlavorRecommendation = async (mood: string, weather: string) => {
  // Defensive check for API key
  if (!process.env.API_KEY) {
    console.warn("API Key missing, using fallback recommendation.");
    // This message is now less likely to be seen due to the App.tsx API key check
    return "AI guide requires API key selection. Please check your setup!";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); 

  try {
    // IMPORTANT: Create GoogleGenAI instance right before the API call
    // to ensure it uses the most up-to-date API_KEY from window.aistudio.openSelectKey()
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am at a home-based business in Singapore selling Air Batu Malaysia (flavored ice pops). 
      The customer's current mood is: ${mood}. 
      The current weather is: ${weather}. 
      Recommend ONE flavor from our menu (Watermelon, Brown Sugar Milk Tea, Hazelnut Coffee, Vanilla Blue, Bubblegum, Chocolate, Honeydew, Durian) that would suit this situation and give a nostalgic, 1-sentence 'Kampung' reason why it's the best choice. Mention that Sarsi is coming soon!`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    clearTimeout(timeoutId);

    if (!response || !response.text) {
      throw new Error("No text returned from Gemini");
    }

    return response.text;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Gemini Service Error:", error);
    
    // Check for 403 specifically to guide user on API key issues
    if (error.message && error.message.includes("403")) {
      throw new Error("Failed to call the Gemini API: permission denied. Please ensure your selected API key has access to 'gemini-3-flash-preview' and billing is enabled.");
    }
    
    const fallbacks = [
      "The kampung spirits recommend: A juicy Watermelon stick for these sunny vibes!",
      "Nostalgia is calling! How about a creamy Chocolate lolly today?",
      "Feeling lucky? Our Durian lollies are the talk of the neighborhood!",
      "Cool down with our signature Vanilla Blue – a childhood favorite!"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
