import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultPanel } from './components/ResultPanel';
import { CommandId, Command, UploadedFile } from './types';
import { COMMANDS } from './constants';
import { runCommand } from './services/openRouterService';

interface MainAppPageProps {
  onLogout?: () => void;
}

const MainAppPage: React.FC<MainAppPageProps> = ({ onLogout }) => {
  const [activeCommandId, setActiveCommandId] = useState<CommandId>(CommandId.KEYWORDS);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, UploadedFile>>({});
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeCommand = COMMANDS.find(cmd => cmd.id === activeCommandId) as Command;

  const handleCommandSelect = (commandId: CommandId) => {
    setActiveCommandId(commandId);
    setInputs({});
    setFiles({});
    setResult('');
    setError(null);
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (id: string, file: UploadedFile | null) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      if (file) {
        newFiles[id] = file;
      } else {
        delete newFiles[id];
      }
      return newFiles;
    });
  };

  const isExecuteDisabled = () => {
    if (isLoading) return true;
    const textInputsValid = activeCommand.inputs?.every(input => inputs[input.id]?.trim()) ?? true;
    const fileInputsValid = activeCommand.files?.every(file => files[file.id]) ?? true;
    return !textInputsValid || !fileInputsValid;
  };

  const handleExecute = useCallback(async () => {
    if (isExecuteDisabled()) return;

    setIsLoading(true);
    setResult('');
    setError(null);

    try {
      const stream = await runCommand(activeCommand, inputs, files);
      for await (const chunk of stream) {
        setResult(prev => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCommand, inputs, files]);

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header onLogout={onLogout} />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-hidden">
        <div className="md:col-span-5 lg:col-span-4 h-full overflow-y-auto pr-2">
          <InputPanel
            activeCommand={activeCommand}
            onCommandSelect={handleCommandSelect}
            inputs={inputs}
            onInputChange={handleInputChange}
            files={files}
            onFileChange={handleFileChange}
            onExecute={handleExecute}
            isExecuteDisabled={isExecuteDisabled()}
            isLoading={isLoading}
          />
        </div>
        <div className="md:col-span-7 lg:col-span-8 h-full">
          <ResultPanel result={result} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default MainAppPage;
