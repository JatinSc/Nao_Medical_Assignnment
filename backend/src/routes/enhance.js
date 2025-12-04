// POST /api/enhance-transcript
// Validates input and uses AI service to improve medical transcription accuracy.
// Privacy: request body is processed in-memory only; nothing is stored.
import { Router } from 'express';
import { z } from 'zod';
import { enhanceTranscript } from '../services/ai.js';

const router = Router();

const schema = z.object({
  text: z.string().min(1)
});

router.post('/', async (req, res) => {
  try {
    const parsed = schema.parse(req.body);
    const enhanced = await enhanceTranscript(parsed.text);
    res.json({ enhanced });
  } catch (err) {
    const status = err?.name === 'ZodError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

export default router;