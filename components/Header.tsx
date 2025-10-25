
import React from 'react';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="flex-shrink-0 bg-brand-gray-800/80 backdrop-blur-sm border-b border-brand-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          FGA Omni-Assistant Command Center
        </h1>
        {onLogout && (
          <button onClick={onLogout} className="text-sm text-white hover:underline">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
