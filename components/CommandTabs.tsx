
import React from 'react';
import { Command, CommandId } from '../types';

interface CommandTabsProps {
  commands: Command[];
  activeCommandId: CommandId;
  onSelect: (commandId: CommandId) => void;
}

export const CommandTabs: React.FC<CommandTabsProps> = ({ commands, activeCommandId, onSelect }) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2">
        {commands.map(command => (
          <button
            key={command.id}
            onClick={() => onSelect(command.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 whitespace-nowrap ${
              activeCommandId === command.id
                ? 'bg-brand-blue text-white'
                : 'bg-brand-gray-700 text-brand-gray-300 hover:bg-brand-gray-600'
            }`}
          >
            {command.name}
          </button>
        ))}
      </div>
    </div>
  );
};
