import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.jsx';
import { LanguageSelector } from '../components/LanguageSelector.jsx';
import { RecorderButton } from '../components/RecorderButton.jsx';
import { TranscriptBox } from '../components/TranscriptBox.jsx';
import { SpeakButton } from '../components/SpeakButton.jsx';
import { InfoModal } from '../components/InfoModal.jsx';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import * as api from '../services/api.js';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputLang, setInputLang] = useState('en-US');
  const [outputLang, setOutputLang] = useState('es-ES');
  const [enhancedTranscript, setEnhancedTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const LANGUAGES = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Spanish (ES)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  ];

  const { listening, transcript, start, stop, reset, supported, permissionError } = useSpeechRecognition(inputLang);
  const PAUSE_MS = 2000;
  const debouncedTranscript = useDebouncedValue(transcript, PAUSE_MS);
  const [lastProcessed, setLastProcessed] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setError('');
      const text = debouncedTranscript?.trim();
      if (!text) return;
      if (text === lastProcessed) return;
      try {
        const outCode = (outputLang || 'en-US').split('-')[0];
        const delta = text.slice((lastProcessed || '').length).trim();
        if (!delta) { return; }
        setEnhancing(true);
        const { enhanced: enhancedChunk } = await api.enhanceTranscript(delta);
        if (cancelled) return;
        setEnhancedTranscript(prev => prev ? `${prev} ${enhancedChunk}` : enhancedChunk);
        setEnhancing(false);
        setTranslating(true);
        const { translated } = await api.translate(enhancedChunk, outCode);
        if (cancelled) return;
        setTranslatedText(prev => prev ? `${prev} ${translated}` : translated);
        setLastProcessed(text);
        if (autoSpeak) {
          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(translated);
            utter.lang = outputLang;
            utter.onend = () => setIsPlaying(false);
            setIsPlaying(true);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
          }
        }
      } catch (e) {
        setError(e?.message || 'Network error');
      } finally {
        setEnhancing(false);
        setTranslating(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debouncedTranscript, outputLang, autoSpeak]);

  const handleToggleRecord = () => {
    if (!supported) return;
    if (listening) {
      stop();
    } else {
      reset();
      setEnhancedTranscript('');
      setTranslatedText('');
      setLastProcessed('');
      start();
    }
  };

  const handleSwapLanguages = () => {
    setInputLang(outputLang);
    setOutputLang(inputLang);
    reset();
    setEnhancedTranscript('');
    setTranslatedText('');
    setLastProcessed('');
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    setIsPlaying(true);
    const utter = new SpeechSynthesisUtterance(translatedText || '');
    utter.lang = outputLang;
    utter.onend = () => setIsPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const handleClear = () => {
    stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    reset();
    setEnhancedTranscript('');
    setTranslatedText('');
    setLastProcessed('');
    setError('');
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      <div className="flex-none">
        <Header onOpenInfo={() => setShowModal(true)} />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
        
        {/* Language Selection - Fixed Height */}
        <section className="flex-none" aria-label="Language Controls">
          <LanguageSelector 
            languages={LANGUAGES}
            inputLang={inputLang}
            outputLang={outputLang}
            onInputChange={setInputLang}
            onOutputChange={setOutputLang}
            onSwap={handleSwapLanguages}
          />
        </section>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* LEFT COLUMN: Input & Recording */}
          <section className="flex flex-col gap-4">
            <div className="flex-none bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center border border-gray-100">
              <RecorderButton 
                isRecording={listening} 
                onToggle={handleToggleRecord} 
                disabled={!supported}
              />
              <p className="text-sm text-gray-400 mt-4 text-center max-w-xs">
                {listening ? "Listening..." : "Press to record"}
              </p>
            </div>
            
            <div className="flex-1 min-h-0">
              <TranscriptBox 
                title="Original Speech" 
                content={transcript} 
                variant="original"
                isPlaceholder={transcript.length === 0}
                // loading={enhancing}
                // loadingLabel="Enhancing…"
              />
            </div>

            <div className="flex-1 min-h-0">
              <TranscriptBox 
                title="Enhanced Transcript" 
                content={enhancedTranscript} 
                variant="enhanced"
                isPlaceholder={enhancedTranscript.length === 0}
                loading={enhancing}
                loadingLabel="Enhancing…"
              />
            </div>
          </section>

          {/* RIGHT COLUMN: Output & Actions */}
          <section className="flex flex-col gap-4">
            <div className="flex-1 min-h-0">
               <TranscriptBox 
                title="Translated Text" 
                content={translatedText} 
                variant="translated"
                isPlaceholder={translatedText.length === 0}
                loading={translating}
                loadingLabel="Translating…"
              />
            </div>
            
            <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <SpeakButton 
                onClick={handleSpeak}
                disabled={translatedText.length === 0 || translating}
                isPlaying={isPlaying}
                onClear={handleClear}
                clearDisabled={enhancing || translating}
              />
              <p className="text-[10px] text-center text-gray-400 mt-2">
                Verify critical medical information.
              </p>
            </div>
          </section>

        </div>
      </main>

      {permissionError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">{permissionError}</div>
      )}
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded shadow">{error}</div>
      )}
      <InfoModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        autoSpeak={autoSpeak} 
        onToggleAutoSpeak={(val) => setAutoSpeak(val)}
      />
    </div>
  );
}

