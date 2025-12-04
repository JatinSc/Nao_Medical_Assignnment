# Healthcare Translation Backend

Secure Express APIs for medical transcript enhancement and translation.

Features
- POST `/api/enhance-transcript`: Improve medical transcription accuracy using OpenAI.
- POST `/api/translate`: Translate medical text to target language with clinical fidelity.
- POST `/api/tts` (optional): Placeholder for server-side TTS.
- CORS restricted to configured frontend origin.
- Helmet, rate limiting, and input validation via Zod.

Security & Privacy
- No PHI stored; request bodies are processed in-memory only.
- No logs of speech/transcript in production; avoid verbose logging.
- API key is only on backend via `.env` and never exposed to the client.
- For real production, use HIPAA-compliant storage and providers.

Setup
1. Create `.env` from `.env.example` and set `OPENAI_API_KEY`.
2. Install deps: `npm install`
3. Run dev: `npm run dev`

Deployment
- Deploy on Render or similar. Configure environment variables and allow only your frontend origin via `FRONTEND_ORIGIN`.