import { Command, UploadedFile } from '../types';

export const runCommand = async (
  command: Command,
  inputs: Record<string, string>,
  files: Record<string, UploadedFile>
): Promise<AsyncIterable<string>> => {
  const response = await fetch('/api/run-command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_AUTH_TOKEN ? { 'x-api-key': import.meta.env.VITE_AUTH_TOKEN } : {}),
    },
    body: JSON.stringify({ command, inputs, files }),
  });

  if (!response.body) {
    throw new Error('No response body received');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  const stream = (async function* () {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  })();

  return stream;
};
