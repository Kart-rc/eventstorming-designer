import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { eventStormingAPI } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { FileText, Sparkles, ChevronRight, Loader2 } from 'lucide-react';

const EXAMPLE_REQUIREMENTS = `
# E-Commerce Platform

## Overview
Build a modern e-commerce platform that allows customers to browse products, place orders, and track deliveries.

## Key Features
- User registration and authentication
- Product catalog with search and filters
- Shopping cart management
- Order placement and payment processing
- Order tracking and notifications
- Inventory management for sellers

## Goals
- Provide seamless shopping experience
- Handle high traffic during sales
- Ensure secure payment processing
- Enable real-time order tracking

## Constraints
- Must support mobile and web
- Payment integration with Stripe
- Scalable to 10,000+ concurrent users
`;

const BusinessRequirementsStep = () => {
  const { sessionId, setBusinessRequirement, setCurrentStep, addCost } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setTitle('E-Commerce Platform');
    setDescription(EXAMPLE_REQUIREMENTS.trim());
  };

  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please provide both title and description');
      return;
    }

    setLoading(true);
    setAnalysis('');

    try {
      const requirement = {
        id: uuidv4(),
        title,
        description,
        stakeholders: [],
        goals: [],
        constraints: [],
        createdAt: new Date().toISOString(),
      };

      const response = await eventStormingAPI.analyzeRequirements(requirement, sessionId);

      setAnalysis(response.analysis);
      setBusinessRequirement(requirement);
      addCost('Analyze Business Requirements', response.cost.tokensUsed, response.cost.cost);

      toast.success('Requirements analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze requirements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!analysis) {
      toast.error('Please analyze requirements first');
      return;
    }
    setCurrentStep(1);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Business Requirements</h2>
        </div>
        <p className="text-gray-600">
          Start by describing what you want to build. Be as detailed as possible about
          features, goals, and constraints. Our AI will analyze it and help identify
          domain concepts.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., E-Commerce Platform"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Description Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Detailed Description
            </label>
            <button
              onClick={loadExample}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail. Include features, goals, stakeholders, and constraints..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
          <p className="mt-2 text-xs text-gray-500">
            Tip: Markdown formatting is supported
          </p>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Requirements</span>
            </>
          )}
        </button>

        {/* AI Analysis */}
        {analysis && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-4 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">AI Analysis</h3>
            </div>
            <div className="prose prose-purple max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Next Button */}
        {analysis && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Continue to Event Storming</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BusinessRequirementsStep;
