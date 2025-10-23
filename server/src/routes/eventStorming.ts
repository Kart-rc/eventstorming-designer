import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import AIService from '../services/aiService';
import { CostTracking } from '../../../shared/types';

const router = express.Router();

// In-memory storage (replace with database in production)
const sessions = new Map();
const costTracking = new Map<string, CostTracking>();

// Analyze business requirements
router.post('/analyze-requirements', async (req: Request, res: Response) => {
  try {
    const { businessRequirement, sessionId } = req.body;

    const response = await AIService.analyzeBusinessRequirements(businessRequirement.description);

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
      step: 'Analyze Business Requirements',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      analysis: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error analyzing requirements:', error);
    res.status(500).json({ error: 'Failed to analyze requirements' });
  }
});

// Suggest domain events
router.post('/suggest-events', async (req: Request, res: Response) => {
  try {
    const { businessRequirement, currentEvents, sessionId } = req.body;

    const response = await AIService.suggestDomainEvents(
      businessRequirement.description,
      currentEvents.map((e: any) => e.name)
    );

    // Track cost
    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Suggest Domain Events',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      suggestions: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error suggesting events:', error);
    res.status(500).json({ error: 'Failed to suggest events' });
  }
});

// Suggest commands
router.post('/suggest-commands', async (req: Request, res: Response) => {
  try {
    const { businessRequirement, events, sessionId } = req.body;

    const response = await AIService.suggestCommands(
      events.map((e: any) => e.name),
      businessRequirement.description
    );

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Suggest Commands',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      suggestions: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error suggesting commands:', error);
    res.status(500).json({ error: 'Failed to suggest commands' });
  }
});

// Identify aggregates
router.post('/identify-aggregates', async (req: Request, res: Response) => {
  try {
    const { events, commands, sessionId } = req.body;

    const response = await AIService.identifyAggregates(
      events.map((e: any) => e.name),
      commands.map((c: any) => c.name)
    );

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Identify Aggregates',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      suggestions: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error identifying aggregates:', error);
    res.status(500).json({ error: 'Failed to identify aggregates' });
  }
});

// Identify bounded contexts
router.post('/identify-contexts', async (req: Request, res: Response) => {
  try {
    const { aggregates, businessRequirement, sessionId } = req.body;

    const response = await AIService.identifyBoundedContexts(
      aggregates.map((a: any) => a.name),
      businessRequirement.description
    );

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Identify Bounded Contexts',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      suggestions: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error identifying contexts:', error);
    res.status(500).json({ error: 'Failed to identify contexts' });
  }
});

// Save session
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const sessionData = req.body;
    const sessionId = sessionData.id || uuidv4();

    sessions.set(sessionId, {
      ...sessionData,
      id: sessionId,
      updatedAt: new Date().toISOString()
    });

    res.json({ sessionId, message: 'Session saved successfully' });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get session
router.get('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const session = sessions.get(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Explain concept
router.post('/explain', async (req: Request, res: Response) => {
  try {
    const { concept, context, sessionId } = req.body;

    const response = await AIService.explainConcept(concept, context);

    if (sessionId && costTracking.has(sessionId)) {
      const tracking = costTracking.get(sessionId)!;
      tracking.totalTokensUsed += response.tokensUsed;
      tracking.totalCost += response.cost;
      tracking.breakdown.push({
        step: `Explain: ${concept}`,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      explanation: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error explaining concept:', error);
    res.status(500).json({ error: 'Failed to explain concept' });
  }
});

export default router;
