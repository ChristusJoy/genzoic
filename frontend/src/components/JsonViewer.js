import React from 'react';

function JsonViewer({ data }) {
  return (
    <pre className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg max-w-xl overflow-x-auto w-full text-xs shadow-inner">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default JsonViewer;