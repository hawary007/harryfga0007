
import React, { useEffect, useRef } from 'react';

interface ResultPanelProps {
  result: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-brand-gray-400">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-fast"></div>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-fast animation-delay-200"></div>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-fast animation-delay-400"></div>
    </div>
    <p className="mt-4 text-sm">Assistant is processing...</p>
  </div>
);

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, isLoading, error }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);

  const renderContent = () => {
    if (isLoading && !result) {
      return <LoadingIndicator />;
    }
    if (error) {
      return (
        <div className="p-4 text-red-400 bg-red-900/50 rounded-md">
          <p className="font-bold">An error occurred:</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      );
    }
    if (!result && !isLoading) {
      return (
        <div className="text-center text-brand-gray-500">
          <p>Results will be displayed here.</p>
          <p className="text-sm">Select a command and provide the required inputs to begin.</p>
        </div>
      );
    }
    // Simple markdown-like styling for headers
    const formattedResult = result.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-blue-300">$1</h1>')
                                .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-1 text-cyan-300">$1</h2>')
                                .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-2 text-brand-gray-200">$1</h3>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-brand-gray-100">$1</strong>')
                                .replace(/\n/g, '<br />');

    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedResult }} />;
  };

  return (
    <div className="bg-brand-gray-800 rounded-lg p-1 flex flex-col h-full border border-brand-gray-700">
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center justify-center h-full">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};
