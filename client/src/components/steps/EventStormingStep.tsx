import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { eventStormingAPI } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Zap, Command as CommandIcon, Box, Globe, ChevronRight, Loader2, Plus, Trash2, HelpCircle } from 'lucide-react';

const EventStormingStep = () => {
  const {
    sessionId,
    businessRequirement,
    domainEvents,
    setDomainEvents,
    commands,
    setCommands,
    aggregates,
    setAggregates,
    boundedContexts,
    setBoundedContexts,
    setCurrentStep,
    addCost,
  } = useSession();

  const [activeTab, setActiveTab] = useState<'events' | 'commands' | 'aggregates' | 'contexts'>('events');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const handleSuggestEvents = async () => {
    if (!businessRequirement) return;

    setLoading(true);
    setSuggestions('');

    try {
      const response = await eventStormingAPI.suggestEvents(
        businessRequirement,
        domainEvents,
        sessionId
      );

      setSuggestions(response.suggestions);
      addCost('Suggest Domain Events', response.cost.tokensUsed, response.cost.cost);
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Failed to get suggestions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestCommands = async () => {
    if (!businessRequirement) return;

    setLoading(true);
    setSuggestions('');

    try {
      const response = await eventStormingAPI.suggestCommands(
        businessRequirement,
        domainEvents,
        sessionId
      );

      setSuggestions(response.suggestions);
      addCost('Suggest Commands', response.cost.tokensUsed, response.cost.cost);
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Failed to get suggestions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifyAggregates = async () => {
    setLoading(true);
    setSuggestions('');

    try {
      const response = await eventStormingAPI.identifyAggregates(
        domainEvents,
        commands,
        sessionId
      );

      setSuggestions(response.suggestions);
      addCost('Identify Aggregates', response.cost.tokensUsed, response.cost.cost);
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Failed to get suggestions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifyContexts = async () => {
    if (!businessRequirement) return;

    setLoading(true);
    setSuggestions('');

    try {
      const response = await eventStormingAPI.identifyContexts(
        aggregates,
        businessRequirement,
        sessionId
      );

      setSuggestions(response.suggestions);
      addCost('Identify Bounded Contexts', response.cost.tokensUsed, response.cost.cost);
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Failed to get suggestions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = () => {
    if (!newItemName.trim()) return;

    const newEvent = {
      id: uuidv4(),
      name: newItemName,
      description: '',
      color: '#ffd700',
      position: { x: 0, y: 0 },
    };

    setDomainEvents([...domainEvents, newEvent]);
    setNewItemName('');
    toast.success('Event added!');
  };

  const addCommand = () => {
    if (!newItemName.trim()) return;

    const newCommand = {
      id: uuidv4(),
      name: newItemName,
      description: '',
      triggeredBy: '',
      color: '#87ceeb',
      position: { x: 0, y: 0 },
    };

    setCommands([...commands, newCommand]);
    setNewItemName('');
    toast.success('Command added!');
  };

  const addAggregate = () => {
    if (!newItemName.trim()) return;

    const newAggregate = {
      id: uuidv4(),
      name: newItemName,
      description: '',
      events: [],
      commands: [],
      color: '#ffb6c1',
      position: { x: 0, y: 0 },
    };

    setAggregates([...aggregates, newAggregate]);
    setNewItemName('');
    toast.success('Aggregate added!');
  };

  const addContext = () => {
    if (!newItemName.trim()) return;

    const newContext = {
      id: uuidv4(),
      name: newItemName,
      description: '',
      aggregates: [],
      color: '#98fb98',
      position: { x: 0, y: 0 },
    };

    setBoundedContexts([...boundedContexts, newContext]);
    setNewItemName('');
    toast.success('Bounded Context added!');
  };

  const removeItem = (id: string, type: string) => {
    switch (type) {
      case 'events':
        setDomainEvents(domainEvents.filter(e => e.id !== id));
        break;
      case 'commands':
        setCommands(commands.filter(c => c.id !== id));
        break;
      case 'aggregates':
        setAggregates(aggregates.filter(a => a.id !== id));
        break;
      case 'contexts':
        setBoundedContexts(boundedContexts.filter(c => c.id !== id));
        break;
    }
    toast.success('Removed!');
  };

  const canProceed = domainEvents.length > 0 && commands.length > 0 && aggregates.length > 0 && boundedContexts.length > 0;

  const tabConfig = {
    events: {
      icon: Zap,
      title: 'Domain Events',
      color: 'yellow',
      description: 'Things that happen in your system (past tense)',
      items: domainEvents,
      onSuggest: handleSuggestEvents,
      onAdd: addEvent,
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
    },
    commands: {
      icon: CommandIcon,
      title: 'Commands',
      color: 'blue',
      description: 'Actions users can take (imperative)',
      items: commands,
      onSuggest: handleSuggestCommands,
      onAdd: addCommand,
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
    },
    aggregates: {
      icon: Box,
      title: 'Aggregates',
      color: 'pink',
      description: 'Cohesive clusters of domain objects',
      items: aggregates,
      onSuggest: handleIdentifyAggregates,
      onAdd: addAggregate,
      bgColor: 'bg-pink-100',
      borderColor: 'border-pink-300',
    },
    contexts: {
      icon: Globe,
      title: 'Bounded Contexts',
      color: 'green',
      description: 'Logical boundaries in your domain',
      items: boundedContexts,
      onSuggest: handleIdentifyContexts,
      onAdd: addContext,
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
    },
  };

  const currentTab = tabConfig[activeTab];
  const Icon = currentTab.icon;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Event Storming Workshop</h2>
        </div>
        <p className="text-gray-600">
          Discover your domain model through collaborative Event Storming. Work through
          each phase to identify events, commands, aggregates, and bounded contexts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {Object.entries(tabConfig).map(([key, config]) => {
          const TabIcon = config.icon;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key as any);
                setSuggestions('');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? `bg-${config.color}-500 text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <TabIcon className="w-5 h-5" />
              <span>{config.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {config.items.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Items List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon className="w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-800">{currentTab.title}</h3>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <HelpCircle className="w-4 h-4 mr-1" />
            {currentTab.description}
          </p>

          {/* Add New Item */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && currentTab.onAdd()}
              placeholder={`Add ${currentTab.title.toLowerCase()}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={currentTab.onAdd}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentTab.items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Icon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No {currentTab.title.toLowerCase()} yet</p>
                <p className="text-sm">Add manually or use AI suggestions</p>
              </div>
            ) : (
              currentTab.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 ${currentTab.bgColor} ${currentTab.borderColor} border-2 rounded-lg sticky-note`}
                >
                  <span className="font-medium">{item.name}</span>
                  <button
                    onClick={() => removeItem(item.id, activeTab)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: AI Suggestions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Assistant</h3>

          <button
            onClick={currentTab.onSuggest}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating suggestions...</span>
              </>
            ) : (
              <>
                <Icon className="w-5 h-5" />
                <span>Get AI Suggestions</span>
              </>
            )}
          </button>

          {suggestions && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 max-h-96 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{suggestions}</ReactMarkdown>
              </div>
            </div>
          )}

          {!suggestions && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Icon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Click the button above to get AI-powered suggestions</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {canProceed && (
        <div className="mt-8">
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Continue to PRD Generation</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {!canProceed && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Complete all phases:</strong> Add at least one item in each category
            (Events, Commands, Aggregates, and Bounded Contexts) to proceed.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventStormingStep;
