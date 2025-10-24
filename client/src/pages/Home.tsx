import { useNavigate } from 'react-router-dom';
import { Lightbulb, Zap, Target, Code2, FileText, DollarSign } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Interactive Learning',
      description: 'Learn Event Storming, DDD, and API design through hands-on practice',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Guidance',
      description: 'Get intelligent suggestions and explanations at every step',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'From Requirements to APIs',
      description: 'Complete journey from business needs to technical implementation',
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'REST & GraphQL',
      description: 'Learn when to use REST vs GraphQL with real rationale',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'PRD Generation',
      description: 'Automatically generate comprehensive Product Requirements Documents',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Cost Transparency',
      description: 'Track AI API usage and costs in real-time',
    },
  ];

  const steps = [
    'Enter business requirements',
    'Conduct Event Storming workshop',
    'Identify domain events, commands, and aggregates',
    'Define bounded contexts',
    'Generate comprehensive PRD',
    'Decide on API architecture',
    'Generate REST and GraphQL endpoints',
    'Design microservices',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 slide-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Event Storming Designer
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            An interactive learning platform that guides you from business requirements
            to production-ready API designs using Event Storming and Domain-Driven Design
          </p>
          <button
            onClick={() => navigate('/workshop')}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Journey
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white hover:bg-white/20 transition-all slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-purple-200 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-purple-100">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Learning Path */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Your Learning Path
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 text-white"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-purple-100 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-purple-600 mb-3">
                Event Storming Concepts
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Domain Events - what happened in your system</li>
                <li>✓ Commands - user intentions and actions</li>
                <li>✓ Aggregates - cohesive domain entities</li>
                <li>✓ Bounded Contexts - logical boundaries</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-600 mb-3">
                API Design Decisions
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ When to use REST APIs</li>
                <li>✓ When to use GraphQL</li>
                <li>✓ Microservices architecture patterns</li>
                <li>✓ Real-world trade-offs and rationale</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-purple-100">
          <p className="mb-4">
            Powered by AI • Built for Learning • Designed for Developers
          </p>
          <button
            onClick={() => navigate('/workshop')}
            className="text-white underline hover:text-purple-200 transition-colors"
          >
            Get Started Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
