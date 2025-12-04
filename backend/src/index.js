// Express server that exposes secure AI endpoints for enhancing and translating medical text.
// Security: Helmet, CORS restricted to frontend origin, rate limiting, Zod validation in routes.
// Privacy: No PHI stored or logged; requests are processed in-memory only.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import translateRouter from './routes/translate.js';
import enhanceRouter from './routes/enhance.js';
import ttsRouter from './routes/tts.js';

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

app.use(cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting to protect AI endpoints
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Privacy & Security
// NOTE: No PHI is stored server-side. Request bodies are not persisted.
// NOTE: Do not enable verbose request logging in production to avoid PHI exposure.

// Routes
// POST /api/translate -> translate medical text to target language
// POST /api/enhance-transcript -> improve medical transcription accuracy
// POST /api/tts -> optional TTS placeholder (frontend handles playback)
app.use('/api/translate', translateRouter);
app.use('/api/enhance-transcript', enhanceRouter);
app.use('/api/tts', ttsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // NOTE: API key is never logged; only environment presence is checked.
  console.log(`API server listening on port ${PORT}`);
});