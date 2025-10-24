import { useState, useEffect } from 'react';
import { useSession } from '../../context/SessionContext';
import { prdAPI } from '../../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { FileText, Download, ChevronRight, Loader2, Sparkles } from 'lucide-react';

const PRDGenerationStep = () => {
  const {
    sessionId,
    businessRequirement,
    domainEvents,
    commands,
    aggregates,
    boundedContexts,
    prdContent,
    setPrdContent,
    setCurrentStep,
    addCost,
  } = useSession();

  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (prdContent) {
      setGenerated(true);
    }
  }, [prdContent]);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const eventStormingData = {
        id: sessionId,
        businessRequirement,
        domainEvents,
        commands,
        aggregates,
        boundedContexts,
      };

      const response = await prdAPI.generate(eventStormingData, sessionId);

      setPrdContent(response.prd.content);
      setGenerated(true);
      addCost('Generate PRD', response.cost.tokensUsed, response.cost.cost);

      toast.success('PRD generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PRD');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prd-${businessRequirement?.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('PRD downloaded!');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Product Requirements Document</h2>
        </div>
        <p className="text-gray-600">
          Generate a comprehensive PRD based on your event storming session. This document
          will serve as the foundation for API design and development.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Event Storming Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{domainEvents.length}</div>
            <div className="text-sm text-gray-600">Domain Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{commands.length}</div>
            <div className="text-sm text-gray-600">Commands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600">{aggregates.length}</div>
            <div className="text-sm text-gray-600">Aggregates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{boundedContexts.length}</div>
            <div className="text-sm text-gray-600">Bounded Contexts</div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      {!generated && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Generating comprehensive PRD...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              <span>Generate Product Requirements Document</span>
            </>
          )}
        </button>
      )}

      {/* PRD Content */}
      {generated && prdContent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Generated PRD</h3>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download as Markdown</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 max-h-[600px] overflow-y-auto">
            <div className="prose prose-purple max-w-none">
              <ReactMarkdown>{prdContent}</ReactMarkdown>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentStep(3)}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Continue to API Design</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Educational Info */}
      {!generated && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">What's in a PRD?</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ <strong>Overview:</strong> Executive summary and product vision</li>
            <li>✓ <strong>Objectives:</strong> Clear, measurable goals</li>
            <li>✓ <strong>User Stories:</strong> As a [role], I want [feature], so that [benefit]</li>
            <li>✓ <strong>Functional Requirements:</strong> Detailed feature descriptions</li>
            <li>✓ <strong>Non-Functional Requirements:</strong> Performance, security, scalability</li>
            <li>✓ <strong>Domain Model:</strong> Visual representation of your bounded contexts</li>
            <li>✓ <strong>API Strategy:</strong> Recommendations for API design</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PRDGenerationStep;
