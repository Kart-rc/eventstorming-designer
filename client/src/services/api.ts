import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventStormingAPI = {
  analyzeRequirements: async (businessRequirement: any, sessionId: string) => {
    const response = await api.post('/event-storming/analyze-requirements', {
      businessRequirement,
      sessionId,
    });
    return response.data;
  },

  suggestEvents: async (businessRequirement: any, currentEvents: any[], sessionId: string) => {
    const response = await api.post('/event-storming/suggest-events', {
      businessRequirement,
      currentEvents,
      sessionId,
    });
    return response.data;
  },

  suggestCommands: async (businessRequirement: any, events: any[], sessionId: string) => {
    const response = await api.post('/event-storming/suggest-commands', {
      businessRequirement,
      events,
      sessionId,
    });
    return response.data;
  },

  identifyAggregates: async (events: any[], commands: any[], sessionId: string) => {
    const response = await api.post('/event-storming/identify-aggregates', {
      events,
      commands,
      sessionId,
    });
    return response.data;
  },

  identifyContexts: async (aggregates: any[], businessRequirement: any, sessionId: string) => {
    const response = await api.post('/event-storming/identify-contexts', {
      aggregates,
      businessRequirement,
      sessionId,
    });
    return response.data;
  },

  explainConcept: async (concept: string, context: string, sessionId: string) => {
    const response = await api.post('/event-storming/explain', {
      concept,
      context,
      sessionId,
    });
    return response.data;
  },
};

export const prdAPI = {
  generate: async (eventStormingData: any, sessionId: string) => {
    const response = await api.post('/prd/generate', {
      eventStormingData,
      sessionId,
    });
    return response.data;
  },

  get: async (prdId: string) => {
    const response = await api.get(`/prd/${prdId}`);
    return response.data;
  },
};

export const apiDesignAPI = {
  recommendType: async (useCase: string, requirements: any, sessionId: string) => {
    const response = await api.post('/api-design/recommend-type', {
      useCase,
      requirements,
      sessionId,
    });
    return response.data;
  },

  generateREST: async (aggregate: any, boundedContext: string, sessionId: string) => {
    const response = await api.post('/api-design/generate-rest', {
      aggregate,
      boundedContext,
      sessionId,
    });
    return response.data;
  },

  generateGraphQL: async (boundedContext: any, sessionId: string) => {
    const response = await api.post('/api-design/generate-graphql', {
      boundedContext,
      sessionId,
    });
    return response.data;
  },

  designMicroservices: async (boundedContexts: any[], sessionId: string) => {
    const response = await api.post('/api-design/design-microservices', {
      boundedContexts,
      sessionId,
    });
    return response.data;
  },
};

export const costAPI = {
  getTracking: async (sessionId: string) => {
    const response = await api.get(`/cost/${sessionId}`);
    return response.data;
  },
};

export default api;
