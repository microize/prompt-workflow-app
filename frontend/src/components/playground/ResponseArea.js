import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Download, 
  Check, 
  Clipboard, 
  FileText, 
  MessageSquare,
  Code,
  Image
} from 'lucide-react';

const ResponseArea = ({ response, isGenerating, model, generatedAt }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('text');
  const [tokenCount, setTokenCount] = useState(0);
  
  // Calculate estimated token count
  useEffect(() => {
    if (response) {
      // Rough estimation of tokens (approx. 4 chars per token)
      const estimatedTokens = Math.ceil(response.length / 4);
      setTokenCount(estimatedTokens);
    } else {
      setTokenCount(0);
    }
  }, [response]);
  
  // Handle copying to clipboard
  const handleCopy = () => {
    if (!response) return;
    
    navigator.clipboard.writeText(response);
    setCopySuccess(true);
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  
  // Handle downloading response
  const handleDownload = () => {
    if (!response) return;
    
    const blob = new Blob([response], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header with actions */}
      <div className="flex justify-between items-center p-3 bg-neutral-50 border-b border-neutral-200">
        <h3 className="font-medium text-neutral-700">Response</h3>
        {response && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
              title="Copy to clipboard"
            >
              {copySuccess ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button 
              onClick={handleDownload}
              className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
              title="Download response"
            >
              <Download size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Response content */}
      <div className={`p-4 min-h-[200px] ${isGenerating ? 'bg-neutral-50' : 'bg-white'}`}>
        {isGenerating ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
            <div className="mt-4 h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        ) : response ? (
          <div className="prose max-w-none">
            {response}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
              <MessageSquare size={24} className="text-neutral-400" />
            </div>
            <p className="text-neutral-500 font-medium">Response will appear here</p>
            <p className="text-neutral-400 text-sm mt-1">Run your prompt to generate a response</p>
          </div>
        )}
      </div>
      
      {/* Footer with metadata */}
      {response && (
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clipboard size={12} />
              <span>~{tokenCount} tokens</span>
            </div>
            
            {model && (
              <div className="flex items-center gap-1">
                <FileText size={12} />
                <span>Model: {model}</span>
              </div>
            )}
            
            {generatedAt && (
              <div>
                Generated: {formatTimestamp(generatedAt)}
              </div>
            )}
          </div>
          
          {/* Format options */}
          <div className="flex border border-neutral-200 rounded-md overflow-hidden">
            <FormatButton 
              icon={<MessageSquare size={12} />}
              label="Text"
              isActive={selectedFormat === 'text'}
              onClick={() => setSelectedFormat('text')}
            />
            <FormatButton 
              icon={<Code size={12} />}
              label="Markdown"
              isActive={selectedFormat === 'markdown'}
              onClick={() => setSelectedFormat('markdown')}
            />
            <FormatButton 
              icon={<Image size={12} />}
              label="HTML"
              isActive={selectedFormat === 'html'}
              onClick={() => setSelectedFormat('html')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Format button component
const FormatButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 flex items-center gap-1 text-xs transition-colors ${
      isActive 
        ? 'bg-primary-50 text-primary-600' 
        : 'bg-white text-neutral-600 hover:bg-neutral-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default ResponseArea;