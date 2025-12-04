import React from 'react';
import { Volume2, Loader2, Trash2 } from 'lucide-react';

export const SpeakButton = ({ onClick, disabled = false, isPlaying = false, onClear, clearDisabled = false }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onClick}
        disabled={disabled || isPlaying}
        className={`
          w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-lg font-bold shadow-sm transition-all
          ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'}
        `}
      >
        {isPlaying ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <Volume2 size={24} />
        )}
        <span>{isPlaying ? 'Playing Audio...' : 'Play Translation'}</span>
      </button>
      {onClear && (
        <button
          onClick={onClear}
          disabled={clearDisabled}
          className={`
            w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-lg font-bold shadow-sm transition-all
            ${clearDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 active:scale-[0.98]'}
          `}
        >
          <Trash2 size={22} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
};