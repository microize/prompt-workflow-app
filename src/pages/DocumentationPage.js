import React, { useState } from 'react';
import { Search, Book, FileText, Code, PlayCircle, GitBranch, Settings, HelpCircle, Star, X } from 'lucide-react';
import Button from '../components/common/Button';

const DocumentationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  
  // Mock documentation sections
  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: <Book size={18} /> },
    { id: 'prompts', label: 'Prompt Engineering', icon: <FileText size={18} /> },
    { id: 'playground', label: 'Playground', icon: <PlayCircle size={18} /> },
    { id: 'workflows', label: 'Workflows', icon: <GitBranch size={18} /> },
    { id: 'api', label: 'API Reference', icon: <Code size={18} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
    { id: 'faq', label: 'FAQs', icon: <HelpCircle size={18} /> },
  ];
  
  // Mock documentation content
  const documentationContent = {
    'getting-started': (
      <div>
        <h2 className="text-xl font-semibold mb-4">Getting Started with Prompt App</h2>
        <p className="mb-4">
          Welcome to Prompt App, your all-in-one platform for prompt engineering, management, and workflow automation. 
          This guide will help you get started with using the main features of the application.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Key Features</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Prompt Library</strong> - Save and organize prompts for different use cases</li>
          <li><strong>Playground</strong> - Test and refine prompts with different AI models</li>
          <li><strong>Workflows</strong> - Create automated sequences of prompts with conditions</li>
          <li><strong>Scheduled Jobs</strong> - Run workflows on a schedule</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Quick Start Guide</h3>
        <ol className="list-decimal pl-5 space-y-4">
          <li>
            <p className="font-medium">Create your first prompt</p>
            <p className="text-neutral-600">Navigate to the Playground and enter your prompt. Test it with different models and save it to your library.</p>
          </li>
          <li>
            <p className="font-medium">Build a workflow</p>
            <p className="text-neutral-600">Go to the Workflow Editor and create nodes for each step in your process. Connect them to define the flow.</p>
          </li>
          <li>
            <p className="font-medium">Schedule a job</p>
            <p className="text-neutral-600">Set up automated runs of your workflows based on time schedules or triggers.</p>
          </li>
        </ol>
      </div>
    ),
    'prompts': (
      <div>
        <h2 className="text-xl font-semibold mb-4">Prompt Engineering Guide</h2>
        <p className="mb-4">
          Effective prompt engineering is key to getting the best results from AI models. 
          This guide covers best practices and techniques for creating powerful prompts.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Prompt Structure</h3>
        <p className="mb-4">
          A well-structured prompt typically includes:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Clear instructions</strong> - Be specific about what you want</li>
          <li><strong>Context</strong> - Provide necessary background information</li>
          <li><strong>Format guidance</strong> - Specify how you want the response formatted</li>
          <li><strong>Examples</strong> - Include examples to guide the model</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Common Techniques</h3>
        <div className="space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <h4 className="font-medium mb-1">Chain-of-Thought Prompting</h4>
            <p className="text-sm text-neutral-600">Guide the model through a step-by-step reasoning process to improve accuracy.</p>
          </div>
          
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <h4 className="font-medium mb-1">Few-Shot Learning</h4>
            <p className="text-sm text-neutral-600">Provide multiple examples to help the model understand the pattern you want it to follow.</p>
          </div>
          
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <h4 className="font-medium mb-1">Role Prompting</h4>
            <p className="text-sm text-neutral-600">Assign a specific role to the AI to frame its response from that perspective.</p>
          </div>
        </div>
      </div>
    ),
    // Additional content would be defined for other sections
    'playground': (
      <div>
        <h2 className="text-xl font-semibold mb-4">Using the Playground</h2>
        <p>Content about using the playground would go here...</p>
      </div>
    ),
    'workflows': (
      <div>
        <h2 className="text-xl font-semibold mb-4">Creating Workflows</h2>
        <p>Content about workflows would go here...</p>
      </div>
    ),
    'api': (
      <div>
        <h2 className="text-xl font-semibold mb-4">API Reference</h2>
        <p>API documentation would go here...</p>
      </div>
    ),
    'settings': (
      <div>
        <h2 className="text-xl font-semibold mb-4">Configuration Options</h2>
        <p>Settings documentation would go here...</p>
      </div>
    ),
    'faq': (
      <div>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <p>FAQs would go here...</p>
      </div>
    )
  };
  
  // Filter sections based on search
  const filteredSections = searchQuery
    ? sections.filter(section => 
        section.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;
  
  return (
    <div className="p-0 h-full bg-neutral-50">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold">Documentation</h2>
          <p className="text-sm text-neutral-500 mt-1">User guides, API references, and examples</p>
        </div>
        
        <div className="flex h-[calc(100vh-140px)]">
          {/* Left sidebar with sections */}
          <div className="w-64 border-r border-neutral-200 overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search docs..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <nav>
                <ul className="space-y-1">
                  {filteredSections.map(section => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                          activeSection === section.id
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto p-6">
            {documentationContent[activeSection]}
            
            {/* Helpful resources and feedback section */}
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-neutral-700">Was this helpful?</h3>
                  <p className="text-neutral-500 mt-1">Let us know if you have any feedback on this documentation.</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    startIcon={<Star size={16} />}
                  >
                    Rate Documentation
                  </Button>
                  
                  <Button
                    variant="primary"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;