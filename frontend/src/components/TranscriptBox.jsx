import React, { useEffect, useRef, useState } from 'react';

export const TranscriptBox = ({ title, content, variant = 'original', isPlaceholder = false, loading = false, loadingLabel }) => {
  const bottomRef = useRef(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content]);
  const bgClass = variant === 'original' ? 'bg-gray-50' : 'bg-indigo-50';
  const borderClass = variant === 'original' ? 'border-gray-200' : 'border-indigo-100';
  const textClass = isPlaceholder ? 'text-gray-400 italic' : 'text-gray-900';
  const titleClass = variant === 'original' ? 'text-gray-500' : 'text-indigo-600';

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (_) {
      setCopied(false);
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-xl border ${borderClass} ${bgClass} overflow-hidden shadow-sm transition-colors duration-300`}>
      <div className={`px-4 py-3 border-b ${borderClass} flex justify-between items-center bg-white/50 flex-none`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${titleClass}`}>{title}</span>
        <div className="flex items-center gap-2">
          {variant === 'translated' && !isPlaceholder && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}
          {loading && (
            <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">{loadingLabel ?? (variant === 'original' ? 'Listening...' : 'Translating...')}</span>
          )}
          <button onClick={copyText} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" aria-label="Copy text">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          {copied && <span className="text-xs text-green-700">Copied</span>}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {loading && !content ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        ) : (
          <p className={`text-lg leading-relaxed whitespace-pre-wrap ${textClass}`}>
            {content || (variant === 'original' ? 'Listening for speech...' : 'Translation will appear here...')}
          </p>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};