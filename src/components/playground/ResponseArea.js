import React from 'react';

const ResponseArea = () => {
  // In a real implementation, we would have a state for the response
  const [response, setResponse] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium text-gray-700 mb-3">AI Response</h3>
      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[200px]">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Generating response...</div>
          </div>
        ) : response ? (
          <div className="prose max-w-none">
            {response}
          </div>
        ) : (
          <p className="text-gray-500 italic">Response will appear here after generating...</p>
        )}
      </div>
    </div>
  );
};

export default ResponseArea;