// Sample prompts data with expanded dataset and additional metadata
export const promptDatabase = [
  { id: 1, text: "Create a landing page for a SaaS product", category: "web", usageCount: 243, tags: ["Marketing", "Web Design", "SaaS"] },
  { id: 2, text: "Design a logo for a coffee shop", category: "design", usageCount: 187, tags: ["Branding", "Design", "Food & Beverage"] },
  { id: 3, text: "Write a product description for a smartphone", category: "writing", usageCount: 156, tags: ["E-commerce", "Copywriting", "Tech"] },
  { id: 4, text: "Generate a business plan for a startup", category: "business", usageCount: 129, tags: ["Business", "Strategy", "Startups"] },
  { id: 5, text: "Create an email marketing campaign", category: "marketing", usageCount: 312, tags: ["Marketing", "Email", "Campaigns"] },
  { id: 6, text: "Create a responsive design for an e-commerce website", category: "web", usageCount: 276, tags: ["Web Design", "E-commerce", "Responsive"] },
  { id: 7, text: "Design an icon set for a mobile application", category: "design", usageCount: 204, tags: ["Mobile", "UI/UX", "Icons"] },
  { id: 8, text: "Write copy for a tech startup homepage", category: "writing", usageCount: 198, tags: ["Copywriting", "Startups", "Tech"] },
  { id: 9, text: "Generate social media content for a restaurant", category: "marketing", usageCount: 289, tags: ["Social Media", "Food & Beverage", "Content"] },
  { id: 10, text: "Create a marketing strategy for a fitness app", category: "marketing", usageCount: 234, tags: ["Marketing", "Strategy", "Health", "Mobile"] },
  { id: 11, text: "Develop a wireframe for a booking platform", category: "design", usageCount: 178, tags: ["UI/UX", "Web Design", "Wireframing"] },
  { id: 12, text: "Write SEO-optimized blog content", category: "writing", usageCount: 246, tags: ["SEO", "Content", "Blogging"] },
  { id: 13, text: "Create a user onboarding flow", category: "web", usageCount: 197, tags: ["UX", "Onboarding", "Web Design"] },
  { id: 14, text: "Design a newsletter template", category: "design", usageCount: 165, tags: ["Email", "Marketing", "Design"] },
  { id: 15, text: "Write product FAQs for an electronics store", category: "writing", usageCount: 132, tags: ["E-commerce", "Copywriting", "Support"] },
  { id: 16, text: "Create a sales funnel for an online course", category: "marketing", usageCount: 267, tags: ["Sales", "E-learning", "Marketing"] },
  { id: 17, text: "Design a pricing page for a subscription service", category: "web", usageCount: 228, tags: ["Web Design", "Pricing", "Subscriptions"] },
  { id: 18, text: "Write a press release for a product launch", category: "writing", usageCount: 186, tags: ["PR", "Marketing", "Launch"] },
  { id: 19, text: "Create a content strategy for a blog", category: "marketing", usageCount: 254, tags: ["Content", "Strategy", "Blogging"] },
  { id: 20, text: "Design a mobile app interface for a delivery service", category: "design", usageCount: 293, tags: ["Mobile", "UI/UX", "Delivery"] },
  { id: 21, text: "Create an AI-powered chatbot script for customer service", category: "development", usageCount: 187, tags: ["AI", "Customer Service", "Chatbot"] },
  { id: 22, text: "Write a financial report for quarterly results", category: "business", usageCount: 145, tags: ["Finance", "Reporting", "Business"] },
  { id: 23, text: "Design an infographic about climate change", category: "design", usageCount: 221, tags: ["Infographics", "Environment", "Data Visualization"] },
  { id: 24, text: "Draft a fundraising pitch for a nonprofit organization", category: "writing", usageCount: 176, tags: ["Nonprofit", "Fundraising", "Pitch"] },
  { id: 25, text: "Create personalized product recommendations based on user data", category: "development", usageCount: 209, tags: ["AI", "Personalization", "E-commerce"] },
  { id: 26, text: "Design a user dashboard for a fitness tracking app", category: "design", usageCount: 251, tags: ["UI/UX", "Health", "Dashboard"] },
  { id: 27, text: "Write a guide to search engine optimization for beginners", category: "writing", usageCount: 298, tags: ["SEO", "Guide", "Marketing"] },
  { id: 28, text: "Create a customer journey map for an e-commerce store", category: "marketing", usageCount: 187, tags: ["UX", "Customer Journey", "E-commerce"] },
  { id: 29, text: "Write Python code to analyze customer sentiment from reviews", category: "development", usageCount: 231, tags: ["Python", "AI", "Sentiment Analysis"] },
  { id: 30, text: "Create a business proposal for a consulting engagement", category: "business", usageCount: 164, tags: ["Business", "Proposal", "Consulting"] }
];

