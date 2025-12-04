// API client for backend endpoints. All AI calls go through the server to keep the API key secure.
// Configure base URL via VITE_API_BASE_URL; defaults to local backend in development.
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
// const BASE =  'http://localhost:3001';

// Translate medical text to a target language
export async function translate(text, targetLang) {
  const res = await fetch(`${BASE}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Translate failed');
  }
  return res.json();
}

// Enhance medical transcript accuracy
export async function enhanceTranscript(text) {
  const res = await fetch(`${BASE}/api/enhance-transcript`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = res.status === 429 ? 'Rate limit reached. Please pause speaking and retry.' : (body.error || 'Enhance failed');
    throw new Error(msg);
  }
  return res.json();
}

// Simple health check helper for connectivity diagnostics
export async function healthCheck() {
  const res = await fetch(`${BASE}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
