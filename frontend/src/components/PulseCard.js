import React from 'react';
import {
  SparklineChart,
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';

function PulseCard({ data }) {
  const pulseColor = {
    bullish: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    bearish: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    neutral: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
  };

  // Convert returns to a data format Recharts can use
  const sparklineData = data.momentum.returns.map((r, index) => ({
    name: `Day ${index + 1}`,
    value: r,
  }));
  
  return (
    <div className={`w-full p-4 rounded-lg shadow-md ${pulseColor[data.pulse] || 'bg-gray-100 dark:bg-gray-700'}`}>
      <div className="flex items-center mb-2">
        <span className="text-xl font-bold capitalize mr-2">{data.pulse}</span>
        {data.pulse === 'bullish' && <span className="text-2xl">📈</span>}
        {data.pulse === 'bearish' && <span className="text-2xl">📉</span>}
        {data.pulse === 'neutral' && <span className="text-2xl">↔️</span>}
      </div>
      <p className="text-base mb-4">{data.llm_explanation}</p>
      
      {/* Sparkline Chart */}
      {data.momentum.returns && data.momentum.returns.length > 0 && (
        <div className="h-16 mt-2 rounded-md overflow-hidden bg-white dark:bg-gray-900 p-2 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#60a5fa" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 5-day returns</p>
        </div>
      )}
    </div>
  );
}

export default PulseCard;