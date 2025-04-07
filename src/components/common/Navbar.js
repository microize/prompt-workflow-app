import React, { useState } from 'react';
import { 
  Home, 
  Sparkles, 
  GitBranch, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  BookOpen,
  Clock,
  Library,
  Calendar,
  List
} from 'lucide-react';

const Navbar = ({ navCollapsed, toggleNav, activePage, setActivePage }) => {
  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    prompt: true,
    workflow: true
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div 
      className={`bg-neutral-800 text-white transition-all duration-300 ${
        navCollapsed ? 'w-16' : 'w-64'
      } border-r border-neutral-700 overflow-y-auto`}
    >
      {/* Header section with centered toggle button when collapsed */}
      <div className={`p-6 ${navCollapsed ? 'flex justify-center' : 'flex justify-between items-center'}`}>
        {!navCollapsed && <h2 className="font-semibold text-xl tracking-tight">Prompt App</h2>}
        <button 
          onClick={toggleNav} 
          className="p-2 rounded hover:bg-neutral-700 transition-colors"
          aria-label={navCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {navCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="mt-2">
        {/* Home - Top level item */}
        <NavItem 
          icon={<Home size={20} />}
          label="Home"
          isActive={activePage === 'home'}
          onClick={() => setActivePage('home')}
          navCollapsed={navCollapsed}
        />
        
        {/* PROMPT SECTION */}
        {!navCollapsed && (
          <SectionHeader 
            label="Prompt" 
            isExpanded={expandedSections.prompt}
            onToggle={() => toggleSection('prompt')}
          />
        )}
        
        {/* Only show sub-items if section is expanded */}
        {(!navCollapsed && expandedSections.prompt) && (
          <>
            <SubNavItem 
              icon={<PlayCircle size={18} />}
              label="Playground"
              isActive={activePage === 'playground'}
              onClick={() => setActivePage('playground')}
            />
            
            <SubNavItem 
              icon={<Library size={18} />}
              label="Prompt Library"
              isActive={activePage === 'prompt_library'}
              onClick={() => setActivePage('prompt_library')}
            />
            
            <SubNavItem 
              icon={<Clock size={18} />}
              label="History"
              isActive={activePage === 'prompt_history'}
              onClick={() => setActivePage('prompt_history')}
            />
          </>
        )}
        
        {/* If collapsed, show just the main icons for this section */}
        {navCollapsed && (
          <>
            <NavItem 
              icon={<PlayCircle size={20} />}
              label="Playground"
              isActive={activePage === 'playground'}
              onClick={() => setActivePage('playground')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Library size={20} />}
              label="Prompt Library"
              isActive={activePage === 'prompt_library'}
              onClick={() => setActivePage('prompt_library')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Clock size={20} />}
              label="History"
              isActive={activePage === 'prompt_history'}
              onClick={() => setActivePage('prompt_history')}
              navCollapsed={navCollapsed}
            />
          </>
        )}
        
        {/* WORKFLOW SECTION */}
        {!navCollapsed && (
          <SectionHeader 
            label="Workflow" 
            isExpanded={expandedSections.workflow}
            onToggle={() => toggleSection('workflow')}
          />
        )}
        
        {/* Only show sub-items if section is expanded */}
        {(!navCollapsed && expandedSections.workflow) && (
          <>
            <SubNavItem 
              icon={<GitBranch size={18} />}
              label="Editor"
              isActive={activePage === 'workflow'}
              onClick={() => setActivePage('workflow')}
            />
            
            <SubNavItem 
              icon={<BookOpen size={18} />}
              label="Workflow Library"
              isActive={activePage === 'workflow_library'}
              onClick={() => setActivePage('workflow_library')}
            />
            
            <SubNavItem 
              icon={<Calendar size={18} />}
              label="Jobs"
              isActive={activePage === 'jobs'}
              onClick={() => setActivePage('jobs')}
            />
          </>
        )}
        
        {/* If collapsed, show just the main icons for this section */}
        {navCollapsed && (
          <>
            <NavItem 
              icon={<GitBranch size={20} />}
              label="Editor"
              isActive={activePage === 'workflow'}
              onClick={() => setActivePage('workflow')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<BookOpen size={20} />}
              label="Workflow Library"
              isActive={activePage === 'workflow_library'}
              onClick={() => setActivePage('workflow_library')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Calendar size={20} />}
              label="Jobs"
              isActive={activePage === 'jobs'}
              onClick={() => setActivePage('jobs')}
              navCollapsed={navCollapsed}
            />
          </>
        )}
        
        {/* SETTINGS - always visible */}
        <NavItem 
          icon={<Settings size={20} />}
          label="Settings"
          isActive={activePage === 'settings'}
          onClick={() => setActivePage('settings')}
          navCollapsed={navCollapsed}
        />
      </div>
    </div>
  );
};

// Component for section headers (Prompt, Workflow)
const SectionHeader = ({ label, isExpanded, onToggle }) => {
  return (
    <div className="mt-4 mb-1">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-2 text-neutral-400 hover:text-white"
      >
        <span className="font-medium text-sm uppercase tracking-wider">{label}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </div>
  );
};

// Helper component for top-level nav items
const NavItem = ({ icon, label, isActive, onClick, navCollapsed }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center py-3 ${navCollapsed ? 'justify-center' : 'px-6'} transition-colors ${
        isActive 
          ? 'bg-neutral-700' 
          : 'hover:bg-neutral-700'
      }`}
      aria-label={label}
    >
      <div className={`${isActive ? 'text-primary-500' : 'text-neutral-400'} ${navCollapsed ? 'ml-0' : ''}`}>
        {icon}
      </div>
      {!navCollapsed && (
        <span className={`ml-4 ${isActive ? 'font-medium text-white' : 'text-neutral-300'}`}>
          {label}
        </span>
      )}
    </button>
  );
};

// Helper component for sub-nav items
const SubNavItem = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center py-2 pl-12 pr-6 transition-colors ${
        isActive 
          ? 'bg-neutral-700' 
          : 'hover:bg-neutral-700'
      }`}
      aria-label={label}
    >
      <div className={`${isActive ? 'text-primary-500' : 'text-neutral-400'}`}>
        {icon}
      </div>
      <span className={`ml-3 text-sm ${isActive ? 'font-medium text-white' : 'text-neutral-300'}`}>
        {label}
      </span>
    </button>
  );
};

export default Navbar;