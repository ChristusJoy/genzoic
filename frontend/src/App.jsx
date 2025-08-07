import React, { useState } from 'react';
import './index.css'; // Your main CSS file

// Import child components
import PulseCard from './components/PulseCard';
import JsonViewer from './components/JsonViewer';

function App() {
  const [ticker, setTicker] = useState('');
  const [pulseData, setPulseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const fetchMarketPulse = async () => {
    setIsLoading(true);
    setPulseData(null);
    setShowJson(false); // Hide JSON when fetching new data

    try {
      const response = await fetch(`http://localhost:8000/api/v1/market-pulse?ticker=${ticker}`);
      const data = await response.json();
      setPulseData(data);
    } catch (error) {
      console.error("Error fetching market pulse:", error);
      setPulseData({
        error: "Failed to fetch data. Please check the ticker symbol and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 font-inter transition-colors duration-300">
      <div className="max-w-xl mx-auto flex flex-col h-full">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Market Pulse AI</h1>
        
        {/* Chat-style output box */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          
          {/* Default welcome message */}
          {!pulseData && !isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-4 py-2 rounded-lg max-w-xs break-words shadow-md">
                Hello! Enter a stock ticker like **AAPL** or **MSFT** below to get tomorrow's market pulse.
              </div>
            </div>
          )}

          {/* User's query */}
          {pulseData && (
            <div className="flex justify-end">
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-lg max-w-xs break-words shadow-md">
                What's the market pulse for **{pulseData.ticker}**?
              </div>
            </div>
          )}

          {/* LLM's response card */}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg max-w-md animate-pulse shadow-md">
                Analyzing market data...
              </div>
            </div>
          ) : pulseData && pulseData.llm_explanation ? (
            <div className="flex justify-start">
              <PulseCard data={pulseData} />
            </div>
          ) : pulseData && pulseData.error && (
            <div className="flex justify-start">
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-4 py-2 rounded-lg max-w-md shadow-md">
                {pulseData.error}
              </div>
            </div>
          )}

          {/* Collapsible JSON Viewer */}
          {pulseData && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowJson(!showJson)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {showJson ? 'Hide Raw JSON' : 'Show Raw JSON'}
              </button>
              {showJson && <JsonViewer data={pulseData} />}
            </div>
          )}
        </div>
        
        {/* Input Form at the bottom */}
        <form onSubmit={(e) => { e.preventDefault(); fetchMarketPulse(); }} className="flex gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker (e.g., AAPL)"
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-400 transition-colors duration-200"
          >
            {isLoading ? '...' : 'Go'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;