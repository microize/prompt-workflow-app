import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the context providers to prevent errors during testing
jest.mock('./context/AppContext', () => ({
  AppContextProvider: ({ children }) => children,
  useAppContext: () => ({
    searchQuery: '',
    setSearchQuery: jest.fn(),
    isLoading: false,
    searchResults: [],
    activeFilters: {},
    handleFilterClick: jest.fn(),
    recentlyUsedPrompts: [],
    popularPrompts: [],
    favorites: [],
    setSelectedPrompt: jest.fn(),
    openPlayground: jest.fn(),
    toggleFavorite: jest.fn()
  })
}));

test('renders the app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Prompt App/i);
  expect(titleElement).toBeInTheDocument();
});