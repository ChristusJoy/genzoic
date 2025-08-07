import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import SearchBar from './components/SearchBar';
import MarketPulseCard from './components/MarketPulseCard';
import RawJsonViewer from './components/RawJsonViewer';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawJson, setRawJson] = useState(null);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const fetchMarketData = async (ticker) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/market-pulse?ticker=${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMarketData(data);
      setRawJson(data);
      console.log(data)
    } catch (err) {
      setError(err.message);
      setMarketData(null);
      setRawJson(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Market Pulse
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={fetchMarketData} loading={loading} darkMode={darkMode} />

        {/* Error Message */}
        {error && (
          <div className={`mt-6 p-4 rounded-lg border ${
            darkMode 
              ? 'bg-red-900/20 border-red-500 text-red-300' 
              : 'bg-red-50 border-red-300 text-red-700'
          }`}>
            <p className="font-medium">Error fetching data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {marketData && (
          <div className="mt-8 space-y-6">
            {/* Market Pulse Card */}
            <MarketPulseCard data={marketData} darkMode={darkMode} />
            
            {/* Raw JSON Viewer */}
            <RawJsonViewer data={rawJson} darkMode={darkMode} />
          </div>
        )}

        {/* Empty State */}
        {!marketData && !loading && !error && (
          <div className="mt-16 text-center">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              📈
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Search for a Stock Ticker
            </h2>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Enter a ticker symbol like TSLA, AAPL, or MSFT to get market insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