export default App;



// // Home page orchestrates the speech-to-text pipeline and translation:
// // 1) Capture speech via Web Speech API (useSpeechRecognition hook)
// // 2) Debounce input to wait for a pause (PAUSE_MS)
// // 3) Call backend to enhance transcription, then translate
// // 4) Show loading state and render translated output; allow playback and clearing
// import { useEffect, useMemo, useState } from 'react';
// import { LanguageSelector } from '../UI components/LanguageSelector.jsx';
// import { MicButton } from '../UI components/MicButton.jsx';
// import { ClearButton } from '../UI components/ClearButton.jsx';
// import { PlayButton } from '../UI components/PlayButton.jsx';
// import { TranscriptBox } from '../UI components/TranscriptBox.jsx';
// import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';
// import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
// import * as api from '../services/api.js';

// export default function Home() {
//   const [inputLang, setInputLang] = useState('en-US');
//   const [outputLang, setOutputLang] = useState('es');
//   const [enhanced, setEnhanced] = useState('');
//   const [translated, setTranslated] = useState('');
//   const [error, setError] = useState('');
//   const [translating, setTranslating] = useState(false);

//   const { listening, transcript, start, stop, reset, supported, permissionError } = useSpeechRecognition(inputLang);
//   const PAUSE_MS = 2000;
//   const debouncedTranscript = useDebouncedValue(transcript, PAUSE_MS);
//   const [lastProcessed, setLastProcessed] = useState('');

//   useEffect(() => {
//     let cancelled = false;
//     const run = async () => {
//       setError('');
//       const text = debouncedTranscript?.trim();
//       if (!text) return;
//       if (text === lastProcessed) return;
//       try {
//         setTranslating(true);
//         const { enhanced } = await api.enhanceTranscript(text);
//         if (cancelled) return;
//         setEnhanced(enhanced);
//         const { translated } = await api.translate(enhanced, outputLang);
//         if (cancelled) return;
//         setTranslated(translated);
//         setLastProcessed(text);
//       } catch (e) {
//         setError(e?.message || 'Network error');
//       } finally {
//         setTranslating(false);
//       }
//     };
//     run();
//     return () => { cancelled = true; };
//   }, [debouncedTranscript, outputLang]);

//   const leftTitle = useMemo(() => listening ? 'Listening… (Original)' : 'Original Transcript', [listening]);

//   const clearAll = () => {
//     // Stop capture and playback, then reset all UI state
//     stop();
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//     reset();
//     setEnhanced('');
//     setTranslated('');
//     setLastProcessed('');
//     setError('');
//     setTranslating(false);
//   };

//   return (
//     <div className="min-h-screen max-w-5xl mx-auto p-4">
//       <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
//         <h1 className="text-3xl font-semibold text-healthcare-primary tracking-tight">Healthcare Translation</h1>
//         <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
//           <LanguageSelector inputLang={inputLang} outputLang={outputLang} onChangeInput={setInputLang} onChangeOutput={setOutputLang} />
//           <MicButton listening={listening} onStart={start} onStop={stop} supported={supported} />
//           <ClearButton onClick={clearAll} />
//         </div>
//       </header>

//       {permissionError && (
//         <div className="mb-2 rounded bg-yellow-100 text-yellow-800 p-2">{permissionError}</div>
//       )}

//       {error && (
//         <div className="mb-2 rounded bg-red-100 text-red-800 p-2">{error}</div>
//       )}

//       <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <TranscriptBox title={leftTitle} value={transcript} />
//         <TranscriptBox title="Translated Transcript" value={translated} loading={translating} />
//       </main>

//       <footer className="mt-6 flex items-center gap-2">
//         <PlayButton text={translated} lang={outputLang} />
//         <span className="text-xs text-gray-500">No PHI stored; audio playback via browser.</span>
//       </footer>
//     </div>
//   );
// }