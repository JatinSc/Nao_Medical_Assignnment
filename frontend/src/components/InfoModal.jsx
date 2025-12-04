import React from 'react';
import { X, ShieldCheck, FileText, Settings } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose, autoSpeak = true, onToggleAutoSpeak }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-gray-500" size={20} />
            Settings & Privacy
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-blue-600 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-blue-900">Privacy & Data Security</h3>
                <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                  Your audio is processed in real-time. No recordings are stored on our servers. This tool is HIPAA-compliant by design.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <FileText size={18} />
              How to use
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">1</span>
                Select the languages for the patient and provider.
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">2</span>
                Press the large microphone button to start recording.
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">3</span>
                Press stop to finish. The translation will appear automatically.
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">4</span>
                Tap "Play Translation" to speak the text aloud.
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="font-medium text-gray-700">Auto-play translations</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!!autoSpeak}
                  onChange={() => onToggleAutoSpeak && onToggleAutoSpeak(!autoSpeak)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Version 1.0.0 • Nao Medical</p>
        </div>
      </div>
    </div>
  );
};