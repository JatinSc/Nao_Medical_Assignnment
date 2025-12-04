# Nao Medical Translator

A simple, privacy-minded app that captures speech, improves the transcript, translates it, and can read translations aloud.

## Code Structure
- `backend/` Express API
  - `src/index.js` server with security middleware, CORS, rate limiting, health check
  - `src/routes/` endpoints: `translate`, `enhance-transcript`, `tts`
  - `src/services/ai.js` OpenAI chat-completions for enhance and translate
- `frontend/` React + Vite + Tailwind UI
  - `src/pages/Home.jsx` orchestrates enhance→translate pipeline and UI state
  - `src/hooks/useSpeechRecognition.js` continuous speech recognition with session persistence
  - `src/components/` UI components (`Header`, `LanguageSelector`, `RecorderButton`, `TranscriptBox`, `SpeakButton`, `InfoModal`)

## AI Tools
- Model: `gpt-4o-mini` via Chat Completions
- Enhance: improves medical transcript accuracy without inventing details
- Translate: strict output in target language, preserves clinical meaning
- Errors: backend surfaces actual OpenAI error messages; frontend displays them verbatim

## Security & Privacy
- API key only on server (`OPENAI_API_KEY`), never exposed to the browser
- No PHI stored; requests processed in-memory only
- Middleware: `helmet` for headers, rate limiting on `/api/*`
- Environment-based config; `.env` files are ignored by Git

## User Guide
- Select Languages: choose who is speaking and the translation language; use Swap to flip
- Record: press the microphone to start/stop; the app listens across short pauses
- See Transcripts:
  - Original Speech: live transcript
  - Enhanced Transcript: cleaned-up medical text
  - Translated Text: target language output
- Loading Messages:
  - Enhancement shows “Enhancing…”
  - Translation phases: “AI is working…”, “Still working…”, “Almost there…”, “Finalizing…”
- Audio: press “Play Translation” to hear the translation; toggle auto-play in User Guide modal
- Clear: press “Clear All” to stop recording, stop audio, and empty all panels
- Copy: use the copy button on any panel to copy text

## API Quick Test
- Local
  - `curl.exe -X POST http://localhost:3001/api/translate -H "Content-Type: application/json" -d "{\"text\":\"I have chest pain\",\"targetLang\":\"es\"}"`
- Deployed
  - `curl.exe -X POST https://noa-medical-assignnment.onrender.com/api/translate -H "Content-Type: application/json" -d "{\"text\":\"I have chest pain\",\"targetLang\":\"es\"}"`

## Setup
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`
- Frontend config: set `VITE_API_BASE_URL` in `frontend/.env` to your backend URL