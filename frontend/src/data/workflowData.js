// src/data/workflowData.js
// Sample data for workflows history, favorites, and popular ones

export const recentlyUsedWorkflows = [
    {
      id: 1,
      name: "Content Marketing Pipeline",
      description: "Generate blog post ideas, outlines, and full articles",
      lastUsed: "2 hours ago",
      category: "marketing",
      steps: [
        { id: 1, name: "Generate Topic Ideas", prompt: "Generate 10 blog post ideas about [TOPIC] for [AUDIENCE]" },
        { id: 2, name: "Create Outline", prompt: "Create a detailed outline for an article about [SELECTED_TOPIC]" },
        { id: 3, name: "Write Full Article", prompt: "Write a 1500-word article based on this outline: [OUTLINE]" }
      ]
    },
    {
      id: 2,
      name: "Product Description Workflow",
      description: "Create compelling product descriptions from basic information",
      lastUsed: "Yesterday",
      category: "writing",
      steps: [
        { id: 1, name: "Extract Key Features", prompt: "Extract the 5 most important features from this product information: [PRODUCT_INFO]" },
        { id: 2, name: "Identify Target Audience", prompt: "Based on these features, identify the ideal target audience: [FEATURES]" },
        { id: 3, name: "Write Description", prompt: "Write a compelling product description for [AUDIENCE] highlighting these features: [FEATURES]" }
      ]
    },
    {
      id: 3,
      name: "Code Documentation",
      description: "Analyze code and generate documentation",
      lastUsed: "2 days ago",
      category: "development",
      steps: [
        { id: 1, name: "Code Analysis", prompt: "Analyze this code and explain what it does: [CODE]" },
        { id: 2, name: "Generate Comments", prompt: "Generate appropriate comments for this code: [CODE]" },
        { id: 3, name: "Create README", prompt: "Create a README.md file for this project based on the code analysis: [ANALYSIS]" }
      ]
    },
    {
      id: 4,
      name: "Customer Support Workflow",
      description: "Generate responses for customer inquiries and support tickets",
      lastUsed: "3 days ago",
      category: "business",
      steps: [
        { id: 1, name: "Analyze Query", prompt: "Analyze this customer query and identify the main issues: [QUERY]" },
        { id: 2, name: "Generate Response", prompt: "Create a helpful and friendly response to address these issues: [ISSUES]" },
        { id: 3, name: "Follow-up Questions", prompt: "Generate potential follow-up questions the customer might have: [RESPONSE]" }
      ]
    },
    {
      id: 5,
      name: "SEO Content Optimization",
      description: "Analyze and optimize content for better search rankings",
      lastUsed: "5 days ago",
      category: "marketing",
      steps: [
        { id: 1, name: "Keyword Analysis", prompt: "Identify the main keywords and topics in this content: [CONTENT]" },
        { id: 2, name: "SEO Recommendations", prompt: "Provide SEO recommendations for these keywords: [KEYWORDS]" },
        { id: 3, name: "Content Optimization", prompt: "Rewrite this content to optimize for SEO: [CONTENT], [RECOMMENDATIONS]" }
      ]
    }
  ];
  
  export const popularWorkflows = [
    {
      id: 1,
      name: "Content Marketing Pipeline",
      description: "Generate blog post ideas, outlines, and full articles",
      category: "marketing",
      usageCount: 521,
      steps: [
        { id: 1, name: "Generate Topic Ideas", prompt: "Generate 10 blog post ideas about [TOPIC] for [AUDIENCE]" },
        { id: 2, name: "Create Outline", prompt: "Create a detailed outline for an article about [SELECTED_TOPIC]" },
        { id: 3, name: "Write Full Article", prompt: "Write a 1500-word article based on this outline: [OUTLINE]" }
      ]
    },
    {
      id: 6,
      name: "Email Campaign Sequence",
      description: "Create a series of marketing emails for a product launch",
      category: "marketing",
      usageCount: 487,
      steps: [
        { id: 1, name: "Introduction Email", prompt: "Write an introduction email announcing this product: [PRODUCT]" },
        { id: 2, name: "Benefits Email", prompt: "Create an email highlighting the key benefits: [PRODUCT]" },
        { id: 3, name: "Testimonial Email", prompt: "Generate an email showcasing customer testimonials: [TESTIMONIALS]" },
        { id: 4, name: "Launch Email", prompt: "Write a final launch email with call to action: [PRODUCT], [OFFER]" }
      ]
    },
    {
      id: 7,
      name: "User Persona Creation",
      description: "Develop detailed user personas for product design",
      category: "design",
      usageCount: 412,
      steps: [
        { id: 1, name: "Demographic Analysis", prompt: "Analyze these user demographics and identify patterns: [DATA]" },
        { id: 2, name: "Behavior Mapping", prompt: "Map user behaviors and motivations based on this data: [DEMOGRAPHICS]" },
        { id: 3, name: "Persona Creation", prompt: "Create detailed user personas with goals, frustrations and motivations: [BEHAVIORS]" }
      ]
    },
    {
      id: 2,
      name: "Product Description Workflow",
      description: "Create compelling product descriptions from basic information",
      category: "writing",
      usageCount: 389,
      steps: [
        { id: 1, name: "Extract Key Features", prompt: "Extract the 5 most important features from this product information: [PRODUCT_INFO]" },
        { id: 2, name: "Identify Target Audience", prompt: "Based on these features, identify the ideal target audience: [FEATURES]" },
        { id: 3, name: "Write Description", prompt: "Write a compelling product description for [AUDIENCE] highlighting these features: [FEATURES]" }
      ]
    },
    {
      id: 3,
      name: "Code Documentation",
      description: "Analyze code and generate documentation",
      category: "development",
      usageCount: 354,
      steps: [
        { id: 1, name: "Code Analysis", prompt: "Analyze this code and explain what it does: [CODE]" },
        { id: 2, name: "Generate Comments", prompt: "Generate appropriate comments for this code: [CODE]" },
        { id: 3, name: "Create README", prompt: "Create a README.md file for this project based on the code analysis: [ANALYSIS]" }
      ]
    }
  ];
  
  export const initialFavoriteWorkflows = [
    {
      id: 1,
      name: "Content Marketing Pipeline",
      description: "Generate blog post ideas, outlines, and full articles",
      category: "marketing",
      addedAt: "April 2, 2025",
      steps: [
        { id: 1, name: "Generate Topic Ideas", prompt: "Generate 10 blog post ideas about [TOPIC] for [AUDIENCE]" },
        { id: 2, name: "Create Outline", prompt: "Create a detailed outline for an article about [SELECTED_TOPIC]" },
        { id: 3, name: "Write Full Article", prompt: "Write a 1500-word article based on this outline: [OUTLINE]" }
      ]
    },
    {
      id: 3,
      name: "Code Documentation",
      description: "Analyze code and generate documentation",
      category: "development",
      addedAt: "April 3, 2025",
      steps: [
        { id: 1, name: "Code Analysis", prompt: "Analyze this code and explain what it does: [CODE]" },
        { id: 2, name: "Generate Comments", prompt: "Generate appropriate comments for this code: [CODE]" },
        { id: 3, name: "Create README", prompt: "Create a README.md file for this project based on the code analysis: [ANALYSIS]" }
      ]
    },
    {
      id: 8,
      name: "API Documentation Generator",
      description: "Auto-generate API documentation from code and specs",
      category: "development",
      addedAt: "April 4, 2025",
      steps: [
        { id: 1, name: "API Endpoint Analysis", prompt: "Analyze these API endpoints and extract key information: [ENDPOINTS]" },
        { id: 2, name: "Parameter Documentation", prompt: "Document all parameters for these endpoints: [ENDPOINTS]" },
        { id: 3, name: "Response Format", prompt: "Document the response formats with examples: [ENDPOINTS]" },
        { id: 4, name: "Error Handling", prompt: "Document error responses and error handling: [ENDPOINTS]" }
      ]
    }
  ];