import { AIService } from '../services/aiService';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'Mock AI response' }],
        usage: {
          input_tokens: 100,
          output_tokens: 50
        }
      })
    }
  }));
});

describe('AIService', () => {
  beforeEach(() => {
    process.env.ANTHROPIC_INPUT_COST = '3.00';
    process.env.ANTHROPIC_OUTPUT_COST = '15.00';
  });

  describe('analyzeBusinessRequirements', () => {
    it('should analyze business requirements and return response with cost', async () => {
      const result = await AIService.analyzeBusinessRequirements('Build an e-commerce platform');

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
      expect(typeof result.content).toBe('string');
      expect(typeof result.tokensUsed).toBe('number');
      expect(typeof result.cost).toBe('number');
      expect(result.tokensUsed).toBe(150); // 100 input + 50 output
      expect(result.cost).toBeGreaterThan(0);
    });
  });

  describe('suggestDomainEvents', () => {
    it('should suggest domain events', async () => {
      const result = await AIService.suggestDomainEvents('E-commerce platform', []);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
      expect(result.content).toBeTruthy();
    });
  });

  describe('suggestCommands', () => {
    it('should suggest commands based on events', async () => {
      const result = await AIService.suggestCommands(['Order Placed'], 'E-commerce');

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('identifyAggregates', () => {
    it('should identify aggregates from events and commands', async () => {
      const result = await AIService.identifyAggregates(
        ['Order Placed'],
        ['Place Order']
      );

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('identifyBoundedContexts', () => {
    it('should identify bounded contexts from aggregates', async () => {
      const result = await AIService.identifyBoundedContexts(
        ['Order', 'Product'],
        'E-commerce platform'
      );

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('generatePRD', () => {
    it('should generate PRD from event storming data', async () => {
      const eventStormingData = {
        businessRequirement: { title: 'Test' },
        domainEvents: [],
        commands: [],
        aggregates: [],
        boundedContexts: []
      };

      const result = await AIService.generatePRD(eventStormingData);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('recommendAPIType', () => {
    it('should recommend API type with rationale', async () => {
      const result = await AIService.recommendAPIType('E-commerce', {});

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('generateRESTEndpoints', () => {
    it('should generate REST endpoints for aggregate', async () => {
      const aggregate = { name: 'Order', description: 'Order entity' };
      const result = await AIService.generateRESTEndpoints(aggregate, 'Order Management');

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('generateGraphQLSchema', () => {
    it('should generate GraphQL schema for bounded context', async () => {
      const boundedContext = { name: 'Order Management' };
      const result = await AIService.generateGraphQLSchema(boundedContext);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('designMicroservices', () => {
    it('should design microservices from bounded contexts', async () => {
      const boundedContexts = [{ name: 'Order Management' }];
      const result = await AIService.designMicroservices(boundedContexts);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('explainConcept', () => {
    it('should explain a concept with context', async () => {
      const result = await AIService.explainConcept('Domain Events', 'Event Storming');

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('cost');
    });
  });

  describe('cost calculation', () => {
    it('should calculate costs correctly based on token usage', async () => {
      const result = await AIService.analyzeBusinessRequirements('Test');

      // With 100 input tokens and 50 output tokens
      // Input cost: (100 / 1,000,000) * 3.00 = 0.0003
      // Output cost: (50 / 1,000,000) * 15.00 = 0.00075
      // Total: 0.00105
      expect(result.cost).toBeCloseTo(0.00105, 5);
    });
  });
});
