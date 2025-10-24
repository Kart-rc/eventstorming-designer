// Shared types between client and server

export interface BusinessRequirement {
  id: string;
  title: string;
  description: string;
  stakeholders: string[];
  goals: string[];
  constraints: string[];
  createdAt: string;
}

export interface DomainEvent {
  id: string;
  name: string;
  description: string;
  color: string;
  position: { x: number; y: number };
  timestamp?: string;
}

export interface Command {
  id: string;
  name: string;
  description: string;
  triggeredBy: string;
  color: string;
  position: { x: number; y: number };
}

export interface Aggregate {
  id: string;
  name: string;
  description: string;
  events: string[];
  commands: string[];
  color: string;
  position: { x: number; y: number };
}

export interface BoundedContext {
  id: string;
  name: string;
  description: string;
  aggregates: string[];
  color: string;
  position: { x: number; y: number };
}

export interface EventStormingSession {
  id: string;
  businessRequirement: BusinessRequirement;
  domainEvents: DomainEvent[];
  commands: Command[];
  aggregates: Aggregate[];
  boundedContexts: BoundedContext[];
  createdAt: string;
  updatedAt: string;
}

export interface PRD {
  id: string;
  title: string;
  overview: string;
  objectives: string[];
  userStories: UserStory[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  domainModel: {
    boundedContexts: BoundedContext[];
    aggregates: Aggregate[];
  };
  apiRecommendations: APIRecommendation[];
  createdAt: string;
}

export interface UserStory {
  id: string;
  as: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

export interface APIRecommendation {
  useCase: string;
  recommendedType: 'REST' | 'GraphQL' | 'Both';
  rationale: string;
  considerations: string[];
}

export interface RESTEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requestBody?: object;
  responseBody?: object;
  statusCodes: { code: number; description: string }[];
}

export interface GraphQLSchema {
  types: string[];
  queries: string[];
  mutations: string[];
  subscriptions?: string[];
}

export interface APIDesign {
  id: string;
  prdId: string;
  restEndpoints: RESTEndpoint[];
  graphqlSchema: GraphQLSchema;
  microservices: Microservice[];
  createdAt: string;
}

export interface Microservice {
  name: string;
  boundedContext: string;
  responsibilities: string[];
  endpoints: RESTEndpoint[];
  dependencies: string[];
}

export interface CostTracking {
  sessionId: string;
  totalTokensUsed: number;
  totalCost: number;
  breakdown: {
    step: string;
    tokensUsed: number;
    cost: number;
    timestamp: string;
  }[];
}

export interface AIRequest {
  prompt: string;
  context?: any;
}

export interface AIResponse {
  content: string;
  tokensUsed: number;
  cost: number;
}
