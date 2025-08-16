
import React from 'react';
import { Command, CommandId, UploadedFile } from '../types';
import { COMMANDS } from '../constants';
import { CommandTabs } from './CommandTabs';
import { FileUpload } from './FileUpload';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';

interface InputPanelProps {
  activeCommand: Command;
  onCommandSelect: (commandId: CommandId) => void;
  inputs: Record<string, string>;
  onInputChange: (id: string, value: string) => void;
  files: Record<string, UploadedFile>;
  onFileChange: (id: string, file: UploadedFile | null) => void;
  onExecute: () => void;
  isExecuteDisabled: boolean;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  activeCommand,
  onCommandSelect,
  inputs,
  onInputChange,
  files,
  onFileChange,
  onExecute,
  isExecuteDisabled,
  isLoading,
}) => {
  return (
    <div className="bg-brand-gray-800 rounded-lg p-4 flex flex-col gap-6 h-full border border-brand-gray-700">
      <div>
        <h2 className="text-lg font-semibold mb-3 text-brand-gray-200">Select Command</h2>
        <CommandTabs
          commands={COMMANDS}
          activeCommandId={activeCommand.id}
          onSelect={onCommandSelect}
        />
      </div>

      <div className="flex-grow flex flex-col gap-6">
        <p className="text-brand-gray-400 text-sm">{activeCommand.description}</p>
        
        {activeCommand.inputs && activeCommand.inputs.map(input => (
          <div key={input.id}>
            <label htmlFor={input.id} className="block text-sm font-medium text-brand-gray-300 mb-1">
              {input.label}
            </label>
            {input.type === 'textarea' ? (
              <textarea
                id={input.id}
                rows={3}
                className="w-full bg-brand-gray-900 border border-brand-gray-600 rounded-md p-2 text-sm text-brand-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition"
                placeholder={input.placeholder}
                value={inputs[input.id] || ''}
                onChange={(e) => onInputChange(input.id, e.target.value)}
              />
            ) : (
              <input
                type="text"
                id={input.id}
                className="w-full bg-brand-gray-900 border border-brand-gray-600 rounded-md p-2 text-sm text-brand-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition"
                placeholder={input.placeholder}
                value={inputs[input.id] || ''}
                onChange={(e) => onInputChange(input.id, e.target.value)}
              />
            )}
          </div>
        ))}

        {activeCommand.files && activeCommand.files.map(file => (
          <div key={file.id}>
            <label className="block text-sm font-medium text-brand-gray-300 mb-1">
              {file.label}
            </label>
            <FileUpload
              id={file.id}
              accept={file.accept}
              file={files[file.id] || null}
              onFileChange={onFileChange}
            />
          </div>
        ))}
      </div>
      
      <div className="flex-shrink-0 mt-auto">
        <button
          onClick={onExecute}
          disabled={isExecuteDisabled}
          className="w-full flex justify-center items-center bg-brand-blue hover:bg-brand-blue-light disabled:bg-brand-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
        >
          {isLoading ? <LoadingSpinnerIcon /> : 'Execute'}
        </button>
      </div>
    </div>
  );
};
