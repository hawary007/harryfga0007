import axios from 'axios';
import { Command, CommandId, UploadedFile } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
if (!OPENROUTER_API_KEY) {
  throw new Error('VITE_OPENROUTER_API_KEY not set');
}

const MASTER_SYSTEM_PROMPT = `You are the FGA Omni-Assistant, a sophisticated AI specialized in U.S. Federal Government procurement. Your purpose is to assist federal government advisors and procurement specialists. You must be professional, analytical, and precise. Your outputs should be well-structured, clear, and ready for a professional business context. Do not use emojis. Respond in Markdown format.`;

const buildPrompt = (
  command: Command,
  inputs: Record<string, string>,
  files: Record<string, UploadedFile>
): string => {
  let userPrompt = `Command: ${command.id}\n`;

  for (const key in inputs) {
    userPrompt += `${key}: ${inputs[key]}\n`;
  }

  for (const key in files) {
    const file = files[key];
    const label = command.files?.find(f => f.id === key)?.label || 'Document';
    const content = globalThis.atob(file.content);
    userPrompt += `\n--- START ${label.toUpperCase()} ---\n${content}\n--- END ${label.toUpperCase()} ---\n`;
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
      specificInstruction = 'Using the RFP Analysis and Capability Statement, draft a formal, professional email to the specified client. The email should introduce the opportunity, highlight the strong fit, and suggest a meeting to discuss further. DO NOT use placeholders like "[Your Name]".';
      break;
    case CommandId.ACTIVE_RFPS:
      specificInstruction = 'Simulate a search on SAM.gov for active RFPs matching the keywords. Return a list of 3-5 fictional but realistic-looking RFP opportunities in a markdown table with columns for "Solicitation Number," "Title," "Agency," and "Response Date."';
      break;
    case CommandId.FULL_ANALYSIS:
      specificInstruction = 'This is a multi-step request. First, simulate a search for a relevant RFP based on the keywords. Second, using that simulated RFP, perform a fit-gap analysis against the provided Capability Statement. Third, draft a professional client email summarizing the opportunity and the fit. Structure your entire response with clear headings for each section: "Simulated RFP Opportunity," "Fit-Gap Analysis," and "Draft Client Email."';
      break;
  }

  userPrompt += `\nInstruction: ${specificInstruction}`;
  return userPrompt;
};

export const runCommand = async (
  command: Command,
  inputs: Record<string, string>,
  files: Record<string, UploadedFile>
): Promise<AsyncIterable<string>> => {
  const prompt = buildPrompt(command, inputs, files);

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: MASTER_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const text = response.data.choices?.[0]?.message?.content || '';
  return (async function* () {
    yield text;
  })();
};
