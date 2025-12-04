// OpenAI service wrapper. Provides:
// - enhanceTranscript(text): improves medical transcription accuracy without inventing details
// - translate(text, targetLang): translates text with clinical terminology preserved
// - tts(text, lang): placeholder returning a message (frontend handles playback)
// API key is only loaded server-side via environment; never exposed to clients.
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let client = null;
if (apiKey) {
  client = new OpenAI({ apiKey });
}

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 8000);

const withTimeout = async (promiseFactory, ms = AI_TIMEOUT_MS) => {
  return Promise.race([
    promiseFactory(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), ms))
  ]);
};

const ensureClient = () => {
  if (!client) {
    return null;
  }
  return client;
};

export async function enhanceTranscript(text) {
  const c = ensureClient();
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text');
  }
  if (!c) {
    // Placeholder improvement when OpenAI key is not configured
    return text.trim();
  }
  let out = '';
  try {
    const resp = await withTimeout(() => c.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a medical transcription enhancer. Improve accuracy, expand abbreviations, fix grammar, and retain clinical meaning without inventing details.' },
        { role: 'user', content: `Transcript:\n${text}\nReturn only the improved transcript.` }
      ],
      temperature: 0.2
    }));
    out = resp?.choices?.[0]?.message?.content?.trim();
  } catch (e) {
    out = text.trim();
  }
  return out || text.trim();
}

const codeToName = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese'
};

export async function translate(text, targetLang) {
  const c = ensureClient();
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text');
  }
  const code = (targetLang || 'en').toLowerCase();
  const langName = codeToName[code] || code;
  if (!c) {
    // Simple placeholder translation behavior: echo text
    return text.trim();
  }
  let out = '';
  try {
    const resp = await withTimeout(() => c.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a strict medical translator. Output MUST be in ${langName} only. Do not echo the source language. Correct minor source errors silently for clinical accuracy.` },
        { role: 'user', content: `Translate the following to ${langName}. Return only translated text in ${langName}, with no extra words.\n\n${text}` }
      ],
      temperature: 0.2,
      max_tokens: 256
    }));
    out = resp?.choices?.[0]?.message?.content?.trim();
  } catch (e) {
    // Do not fallback to source text; surface timeout as error
    throw new Error('Translation timed out');
  }
  return out || text.trim();
}

export async function tts(text, lang) {
  // Placeholder TTS. Real TTS should use a HIPAA-compliant provider.
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text');
  }
  return { audioUrl: null, message: 'Use frontend SpeechSynthesis API for playback' };
}