
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-brand-gray-800/80 backdrop-blur-sm border-b border-brand-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-3 text-center">
        <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          FGA Omni-Assistant Command Center
        </h1>
      </div>
    </header>
  );
};
