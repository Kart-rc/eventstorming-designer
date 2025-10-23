import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { eventStormingAPI } from '../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';

const CONCEPTS = [
  { id: 'domain-event', label: 'Domain Events', context: 'Event Storming' },
  { id: 'command', label: 'Commands', context: 'Event Storming' },
  { id: 'aggregate', label: 'Aggregates', context: 'Domain-Driven Design' },
  { id: 'bounded-context', label: 'Bounded Contexts', context: 'Domain-Driven Design' },
  { id: 'rest-api', label: 'REST APIs', context: 'API Design' },
  { id: 'graphql', label: 'GraphQL', context: 'API Design' },
  { id: 'microservices', label: 'Microservices', context: 'Architecture' },
  { id: 'event-sourcing', label: 'Event Sourcing', context: 'Architecture Patterns' },
];

const ConceptExplainer = () => {
  const { sessionId, addCost } = useSession();
  const [selectedConcept, setSelectedConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async (concept: string, context: string) => {
    setLoading(true);
    setSelectedConcept(concept);
    setExplanation('');

    try {
      const response = await eventStormingAPI.explainConcept(concept, context, sessionId);
      setExplanation(response.explanation);
      addCost(`Explain: ${concept}`, response.cost.tokensUsed, response.cost.cost);
    } catch (error) {
      toast.error('Failed to explain concept');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-purple-600">
        <BookOpen className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Learn Key Concepts</h3>
      </div>

      <p className="text-gray-600">
        Click on any concept below to get a detailed, AI-powered explanation with examples
        and best practices.
      </p>

      {/* Concept Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CONCEPTS.map((concept) => (
          <button
            key={concept.id}
            onClick={() => handleExplain(concept.label, concept.context)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedConcept === concept.label
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 bg-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <p className="font-semibold text-gray-800">{concept.label}</p>
            <p className="text-xs text-gray-500 mt-1">{concept.context}</p>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600">Generating explanation...</span>
        </div>
      )}

      {explanation && !loading && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center space-x-2 mb-4 text-purple-600">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-semibold">AI Explanation</h4>
          </div>
          <div className="prose prose-purple max-w-none">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}

      {!explanation && !loading && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Select a concept to learn more</p>
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
