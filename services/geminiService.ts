
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables.
// Do not hardcode the key or ask the user for it.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real application, you might want to handle this more gracefully,
  // but for this context, we'll throw an error to make it clear.
  console.error("Gemini API key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Summarizes a given text using the Gemini API.
 * @param text The text to summarize.
 * @returns A promise that resolves to the summarized text.
 */
export const summarizeText = async (text: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key not configured.";
  }
  if (!text || text.trim().length === 0) {
    return "No text to summarize.";
  }

  try {
    const prompt = `以下の業務承認に関するコメントを、要点を押さえて簡潔に要約してください。:\n\n---\n${text}\n---`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            temperature: 0.2,
            topP: 0.9,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a user-friendly error message
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "AI要約エラー: APIキーが無効です。";
        }
    }
    return "AIによる要約中にエラーが発生しました。";
  }
};
