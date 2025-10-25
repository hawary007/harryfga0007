
import { GoogleGenAI } from "@google/genai";
import { Command, CommandId, UploadedFile } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn(
    "VITE_GEMINI_API_KEY environment variable not set. Please add it to your .env.local file.",
  );
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const fileToGenerativePart = async (file: UploadedFile) => {
  return {
    inlineData: {
      mimeType: file.type,
      data: file.content,
    },
  };
};

const MASTER_SYSTEM_PROMPT = `You are the FGA Omni-Assistant, a sophisticated AI specialized in U.S. Federal Government procurement. Your purpose is to assist federal government advisors and procurement specialists. You must be professional, analytical, and precise. Your outputs should be well-structured, clear, and ready for a professional business context. Do not use emojis. Respond in Markdown format.`;


const buildPrompt = async (command: Command, inputs: Record<string, string>, files: Record<string, UploadedFile>): Promise<any[]> => {
  let userPrompt = `Command: ${command.id}\n`;

  for (const key in inputs) {
    userPrompt += `${key}: ${inputs[key]}\n`;
  }
  
  const parts: any[] = [userPrompt];

  for (const key in files) {
      const file = files[key];
      const filePart = await fileToGenerativePart(file);
      const label = command.files?.find(f => f.id === key)?.label || 'Document';
      parts.unshift({text: `--- START ${label.toUpperCase()} ---\n`});
      parts.push({text: `\n--- END ${label.toUpperCase()} ---\n`});
      parts.splice(parts.length -1, 0, filePart);
  }

  let specificInstruction = '';
  switch (command.id) {
    case CommandId.KEYWORDS:
      specificInstruction = 'Based on the RFP document, generate a list of strategic keywords, separated into categories like "Technical Skills," "Compliance," "Key Personnel," and "Past Performance."';
      break;
    case CommandId.REVIEW:
      specificInstruction = 'Perform a detailed fit-gap analysis by comparing the Client Capability Statement against the RFP. Output in three sections: "Strengths," "Gaps," and "Strategic Recommendations." Be specific and cite sections where possible.';
      break;
    case CommandId.DRAFT:
      specificInstruction = `Using the RFP Analysis and Capability Statement, draft a formal, professional email to the specified client. The email should introduce the opportunity, highlight the strong fit, and suggest a meeting to discuss further. DO NOT use placeholders like "[Your Name]".`;
      break;
    case CommandId.ACTIVE_RFPS:
      specificInstruction = `Simulate a search on SAM.gov for active RFPs matching the keywords. Return a list of 3-5 fictional but realistic-looking RFP opportunities in a markdown table with columns for "Solicitation Number," "Title," "Agency," and "Response Date."`;
      break;
    case CommandId.FULL_ANALYSIS:
      specificInstruction = `This is a multi-step request. First, simulate a search for a relevant RFP based on the keywords. Second, using that simulated RFP, perform a fit-gap analysis against the provided Capability Statement. Third, draft a professional client email summarizing the opportunity and the fit. Structure your entire response with clear headings for each section: "Simulated RFP Opportunity," "Fit-Gap Analysis," and "Draft Client Email."`;
      break;
  }
  
  parts.push({ text: `\nInstruction: ${specificInstruction}` });
  return parts;
};

export const runCommand = async (
  command: Command,
  inputs: Record<string, string>,
  files: Record<string, UploadedFile>
): Promise<AsyncIterable<string>> => {

  if (!ai) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Set it in your environment to use this service.",
    );
  }

  const promptParts = await buildPrompt(command, inputs, files);
  
  const model = ai.models['gemini-2.5-flash'];
  
  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: promptParts }],
    config: {
        systemInstruction: MASTER_SYSTEM_PROMPT,
    }
  });

  const stream = (async function* () {
    for await (const chunk of result) {
      yield chunk.text;
    }
  })();

  return stream;
};
