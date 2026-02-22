import { Router, Request, Response } from 'express';
import { fetchMatches } from '../services/footballApiService';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await fetchMatches();
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({
      error: 'Failed to fetch matches',
      details: message,
    });
  }
});

export default router;
