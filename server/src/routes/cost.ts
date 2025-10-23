import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory cost tracking (shared across modules)
const costTracking = new Map();

// Get cost tracking for a session
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const tracking = costTracking.get(req.params.sessionId);

    if (!tracking) {
      return res.status(404).json({
        error: 'No cost tracking found for this session',
        sessionId: req.params.sessionId
      });
    }

    res.json(tracking);
  } catch (error) {
    console.error('Error retrieving cost tracking:', error);
    res.status(500).json({ error: 'Failed to retrieve cost tracking' });
  }
});

// Get all sessions (for admin/debugging)
router.get('/', async (req: Request, res: Response) => {
  try {
    const allTracking = Array.from(costTracking.entries()).map(([id, data]) => ({
      sessionId: id,
      ...data
    }));

    res.json({
      sessions: allTracking,
      totalSessions: allTracking.length
    });
  } catch (error) {
    console.error('Error retrieving all cost tracking:', error);
    res.status(500).json({ error: 'Failed to retrieve cost tracking' });
  }
});

// Export for use in other modules
export { costTracking };
export default router;