export const recentlyUsedPrompts = [
  { id: 5, text: "Create an email marketing campaign", category: "marketing", usedAt: "2 hours ago", tags: ["Marketing", "Email", "Campaigns"] },
  { id: 2, text: "Design a logo for a coffee shop", category: "design", usedAt: "Yesterday", tags: ["Branding", "Design", "Food & Beverage"] },
  { id: 13, text: "Create a user onboarding flow", category: "web", usedAt: "Yesterday", tags: ["UX", "Onboarding", "Web Design"] },
  { id: 9, text: "Generate social media content for a restaurant", category: "marketing", usedAt: "2 days ago", tags: ["Social Media", "Food & Beverage", "Content"] },
  { id: 18, text: "Write a press release for a product launch", category: "writing", usedAt: "2 days ago", tags: ["PR", "Marketing", "Launch"] },
  { id: 20, text: "Design a mobile app interface for a delivery service", category: "design", usedAt: "3 days ago", tags: ["Mobile", "UI/UX", "Delivery"] },
  { id: 6, text: "Create a responsive design for an e-commerce website", category: "web", usedAt: "3 days ago", tags: ["Web Design", "E-commerce", "Responsive"] },
  { id: 10, text: "Create a marketing strategy for a fitness app", category: "marketing", usedAt: "4 days ago", tags: ["Marketing", "Strategy", "Health", "Mobile"] },
  { id: 15, text: "Write product FAQs for an electronics store", category: "writing", usedAt: "5 days ago", tags: ["E-commerce", "Copywriting", "Support"] },
  { id: 11, text: "Develop a wireframe for a booking platform", category: "design", usedAt: "Last week", tags: ["UI/UX", "Web Design", "Wireframing"] }
];

export const initialFavorites = [
  { id: 1, text: "Create a landing page for a SaaS product", category: "web", addedAt: "April 1, 2025", tags: ["Marketing", "Web Design", "SaaS"] },
  { id: 7, text: "Design an icon set for a mobile application", category: "design", addedAt: "April 1, 2025", tags: ["Mobile", "UI/UX", "Icons"] },
  { id: 12, text: "Write SEO-optimized blog content", category: "writing", addedAt: "April 2, 2025", tags: ["SEO", "Content", "Blogging"] },
  { id: 9, text: "Generate social media content for a restaurant", category: "marketing", addedAt: "April 2, 2025", tags: ["Social Media", "Food & Beverage", "Content"] },
  { id: 17, text: "Design a pricing page for a subscription service", category: "web", addedAt: "April 3, 2025", tags: ["Web Design", "Pricing", "Subscriptions"] },
  { id: 20, text: "Design a mobile app interface for a delivery service", category: "design", addedAt: "April 3, 2025", tags: ["Mobile", "UI/UX", "Delivery"] },
  { id: 3, text: "Write a product description for a smartphone", category: "writing", addedAt: "April 3, 2025", tags: ["E-commerce", "Copywriting", "Tech"] },
  { id: 19, text: "Create a content strategy for a blog", category: "marketing", addedAt: "April 4, 2025", tags: ["Content", "Strategy", "Blogging"] },
  { id: 6, text: "Create a responsive design for an e-commerce website", category: "web", addedAt: "April 4, 2025", tags: ["Web Design", "E-commerce", "Responsive"] },
  { id: 14, text: "Design a newsletter template", category: "design", addedAt: "April 5, 2025", tags: ["Email", "Marketing", "Design"] }
];