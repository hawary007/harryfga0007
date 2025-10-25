import React, { useState, useEffect } from 'react';
import { searchRfps } from '../services/rfpService';

type RFPFinderProps = {
  keywords: string;
  onRevert: () => void;
};

export const RFPFinder: React.FC<RFPFinderProps> = ({ keywords, onRevert }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRfps(keywords);
      setResults(data.opportunities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search RFPs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [keywords]);

  if (error) {
    return (
      <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Search failed</p>
        <p>{error}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={load} className="px-3 py-1 bg-red-500 text-white rounded">Retry</button>
          <button onClick={onRevert} className="px-3 py-1 bg-gray-200 rounded">Data Import Mode</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <ul>
          {results.map((r, idx) => (
            <li key={idx}>{r.title || JSON.stringify(r)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RFPFinder;
