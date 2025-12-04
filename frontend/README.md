# Healthcare Translation Frontend

Mobile-first React + Tailwind UI for real-time voice-to-text and translation.

Features
- Web Speech API for speech-to-text with live transcript.
- Dual transcript display (original vs translated).
- Language selection for input and output.
- Browser SpeechSynthesis for translated audio playback.

Setup
1. Install deps: `npm install`
2. Run dev: `npm run dev`
3. Configure backend base URL via `VITE_API_BASE_URL` if not `http://localhost:3001`.

Security & Privacy
- No PHI stored in the browser; transcript remains in memory.
- Backend key is not exposed; all AI calls go via backend.