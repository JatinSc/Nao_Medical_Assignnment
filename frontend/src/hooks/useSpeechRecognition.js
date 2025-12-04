// Hook wrapping Web Speech API for continuous speech recognition.
// - Keeps recognition alive by restarting on 'end' until stopped
// - Surfaces specific error messages (not-allowed, audio-capture, no-speech, network)
// - Provides start/stop/reset helpers and current transcript
import { useEffect, useRef, useState } from 'react';

export function useSpeechRecognition(lang = 'en-US') {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [permissionError, setPermissionError] = useState('');
  const supported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const recognitionRef = useRef(null);
  const keepAliveRef = useRef(false);
  const overallRef = useRef('');
  const sessionLastRef = useRef('');
  const RecognitionCtor = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition || null) : null;

  const start = () => {
    if (!RecognitionCtor) return;
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = new RecognitionCtor();
      }
      const r = recognitionRef.current;
      r.lang = lang;
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (event) => {
        let compiled = '';
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          compiled += res[0].transcript;
        }
        const prevSession = sessionLastRef.current || '';
        const delta = compiled.slice(prevSession.length);
        if (delta) {
          overallRef.current += delta;
          setTranscript(overallRef.current);
        }
        sessionLastRef.current = compiled;
      };
      r.onerror = (e) => {
        const err = e?.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setPermissionError('Microphone permission denied');
          keepAliveRef.current = false;
          setListening(false);
          return;
        }
        if (err === 'audio-capture') {
          setPermissionError('No microphone detected or access blocked');
        } else if (err === 'network') {
          setPermissionError('Speech service network error');
        } else if (err === 'no-speech') {
          setPermissionError('No speech detected');
          if (keepAliveRef.current) {
            setTimeout(() => { try { r.start(); } catch {} }, 500);
          }
        } else if (err) {
          setPermissionError(err);
        }
        setListening(false);
      };
      r.onend = () => {
        if (keepAliveRef.current) {
          try { r.start(); } catch {}
          sessionLastRef.current = '';
        } else {
          setListening(false);
        }
      };
      keepAliveRef.current = true;
      r.start();
      setListening(true);
    } catch (_) {
      setPermissionError('Failed to start speech recognition');
      setListening(false);
    }
  };

  const stop = () => {
    keepAliveRef.current = false;
    const r = recognitionRef.current;
    if (r) {
      try { r.stop(); } catch {}
    }
  };

  const reset = () => {
    overallRef.current = '';
    sessionLastRef.current = '';
    setTranscript('');
    setPermissionError('');
  };

  useEffect(() => {
    return () => {
      keepAliveRef.current = false;
      const r = recognitionRef.current;
      if (r) {
        try { r.stop(); } catch {}
      }
      recognitionRef.current = null;
      sessionLastRef.current = '';
    };
  }, []);

  return { listening, transcript, start, stop, reset, supported, permissionError };
}