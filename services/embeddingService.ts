import { GoogleGenAI } from '@google/genai';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;
if (!GOOGLE_API_KEY) {
  throw new Error('VITE_GOOGLE_API_KEY not set');
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const model = ai.embeddingModels['text-embedding-004'];
  const result = await model.embedContent(text);
  return result.data[0].values as number[];
};
