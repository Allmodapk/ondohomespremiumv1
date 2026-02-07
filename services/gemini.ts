
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Image Analysis for Property Description
export const analyzePropertyImage = async (base64Image: string): Promise<{ title: string; description: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this house photo. Provide a catchy 'title' and a detailed, high-end 3-sentence 'description' for a real estate listing. Return in JSON format." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });
    // Correctly using .text property
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return { title: "", description: "" };
  }
};

// Maps Grounding for Property Search
export const searchNearbyLocations = async (query: string, location: { lat: number, lng: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find real estate properties or popular residential localities for rent near ${query}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      },
    });
    // Correctly using .text property
    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Search Error:", error);
    return null;
  }
};

// AI Chatbot for Ondo Homes
export const ondoAssistant = async (message: string, history: any[] = []) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are OndoBot, the official assistant for ONDO HOMES. We are a zero-brokerage platform connecting owners and tenants directly. Help users find properties, explain our Silver/Gold memberships, and answer real estate queries. Be professional, friendly, and concise.",
      }
    });
    const response = await chat.sendMessage({ message });
    // Correctly using .text property
    return response.text;
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again!";
  }
};

// Broker Detection Intelligence
export const detectBrokerPatterns = async (profileData: string): Promise<{ isBroker: boolean, confidence: number, reasoning: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this user profile behavior and data for ONDO HOMES. We only allow direct owners and tenants. Look for patterns typical of brokers (multiple listings, professional agent language, agency names). Profile Data: ${profileData}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isBroker: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["isBroker", "confidence", "reasoning"]
        }
      }
    });
    // Correctly using .text property
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { isBroker: false, confidence: 0, reasoning: "" };
  }
};

/**
 * Generates a premium property description based on provided details.
 * Fixes the missing export error in ListingFormView.tsx
 */
export const generateDescription = async (details: {
  type: string;
  bhk: string;
  furnishing: string;
  area: string;
  rent: string;
  title: string;
}): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a premium, enticing 3-sentence property description for a real estate listing. 
      Title: ${details.title}
      Property Type: ${details.bhk} ${details.type}
      Furnishing: ${details.furnishing}ly furnished
      Area: ${details.area} sq ft
      Expected Rent: ₹${details.rent}
      Emphasis: Direct deal, Zero Brokerage, high-end living environment on ONDO HOMES.`,
    });
    // Correctly using .text property
    return response.text || "Discover a sophisticated lifestyle in this premium property, offering unparalleled comfort and modern amenities with the exclusive benefit of zero brokerage through ONDO HOMES.";
  } catch (error) {
    console.error("Description Generation Error:", error);
    return "Experience luxury living in this beautifully maintained property, offering modern amenities and direct owner connectivity with zero brokerage fees.";
  }
};
