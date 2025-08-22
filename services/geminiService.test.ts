import { describe, it, expect } from 'vitest';
import { buildPrompt } from './geminiService';
import { CommandId, Command, UploadedFile } from '../types';

describe('buildPrompt', () => {
  it('orders multiple file parts with start and end markers', async () => {
    const command: Command = {
      id: CommandId.REVIEW,
      name: 'Review',
      description: '',
      files: [
        { id: 'rfp', label: 'RFP', accept: ['.txt'] },
        { id: 'cs', label: 'Capability Statement', accept: ['.txt'] },
      ],
    };

    const files: Record<string, UploadedFile> = {
      rfp: { name: 'rfp.txt', type: 'text/plain', size: 1, content: 'RFP_CONTENT' },
      cs: { name: 'cs.txt', type: 'text/plain', size: 1, content: 'CS_CONTENT' },
    };

    const parts = await buildPrompt(command, {}, files);

    expect(parts[0]).toBe(`Command: ${command.id}\n`);
    expect(parts[1]).toEqual({ text: '--- START RFP ---\n' });
    expect(parts[2]).toEqual({ inlineData: { mimeType: 'text/plain', data: 'RFP_CONTENT' } });
    expect(parts[3]).toEqual({ text: '\n--- END RFP ---\n' });
    expect(parts[4]).toEqual({ text: '--- START CAPABILITY STATEMENT ---\n' });
    expect(parts[5]).toEqual({ inlineData: { mimeType: 'text/plain', data: 'CS_CONTENT' } });
    expect(parts[6]).toEqual({ text: '\n--- END CAPABILITY STATEMENT ---\n' });
    expect(parts[parts.length - 1].text.startsWith('\nInstruction:')).toBe(true);
  });
});
