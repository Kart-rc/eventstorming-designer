import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { apiDesignAPI } from '../../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Code2, Server, Sparkles, Loader2, CheckCircle, FileCode } from 'lucide-react';

const APIDesignStep = () => {
  const {
    sessionId,
    boundedContexts,
    aggregates,
    businessRequirement,
    addCost,
  } = useSession();

  const [activePhase, setActivePhase] = useState<'recommendation' | 'rest' | 'graphql' | 'microservices'>('recommendation');
  const [loading, setLoading] = useState(false);

  const [recommendation, setRecommendation] = useState('');
  const [restEndpoints, setRestEndpoints] = useState('');
  const [graphqlSchema, setGraphqlSchema] = useState('');
  const [microservicesDesign, setMicroservicesDesign] = useState('');

  const handleRecommendation = async () => {
    if (!businessRequirement) return;

    setLoading(true);

    try {
      const response = await apiDesignAPI.recommendType(
        businessRequirement.title,
        {
          description: businessRequirement.description,
          boundedContexts: boundedContexts.map(bc => bc.name),
          aggregates: aggregates.map(a => a.name),
        },
        sessionId
      );

      setRecommendation(response.recommendation);
      addCost('Recommend API Type', response.cost.tokensUsed, response.cost.cost);
      toast.success('API recommendation generated!');
    } catch (error) {
      toast.error('Failed to get recommendation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateREST = async () => {
    setLoading(true);

    try {
      let allEndpoints = '';

      for (const aggregate of aggregates) {
        const context = boundedContexts.find(bc =>
          bc.aggregates.includes(aggregate.id)
        )?.name || 'General';

        const response = await apiDesignAPI.generateREST(aggregate, context, sessionId);
        allEndpoints += `\n\n## ${aggregate.name} Endpoints\n\n${response.endpoints}`;
        addCost(`Generate REST: ${aggregate.name}`, response.cost.tokensUsed, response.cost.cost);
      }

      setRestEndpoints(allEndpoints);
      toast.success('REST endpoints generated!');
    } catch (error) {
      toast.error('Failed to generate REST endpoints');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGraphQL = async () => {
    setLoading(true);

    try {
      let allSchemas = '';

      for (const context of boundedContexts) {
        const response = await apiDesignAPI.generateGraphQL(context, sessionId);
        allSchemas += `\n\n## ${context.name} Schema\n\n${response.schema}`;
        addCost(`Generate GraphQL: ${context.name}`, response.cost.tokensUsed, response.cost.cost);
      }

      setGraphqlSchema(allSchemas);
      toast.success('GraphQL schema generated!');
    } catch (error) {
      toast.error('Failed to generate GraphQL schema');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesignMicroservices = async () => {
    setLoading(true);

    try {
      const response = await apiDesignAPI.designMicroservices(boundedContexts, sessionId);

      setMicroservicesDesign(response.microservices);
      addCost('Design Microservices', response.cost.tokensUsed, response.cost.cost);
      toast.success('Microservices design generated!');
    } catch (error) {
      toast.error('Failed to design microservices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const phases = [
    {
      id: 'recommendation',
      title: 'API Type Recommendation',
      icon: Sparkles,
      description: 'Understand when to use REST vs GraphQL',
      action: handleRecommendation,
      content: recommendation,
      buttonText: 'Get Recommendation',
      completed: !!recommendation,
    },
    {
      id: 'rest',
      title: 'REST Endpoints',
      icon: Code2,
      description: 'Generate RESTful API endpoints',
      action: handleGenerateREST,
      content: restEndpoints,
      buttonText: 'Generate REST APIs',
      completed: !!restEndpoints,
      downloadFilename: 'rest-endpoints.md',
    },
    {
      id: 'graphql',
      title: 'GraphQL Schema',
      icon: FileCode,
      description: 'Generate GraphQL schema and resolvers',
      action: handleGenerateGraphQL,
      content: graphqlSchema,
      buttonText: 'Generate GraphQL Schema',
      completed: !!graphqlSchema,
      downloadFilename: 'graphql-schema.graphql',
    },
    {
      id: 'microservices',
      title: 'Microservices Architecture',
      icon: Server,
      description: 'Design microservices based on bounded contexts',
      action: handleDesignMicroservices,
      content: microservicesDesign,
      buttonText: 'Design Microservices',
      completed: !!microservicesDesign,
      downloadFilename: 'microservices-design.md',
    },
  ];

  const currentPhase = phases.find(p => p.id === activePhase)!;
  const CurrentIcon = currentPhase.icon;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Code2 className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">API Design</h2>
        </div>
        <p className="text-gray-600">
          Design your APIs with AI-powered recommendations. Learn when to use REST vs GraphQL
          and generate production-ready endpoint specifications and GraphQL schemas.
        </p>
      </div>

      {/* Phase Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {phases.map((phase) => {
          const PhaseIcon = phase.icon;
          const isActive = activePhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PhaseIcon className="w-5 h-5" />
              <span>{phase.title}</span>
              {phase.completed && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current Phase Content */}
      <div className="bg-white rounded-lg">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <CurrentIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-semibold text-gray-800">{currentPhase.title}</h3>
          </div>
          <p className="text-gray-600">{currentPhase.description}</p>
        </div>

        {/* Action Button */}
        {!currentPhase.content && (
          <button
            onClick={currentPhase.action}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 mb-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <CurrentIcon className="w-6 h-6" />
                <span>{currentPhase.buttonText}</span>
              </>
            )}
          </button>
        )}

        {/* Generated Content */}
        {currentPhase.content && (
          <div className="space-y-4">
            {currentPhase.downloadFilename && (
              <div className="flex justify-end">
                <button
                  onClick={() => downloadCode(currentPhase.content, currentPhase.downloadFilename!)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileCode className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>
            )}

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 max-h-[600px] overflow-y-auto">
              <div className="prose prose-purple max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      return !inline ? (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <code {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-gray-200 px-1 py-0.5 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {currentPhase.content}
                </ReactMarkdown>
              </div>
            </div>

            <button
              onClick={currentPhase.action}
              className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Regenerate</span>
            </button>
          </div>
        )}

        {/* Educational Info */}
        {!currentPhase.content && !loading && activePhase === 'recommendation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">When to use REST vs GraphQL?</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h5 className="font-semibold mb-2">REST is great for:</h5>
                <ul className="space-y-1">
                  <li>✓ Simple CRUD operations</li>
                  <li>✓ Caching with HTTP</li>
                  <li>✓ Public APIs</li>
                  <li>✓ Resource-based domains</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">GraphQL is great for:</h5>
                <ul className="space-y-1">
                  <li>✓ Complex data requirements</li>
                  <li>✓ Multiple clients (mobile, web)</li>
                  <li>✓ Flexible queries</li>
                  <li>✓ Real-time subscriptions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion */}
      {phases.every(p => p.completed) && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-green-900">Workshop Complete!</h4>
          </div>
          <p className="text-green-800 mb-4">
            Congratulations! You've completed the Event Storming to API Design journey.
            You now have a comprehensive understanding of your domain model and API architecture.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIDesignStep;
