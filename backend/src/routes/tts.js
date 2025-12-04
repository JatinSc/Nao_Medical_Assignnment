// POST /api/tts (optional)
// Placeholder endpoint returning a message; frontend SpeechSynthesis handles playback.
import { Router } from 'express';
import { z } from 'zod';
import { tts } from '../services/ai.js';

const router = Router();

const schema = z.object({
  text: z.string().min(1),
  lang: z.string().optional()
});

router.post('/', async (req, res) => {
  try {
    const parsed = schema.parse(req.body);
    const result = await tts(parsed.text, parsed.lang);
    res.json(result);
  } catch (err) {
    const status = err?.name === 'ZodError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

export default router;