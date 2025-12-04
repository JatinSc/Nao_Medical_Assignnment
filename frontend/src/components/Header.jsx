import React from 'react';
import { Info, Activity } from 'lucide-react';

export const Header = ({ onOpenInfo }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">Nao Medical</h1>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Translator</span>
          </div>
        </div>
        <button 
          onClick={onOpenInfo}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open User Guide"
        >
          <Info size={18} />
          <span className="text-sm font-medium">User Guide</span>
        </button>
      </div>
    </header>
  );
};