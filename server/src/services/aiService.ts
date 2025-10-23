import Anthropic from '@anthropic-ai/sdk';
import { AIRequest, AIResponse } from '../../../shared/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL = 'claude-3-5-sonnet-20241022';

// Cost per 1M tokens (in USD)
const INPUT_COST_PER_M = parseFloat(process.env.ANTHROPIC_INPUT_COST || '3.00');
const OUTPUT_COST_PER_M = parseFloat(process.env.ANTHROPIC_OUTPUT_COST || '15.00');

export class AIService {
  private static calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1000000) * INPUT_COST_PER_M;
    const outputCost = (outputTokens / 1000000) * OUTPUT_COST_PER_M;
    return inputCost + outputCost;
  }

  static async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: request.prompt
        }]
      });

      const content = message.content[0].type === 'text' ? message.content[0].text : '';
      const inputTokens = message.usage.input_tokens;
      const outputTokens = message.usage.output_tokens;
      const totalTokens = inputTokens + outputTokens;
      const cost = this.calculateCost(inputTokens, outputTokens);

      return {
        content,
        tokensUsed: totalTokens,
        cost
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  static async analyzeBusinessRequirements(description: string): Promise<AIResponse> {
    const prompt = `You are an expert in Event Storming and Domain-Driven Design. Analyze the following business requirement and provide insights:

Business Requirement:
${description}

Please provide:
1. Key domain concepts identified
2. Potential domain events (things that happen in the system)
3. Possible commands (actions users can take)
4. Suggested bounded contexts (logical boundaries)
5. Questions to clarify for better understanding

Format your response in clear sections with bullet points.`;

    return this.generateResponse({ prompt });
  }

  static async suggestDomainEvents(businessRequirement: string, currentEvents: string[]): Promise<AIResponse> {
    const prompt = `As an Event Storming facilitator, suggest domain events for this business requirement.

Business Requirement: ${businessRequirement}

Current Events: ${currentEvents.join(', ') || 'None yet'}

Domain Events are things that happen in the system, expressed in past tense (e.g., "Order Placed", "Payment Processed", "User Registered").

Suggest 5-8 key domain events that would occur in this system. For each event:
- Name (in past tense)
- Description (what happened and why it matters)
- Typical trigger

Format as JSON array:
[{"name": "Event Name", "description": "...", "trigger": "..."}]`;

    return this.generateResponse({ prompt });
  }

  static async suggestCommands(events: string[], businessRequirement: string): Promise<AIResponse> {
    const prompt = `Based on these domain events and business requirement, suggest commands (user actions).

Business Requirement: ${businessRequirement}
Domain Events: ${events.join(', ')}

Commands are user intentions/actions (e.g., "Place Order", "Process Payment", "Register User").

Suggest key commands. For each command:
- Name (imperative form)
- Description (what the user wants to do)
- Which event(s) it triggers

Format as JSON array:
[{"name": "Command Name", "description": "...", "triggersEvents": ["Event1", "Event2"]}]`;

    return this.generateResponse({ prompt });
  }

  static async identifyAggregates(events: string[], commands: string[]): Promise<AIResponse> {
    const prompt = `Identify aggregates (domain entities) based on these events and commands.

Events: ${events.join(', ')}
Commands: ${commands.join(', ')}

Aggregates are cohesive clusters of domain objects (e.g., "Order", "User", "Payment").

For each aggregate:
- Name
- Description
- Events it produces
- Commands it handles
- Invariants/business rules it enforces

Format as JSON array:
[{"name": "Aggregate Name", "description": "...", "events": [], "commands": [], "businessRules": []}]`;

    return this.generateResponse({ prompt });
  }

  static async identifyBoundedContexts(aggregates: string[], businessRequirement: string): Promise<AIResponse> {
    const prompt = `Identify bounded contexts for organizing these aggregates.

Business Requirement: ${businessRequirement}
Aggregates: ${aggregates.join(', ')}

Bounded Contexts are logical boundaries that separate different parts of the domain (e.g., "Order Management", "User Management", "Billing").

For each bounded context:
- Name
- Description
- Aggregates it contains
- Responsibilities
- Key interactions with other contexts

Format as JSON array:
[{"name": "Context Name", "description": "...", "aggregates": [], "responsibilities": [], "interactions": []}]`;

    return this.generateResponse({ prompt });
  }

  static async generatePRD(eventStormingData: any): Promise<AIResponse> {
    const prompt = `Generate a comprehensive Product Requirements Document (PRD) based on this event storming session.

Event Storming Data:
${JSON.stringify(eventStormingData, null, 2)}

Create a professional PRD with:

1. **Overview**: Executive summary of the product
2. **Objectives**: Clear, measurable goals
3. **User Stories**: In "As a [role], I want [feature], so that [benefit]" format
4. **Functional Requirements**: Detailed feature descriptions
5. **Non-Functional Requirements**: Performance, security, scalability
6. **Domain Model**: Summary of bounded contexts and aggregates
7. **API Strategy**: High-level recommendations for API design

Format as a well-structured markdown document.`;

    return this.generateResponse({ prompt });
  }

  static async recommendAPIType(useCase: string, requirements: any): Promise<AIResponse> {
    const prompt = `As an API design expert, recommend whether to use REST, GraphQL, or both for this use case.

Use Case: ${useCase}
Requirements: ${JSON.stringify(requirements, null, 2)}

Analyze based on:
1. Data access patterns (CRUD vs complex queries)
2. Client requirements (mobile, web, third-party)
3. Real-time needs
4. Team expertise
5. Scalability considerations

Provide:
- **Recommendation**: REST, GraphQL, or Both
- **Rationale**: Detailed reasoning (200-300 words)
- **Pros**: Benefits of the recommended approach
- **Cons**: Potential drawbacks
- **Considerations**: Implementation tips

Format as JSON:
{
  "recommendation": "REST|GraphQL|Both",
  "rationale": "...",
  "pros": [],
  "cons": [],
  "considerations": []
}`;

    return this.generateResponse({ prompt });
  }

  static async generateRESTEndpoints(aggregate: any, boundedContext: string): Promise<AIResponse> {
    const prompt = `Design RESTful API endpoints for this aggregate.

Aggregate: ${JSON.stringify(aggregate, null, 2)}
Bounded Context: ${boundedContext}

Follow REST best practices:
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Resource-based URLs
- Proper status codes
- Request/response examples

For each endpoint provide:
- Method and Path
- Description
- Request body (if applicable)
- Response body
- Status codes

Format as JSON array of endpoints.`;

    return this.generateResponse({ prompt });
  }

  static async generateGraphQLSchema(boundedContext: any): Promise<AIResponse> {
    const prompt = `Generate a GraphQL schema for this bounded context.

Bounded Context: ${JSON.stringify(boundedContext, null, 2)}

Include:
1. **Types**: All domain entities with fields
2. **Queries**: Read operations
3. **Mutations**: Write operations
4. **Subscriptions**: Real-time updates (if applicable)
5. **Input Types**: For mutations

Provide complete, valid GraphQL SDL (Schema Definition Language).`;

    return this.generateResponse({ prompt });
  }

  static async designMicroservices(boundedContexts: any[]): Promise<AIResponse> {
    const prompt = `Design microservices architecture based on these bounded contexts.

Bounded Contexts: ${JSON.stringify(boundedContexts, null, 2)}

For each microservice:
1. **Name**: Clear, descriptive name
2. **Bounded Context**: Which context it implements
3. **Responsibilities**: What it does
4. **API Endpoints**: Key endpoints
5. **Dependencies**: Other services it depends on
6. **Data Store**: Recommended database type
7. **Communication Patterns**: Sync/async, events

Also provide:
- Service interaction diagram (text description)
- Deployment recommendations
- Scalability considerations

Format as JSON with clear structure.`;

    return this.generateResponse({ prompt });
  }

  static async explainConcept(concept: string, context?: string): Promise<AIResponse> {
    const prompt = `Explain the concept of "${concept}" in the context of ${context || 'software design and event storming'}.

Provide:
1. **Definition**: Clear, concise explanation
2. **Why It Matters**: Practical benefits
3. **Example**: Real-world scenario
4. **Common Mistakes**: What to avoid
5. **Best Practices**: Tips for success

Keep it educational and beginner-friendly, but thorough. Use analogies when helpful.`;

    return this.generateResponse({ prompt });
  }
}

export default AIService;
