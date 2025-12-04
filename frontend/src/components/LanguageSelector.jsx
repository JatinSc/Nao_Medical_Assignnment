import React from 'react';
import { ArrowRightLeft, ChevronDown } from 'lucide-react';

export const LanguageSelector = ({ languages, inputLang, outputLang, onInputChange, onOutputChange, onSwap }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full relative">
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">SPEAKING</label>
          <div className="relative">
            <select
              value={inputLang}
              onChange={(e) => onInputChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium rounded-xl p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={`in-${lang.code}`} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
        <button 
          onClick={onSwap}
          className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors md:mt-5"
          aria-label="Swap languages"
        >
          <ArrowRightLeft size={20} />
        </button>
        <div className="w-full relative">
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">TRANSLATING TO</label>
          <div className="relative">
            <select
              value={outputLang}
              onChange={(e) => onOutputChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium rounded-xl p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={`out-${lang.code}`} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};