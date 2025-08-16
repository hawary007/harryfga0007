
import { Command, CommandId } from './types';

export const COMMANDS: Command[] = [
  {
    id: CommandId.KEYWORDS,
    name: 'Keywords',
    description: 'Analyze an RFP document to extract strategic keywords for a bid proposal.',
    inputs: [
      { id: 'topic', label: 'Primary Topic/Domain', placeholder: 'e.g., Cybersecurity, Cloud Migration', type: 'text' },
    ],
    files: [
      { id: 'rfp', label: 'RFP/RFQ Document', accept: ['.txt', '.md'] },
    ],
  },
  {
    id: CommandId.REVIEW,
    name: 'Fit-Gap Review',
    description: 'Review a client\'s Capability Statement against an RFP to identify strengths and gaps.',
    files: [
      { id: 'capability_statement', label: 'Client Capability Statement', accept: ['.txt', '.md'] },
      { id: 'rfp', label: 'RFP/RFQ Document', accept: ['.txt', '.md'] },
    ],
  },
  {
    id: CommandId.DRAFT,
    name: 'Draft Client Email',
    description: 'Draft a professional email to a client about a potential RFP opportunity.',
    inputs: [
      { id: 'client_name', label: 'Client Name', placeholder: 'e.g., ACME Corp', type: 'text' },
    ],
    files: [
      { id: 'capability_statement', label: 'Client Capability Statement', accept: ['.txt', '.md'] },
      { id: 'rfp', label: 'RFP/RFQ Analysis', accept: ['.txt', '.md'] },
    ],
  },
  {
    id: CommandId.ACTIVE_RFPS,
    name: 'Search Active RFPs',
    description: 'Search for active RFPs on SAM.gov using specific keywords. (Simulated)',
    inputs: [
      { id: 'keywords', label: 'Search Keywords', placeholder: 'e.g., "IT services" "data analysis"', type: 'text' },
      { id: 'sam_api_key', label: 'SAM.gov API Key', placeholder: 'Enter your SAM.gov API key (for simulation)', type: 'text' },
    ],
  },
  {
    id: CommandId.FULL_ANALYSIS,
    name: 'Full Opportunity Analysis',
    description: 'A complete workflow: search RFPs, perform a fit-gap review, and draft a client email.',
    inputs: [
        { id: 'client_name', label: 'Client Name', placeholder: 'e.g., ACME Corp', type: 'text' },
        { id: 'keywords', label: 'RFP Search Keywords', placeholder: 'e.g., "DevSecOps" "cloud"', type: 'text' },
    ],
    files: [
      { id: 'capability_statement', label: 'Client Capability Statement', accept: ['.txt', '.md'] },
    ],
  },
];
