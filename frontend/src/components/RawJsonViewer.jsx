import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

const RawJsonViewer = ({ data, darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`rounded-xl border ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div 
        className={`p-4 border-b cursor-pointer transition-colors ${
          darkMode 
            ? 'border-gray-700 hover:bg-gray-750' 
            : 'border-gray-200 hover:bg-gray-50'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            ) : (
              <ChevronRight size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            )}
            <h3 className="font-semibold">Raw JSON Data</h3>
          </div>
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className={`p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <pre className={`text-sm overflow-x-auto rounded-lg p-4 ${
            darkMode 
              ? 'bg-gray-900 text-gray-300' 
              : 'bg-gray-50 text-gray-800'
          }`}>
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default RawJsonViewer;
