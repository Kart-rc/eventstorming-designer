import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import AIService from '../services/aiService';

const router = express.Router();

// In-memory storage
const prds = new Map();
const costTracking = new Map();

// Generate PRD from event storming session
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { eventStormingData, sessionId } = req.body;

    const response = await AIService.generatePRD(eventStormingData);

    // Track cost
    if (!costTracking.has(sessionId)) {
      costTracking.set(sessionId, {
        sessionId,
        totalTokensUsed: 0,
        totalCost: 0,
        breakdown: []
      });
    }

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Generate PRD',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    const prdId = uuidv4();
    const prd = {
      id: prdId,
      content: response.content,
      eventStormingSessionId: eventStormingData.id,
      createdAt: new Date().toISOString()
    };

    prds.set(prdId, prd);

    res.json({
      prd,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error generating PRD:', error);
    res.status(500).json({ error: 'Failed to generate PRD' });
  }
});

// Get PRD by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prd = prds.get(req.params.id);

    if (!prd) {
      return res.status(404).json({ error: 'PRD not found' });
    }

    res.json(prd);
  } catch (error) {
    console.error('Error retrieving PRD:', error);
    res.status(500).json({ error: 'Failed to retrieve PRD' });
  }
});

// Update PRD
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const prd = prds.get(req.params.id);

    if (!prd) {
      return res.status(404).json({ error: 'PRD not found' });
    }

    const updatedPrd = {
      ...prd,
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    prds.set(req.params.id, updatedPrd);

    res.json(updatedPrd);
  } catch (error) {
    console.error('Error updating PRD:', error);
    res.status(500).json({ error: 'Failed to update PRD' });
  }
});

export default router;
