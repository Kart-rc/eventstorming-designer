import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import AIService from '../services/aiService';

const router = express.Router();

// In-memory storage
const apiDesigns = new Map();
const costTracking = new Map();

// Recommend API type (REST vs GraphQL)
router.post('/recommend-type', async (req: Request, res: Response) => {
  try {
    const { useCase, requirements, sessionId } = req.body;

    const response = await AIService.recommendAPIType(useCase, requirements);

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
      step: 'Recommend API Type',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      recommendation: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error recommending API type:', error);
    res.status(500).json({ error: 'Failed to recommend API type' });
  }
});

// Generate REST endpoints
router.post('/generate-rest', async (req: Request, res: Response) => {
  try {
    const { aggregate, boundedContext, sessionId } = req.body;

    const response = await AIService.generateRESTEndpoints(aggregate, boundedContext);

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Generate REST Endpoints',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      endpoints: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error generating REST endpoints:', error);
    res.status(500).json({ error: 'Failed to generate REST endpoints' });
  }
});

// Generate GraphQL schema
router.post('/generate-graphql', async (req: Request, res: Response) => {
  try {
    const { boundedContext, sessionId } = req.body;

    const response = await AIService.generateGraphQLSchema(boundedContext);

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Generate GraphQL Schema',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      schema: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error generating GraphQL schema:', error);
    res.status(500).json({ error: 'Failed to generate GraphQL schema' });
  }
});

// Design microservices
router.post('/design-microservices', async (req: Request, res: Response) => {
  try {
    const { boundedContexts, sessionId } = req.body;

    const response = await AIService.designMicroservices(boundedContexts);

    const tracking = costTracking.get(sessionId)!;
    tracking.totalTokensUsed += response.tokensUsed;
    tracking.totalCost += response.cost;
    tracking.breakdown.push({
      step: 'Design Microservices',
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date().toISOString()
    });

    res.json({
      microservices: response.content,
      cost: {
        tokensUsed: response.tokensUsed,
        cost: response.cost
      }
    });
  } catch (error) {
    console.error('Error designing microservices:', error);
    res.status(500).json({ error: 'Failed to design microservices' });
  }
});

// Save API design
router.post('/', async (req: Request, res: Response) => {
  try {
    const designData = req.body;
    const designId = designData.id || uuidv4();

    apiDesigns.set(designId, {
      ...designData,
      id: designId,
      createdAt: new Date().toISOString()
    });

    res.json({ designId, message: 'API design saved successfully' });
  } catch (error) {
    console.error('Error saving API design:', error);
    res.status(500).json({ error: 'Failed to save API design' });
  }
});

// Get API design
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const design = apiDesigns.get(req.params.id);

    if (!design) {
      return res.status(404).json({ error: 'API design not found' });
    }

    res.json(design);
  } catch (error) {
    console.error('Error retrieving API design:', error);
    res.status(500).json({ error: 'Failed to retrieve API design' });
  }
});

export default router;
