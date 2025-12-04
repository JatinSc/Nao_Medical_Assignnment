// POST /api/translate
// Validates input and uses AI service to translate medical text to the requested language.
// Privacy: request body is not persisted; response contains only translated text.
import { Router } from 'express';
import { z } from 'zod';
import { translate } from '../services/ai.js';

const router = Router();

const schema = z.object({
  text: z.string().min(1),
  targetLang: z.string().min(2).max(10)
});

router.post('/', async (req, res) => {
  try {
    const parsed = schema.parse(req.body);
    const translated = await translate(parsed.text, parsed.targetLang);
    res.json({ translated });
  } catch (err) {
    const status = err?.name === 'ZodError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

export default router;