
export enum CommandId {
  KEYWORDS = '/keywords',
  REVIEW = '/review',
  DRAFT = '/draft',
  ACTIVE_RFPS = '/active_rfps',
  FULL_ANALYSIS = '/full_opportunity_analysis',
}

export interface CommandInput {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
}

export interface CommandFile {
  id: string;
  label: string;
  accept: string[]; // e.g., ['.txt', '.pdf']
}

export interface Command {
  id: CommandId;
  name: string;
  description: string;
  inputs?: CommandInput[];
  files?: CommandFile[];
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string; // Base64 encoded content
}
