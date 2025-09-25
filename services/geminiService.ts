
import { GoogleGenAI, Type } from "@google/genai";
import { MedicationInfo } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    uses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Common uses for the medication.",
    },
    sideEffects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Common side effects of the medication.",
    },
  },
  required: ["uses", "sideEffects"],
};

export async function fetchMedicationInfo(medicationName: string): Promise<MedicationInfo> {
  try {
    const prompt = `Provide a brief, patient-friendly summary for the medication "${medicationName}". Include its common uses and potential common side effects.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as MedicationInfo;

  } catch (error) {
    console.error("Error fetching medication info from Gemini API:", error);
    throw new Error("Could not retrieve medication information. Please check the drug name or try again later.");
  }
}
