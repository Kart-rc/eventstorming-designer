import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import StepIndicator from '../components/StepIndicator';
import BusinessRequirementsStep from '../components/steps/BusinessRequirementsStep';
import EventStormingStep from '../components/steps/EventStormingStep';
import PRDGenerationStep from '../components/steps/PRDGenerationStep';
import APIDesignStep from '../components/steps/APIDesignStep';
import CostTracking from '../components/CostTracking';
import ConceptExplainer from '../components/ConceptExplainer';
import { HelpCircle, DollarSign } from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Business Requirements', description: 'Define what you want to build' },
  { id: 1, title: 'Event Storming', description: 'Discover your domain model' },
  { id: 2, title: 'PRD Generation', description: 'Create comprehensive documentation' },
  { id: 3, title: 'API Design', description: 'Design REST and GraphQL endpoints' },
];

const Workshop = () => {
  const { currentStep, costTracking } = useSession();
  const [showCost, setShowCost] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BusinessRequirementsStep />;
      case 1:
        return <EventStormingStep />;
      case 2:
        return <PRDGenerationStep />;
      case 3:
        return <APIDesignStep />;
      default:
        return <BusinessRequirementsStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Event Storming Designer</h1>
              <p className="text-purple-100 text-sm">Interactive Learning Workshop</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowExplainer(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Learn Concepts</span>
              </button>
              <button
                onClick={() => setShowCost(!showCost)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                <span>${costTracking.totalCost.toFixed(4)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="container mx-auto px-4 py-8">
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {renderStep()}
        </div>
      </div>

      {/* Cost Tracking Modal */}
      {showCost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Cost Tracking</h2>
              <button
                onClick={() => setShowCost(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <CostTracking />
            </div>
          </div>
        </div>
      )}

      {/* Concept Explainer Modal */}
      {showExplainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Learn Concepts</h2>
              <button
                onClick={() => setShowExplainer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ConceptExplainer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshop;
