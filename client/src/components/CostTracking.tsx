import { useSession } from '../context/SessionContext';
import { TrendingUp, Coins, Activity } from 'lucide-react';

const CostTracking = () => {
  const { costTracking } = useSession();

  const formatCost = (cost: number) => `$${cost.toFixed(6)}`;
  const formatTokens = (tokens: number) => tokens.toLocaleString();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Coins className="w-6 h-6" />
            <span className="text-sm opacity-80">Total Cost</span>
          </div>
          <p className="text-3xl font-bold">{formatCost(costTracking.totalCost)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6" />
            <span className="text-sm opacity-80">Total Tokens</span>
          </div>
          <p className="text-3xl font-bold">{formatTokens(costTracking.totalTokensUsed)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm opacity-80">API Calls</span>
          </div>
          <p className="text-3xl font-bold">{costTracking.breakdown.length}</p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
        {costTracking.breakdown.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No API calls made yet. Start the workshop to see costs!
          </p>
        ) : (
          <div className="space-y-2">
            {costTracking.breakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.step}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {formatCost(item.cost)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTokens(item.tokensUsed)} tokens
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Costs are calculated based on Anthropic Claude API pricing.
          This helps you understand the real-world costs of AI-powered features.
        </p>
      </div>
    </div>
  );
};

export default CostTracking;
