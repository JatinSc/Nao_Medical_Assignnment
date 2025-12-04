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
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          aria-label="Information and Privacy"
        >
          <Info size={24} />
        </button>
      </div>
    </header>
  );
};