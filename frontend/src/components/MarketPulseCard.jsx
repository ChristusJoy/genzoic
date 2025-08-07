import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

const MarketPulseCard = ({ data, darkMode }) => {
  if (!data) return null;

  const { ticker, as_of, momentum, news, pulse, llm_explanation } = data;

  // Prepare data for sparkline
  const chartData = momentum.returns.map((value, index) => ({
    day: index + 1,
    return: value
  }));

  const isPulseBullish = pulse.toLowerCase() === 'bullish';
  const pulseColor = isPulseBullish ? 'text-green-400' : 'text-red-400';
  const pulseBgColor = isPulseBullish 
    ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
    : darkMode ? 'bg-red-900/20' : 'bg-red-50';

  return (
    <div className={`rounded-xl p-6 shadow-lg border ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{ticker}</h2>
          <p className={`text-sm flex items-center gap-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Calendar size={14} />
            As of {as_of}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full ${pulseBgColor}`}>
          <span className={`font-semibold flex items-center gap-1 ${pulseColor}`}>
            {isPulseBullish ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {pulse.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Momentum Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Momentum Score */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Target size={18} />
            Momentum Score
          </h3>
          <div className="text-3xl font-bold text-blue-500">
            {(momentum.score * 100).toFixed(0)}%
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Confidence level
          </p>
        </div>

        {/* Sparkline Chart */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className="font-semibold mb-2">5-Day Returns</h3>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="return" 
                  stroke={isPulseBullish ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs mt-2">
            {momentum.returns.map((ret, idx) => (
              <span key={idx} className={`${
                ret >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {ret > 0 ? '+' : ''}{ret}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className={`p-4 rounded-lg mb-6 ${
        darkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
      }`}>
        <h3 className="font-semibold mb-2 text-blue-500">AI Analysis</h3>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {llm_explanation}
        </p>
      </div>

      {/* News Section */}
      <div>
        <h3 className="font-semibold mb-3">Latest News</h3>
        <div className="space-y-3">
          {news.slice(0, 3).map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-colors hover:scale-[1.01] ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <h4 className="font-medium line-clamp-2 leading-tight">
                {article.title}
              </h4>
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {new URL(article.url).hostname}
              </p>
            </a>
          ))}
        </div>
        
        {news.length > 3 && (
          <p className={`text-sm mt-3 text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            +{news.length - 3} more articles available
          </p>
        )}
      </div>
    </div>
  );
};

export default MarketPulseCard;
