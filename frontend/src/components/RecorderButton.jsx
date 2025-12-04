import React from 'react';
import { Mic, Square } from 'lucide-react';

export const RecorderButton = ({ isRecording, onToggle, disabled = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></div>
        )}
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`
            relative z-10 flex items-center justify-center w-24 h-24 rounded-full shadow-lg transition-all transform duration-200
            ${isRecording ? 'bg-red-600 text-white hover:bg-red-700 scale-105' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? (
            <Square size={32} fill="currentColor" className="rounded-sm" />
          ) : (
            <Mic size={40} />
          )}
        </button>
      </div>
      <p className={`mt-4 font-semibold text-lg ${isRecording ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
        {isRecording ? 'Recording...' : 'Tap to Speak'}
      </p>
    </div>
  );
};