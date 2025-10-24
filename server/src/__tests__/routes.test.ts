import request from 'supertest';
import express from 'express';

// Mock the AI service
jest.mock('../services/aiService', () => {
  return {
    __esModule: true,
    default: {
      analyzeBusinessRequirements: jest.fn().mockResolvedValue({
        content: 'Mock analysis',
        tokensUsed: 100,
        cost: 0.01
      }),
      suggestDomainEvents: jest.fn().mockResolvedValue({
        content: JSON.stringify([{ name: 'Order Placed', description: 'An order was placed' }]),
        tokensUsed: 150,
        cost: 0.015
      }),
      suggestCommands: jest.fn().mockResolvedValue({
        content: JSON.stringify([{ name: 'Place Order', description: 'Place a new order' }]),
        tokensUsed: 150,
        cost: 0.015
      }),
      identifyAggregates: jest.fn().mockResolvedValue({
        content: JSON.stringify([{ name: 'Order', description: 'Order aggregate' }]),
        tokensUsed: 200,
        cost: 0.02
      }),
      identifyBoundedContexts: jest.fn().mockResolvedValue({
        content: JSON.stringify([{ name: 'Order Management', description: 'Manages orders' }]),
        tokensUsed: 200,
        cost: 0.02
      }),
      generatePRD: jest.fn().mockResolvedValue({
        content: '# Product Requirements Document\n\nMock PRD content',
        tokensUsed: 300,
        cost: 0.03
      }),
      recommendAPIType: jest.fn().mockResolvedValue({
        content: JSON.stringify({ recommendation: 'REST', rationale: 'Best for CRUD' }),
        tokensUsed: 250,
        cost: 0.025
      }),
      generateRESTEndpoints: jest.fn().mockResolvedValue({
        content: '## Endpoints\n\nGET /orders',
        tokensUsed: 200,
        cost: 0.02
      }),
      generateGraphQLSchema: jest.fn().mockResolvedValue({
        content: 'type Order { id: ID! }',
        tokensUsed: 200,
        cost: 0.02
      }),
      designMicroservices: jest.fn().mockResolvedValue({
        content: JSON.stringify([{ name: 'Order Service' }]),
        tokensUsed: 300,
        cost: 0.03
      }),
      explainConcept: jest.fn().mockResolvedValue({
        content: '## Domain Events\n\nThings that happen in your system.',
        tokensUsed: 150,
        cost: 0.015
      })
    }
  };
});

import eventStormingRoutes from '../routes/eventStorming';
import prdRoutes from '../routes/prd';
import apiDesignRoutes from '../routes/apiDesign';
import costRoutes from '../routes/cost';

describe('Event Storming API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/event-storming', eventStormingRoutes);
    app.use('/api/prd', prdRoutes);
    app.use('/api/api-design', apiDesignRoutes);
    app.use('/api/cost', costRoutes);
  });

  describe('POST /api/event-storming/analyze-requirements', () => {
    it('should analyze business requirements successfully', async () => {
      const response = await request(app)
        .post('/api/event-storming/analyze-requirements')
        .send({
          businessRequirement: {
            title: 'E-Commerce Platform',
            description: 'Build an e-commerce platform'
          },
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('analysis');
      expect(response.body).toHaveProperty('cost');
      expect(response.body.cost).toHaveProperty('tokensUsed');
      expect(response.body.cost).toHaveProperty('cost');
    });

    it('should handle missing parameters', async () => {
      const response = await request(app)
        .post('/api/event-storming/analyze-requirements')
        .send({});

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/event-storming/suggest-events', () => {
    it('should suggest domain events successfully', async () => {
      const response = await request(app)
        .post('/api/event-storming/suggest-events')
        .send({
          businessRequirement: {
            description: 'E-commerce platform'
          },
          currentEvents: [],
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suggestions');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/event-storming/suggest-commands', () => {
    it('should suggest commands successfully', async () => {
      const response = await request(app)
        .post('/api/event-storming/suggest-commands')
        .send({
          businessRequirement: {
            description: 'E-commerce platform'
          },
          events: [{ name: 'Order Placed' }],
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suggestions');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/event-storming/identify-aggregates', () => {
    it('should identify aggregates successfully', async () => {
      const response = await request(app)
        .post('/api/event-storming/identify-aggregates')
        .send({
          events: [{ name: 'Order Placed' }],
          commands: [{ name: 'Place Order' }],
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suggestions');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/event-storming/identify-contexts', () => {
    it('should identify bounded contexts successfully', async () => {
      const response = await request(app)
        .post('/api/event-storming/identify-contexts')
        .send({
          aggregates: [{ name: 'Order' }],
          businessRequirement: {
            description: 'E-commerce platform'
          },
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suggestions');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/event-storming/explain', () => {
    it('should explain concepts successfully', async () => {
      const response = await request(app)
        .post('/api/event-storming/explain')
        .send({
          concept: 'Domain Events',
          context: 'Event Storming',
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('explanation');
      expect(response.body).toHaveProperty('cost');
    });
  });
});

describe('PRD API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/prd', prdRoutes);
  });

  describe('POST /api/prd/generate', () => {
    it('should generate PRD successfully', async () => {
      const response = await request(app)
        .post('/api/prd/generate')
        .send({
          eventStormingData: {
            id: 'test-session',
            businessRequirement: { title: 'Test' },
            domainEvents: [],
            commands: [],
            aggregates: [],
            boundedContexts: []
          },
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('prd');
      expect(response.body.prd).toHaveProperty('id');
      expect(response.body.prd).toHaveProperty('content');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('GET /api/prd/:id', () => {
    it('should return 404 for non-existent PRD', async () => {
      const response = await request(app)
        .get('/api/prd/non-existent-id');

      expect(response.status).toBe(404);
    });
  });
});

describe('API Design Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/api-design', apiDesignRoutes);
  });

  describe('POST /api/api-design/recommend-type', () => {
    it('should recommend API type successfully', async () => {
      const response = await request(app)
        .post('/api/api-design/recommend-type')
        .send({
          useCase: 'E-commerce',
          requirements: {},
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('recommendation');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/api-design/generate-rest', () => {
    it('should generate REST endpoints successfully', async () => {
      const response = await request(app)
        .post('/api/api-design/generate-rest')
        .send({
          aggregate: { name: 'Order' },
          boundedContext: 'Order Management',
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/api-design/generate-graphql', () => {
    it('should generate GraphQL schema successfully', async () => {
      const response = await request(app)
        .post('/api/api-design/generate-graphql')
        .send({
          boundedContext: { name: 'Order Management' },
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('schema');
      expect(response.body).toHaveProperty('cost');
    });
  });

  describe('POST /api/api-design/design-microservices', () => {
    it('should design microservices successfully', async () => {
      const response = await request(app)
        .post('/api/api-design/design-microservices')
        .send({
          boundedContexts: [{ name: 'Order Management' }],
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('microservices');
      expect(response.body).toHaveProperty('cost');
    });
  });
});

describe('Cost Tracking Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/cost', costRoutes);
  });

  describe('GET /api/cost/:sessionId', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/cost/non-existent-session');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/cost/', () => {
    it('should return all sessions', async () => {
      const response = await request(app)
        .get('/api/cost/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sessions');
      expect(response.body).toHaveProperty('totalSessions');
    });
  });
});
