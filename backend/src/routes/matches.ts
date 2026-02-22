import { Router, Request, Response } from 'express';
import { fetchMatches, fetchMatchDetail } from '../services/footballApiService';

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

router.get('/:matchId', async (req: Request, res: Response) => {
  try {
    const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;
    const data = await fetchMatchDetail(matchId);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({
      error: 'Failed to fetch match details',
      details: message,
    });
  }
});

export default router;
