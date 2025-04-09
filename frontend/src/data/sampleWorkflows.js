// Sample workflows data
export const sampleWorkflows = [
    {
      id: 1,
      name: "Content Marketing Pipeline",
      description: "Generate blog post ideas, outlines, and full articles",
      steps: [
        { id: 1, name: "Generate Topic Ideas", prompt: "Generate 10 blog post ideas about [TOPIC] for [AUDIENCE]" },
        { id: 2, name: "Create Outline", prompt: "Create a detailed outline for an article about [SELECTED_TOPIC]" },
        { id: 3, name: "Write Full Article", prompt: "Write a 1500-word article based on this outline: [OUTLINE]" }
      ],
      lastUsed: "Yesterday",
      category: "marketing"
    },
    {
      id: 2,
      name: "Product Description Workflow",
      description: "Create compelling product descriptions from basic information",
      steps: [
        { id: 1, name: "Extract Key Features", prompt: "Extract the 5 most important features from this product information: [PRODUCT_INFO]" },
        { id: 2, name: "Identify Target Audience", prompt: "Based on these features, identify the ideal target audience: [FEATURES]" },
        { id: 3, name: "Write Description", prompt: "Write a compelling product description for [AUDIENCE] highlighting these features: [FEATURES]" }
      ],
      lastUsed: "3 days ago",
      category: "writing"
    },
    {
      id: 3,
      name: "Code Documentation",
      description: "Analyze code and generate documentation",
      steps: [
        { id: 1, name: "Code Analysis", prompt: "Analyze this code and explain what it does: [CODE]" },
        { id: 2, name: "Generate Comments", prompt: "Generate appropriate comments for this code: [CODE]" },
        { id: 3, name: "Create README", prompt: "Create a README.md file for this project based on the code analysis: [ANALYSIS]" }
      ],
      lastUsed: "Last week",
      category: "development"
    }
  ];