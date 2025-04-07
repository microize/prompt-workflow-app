import React from 'react';
import { 
  Home, 
  Sparkles, 
  GitBranch, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  PlayCircle,
  BookOpen,
  Clock,
  Library,
  Calendar,
  FileText
} from 'lucide-react';

const Navbar = ({ navCollapsed, toggleNav, activePage, setActivePage }) => {
  return (
    <div 
      className={`bg-white text-neutral-700 transition-all duration-300 ${
        navCollapsed ? 'w-16' : 'w-64'
      } border-r border-neutral-200 flex flex-col h-full overflow-x-hidden`}
    >
      {/* Header section with app name and toggle button */}
      <div className={`p-4 border-b border-neutral-200 ${navCollapsed ? 'flex justify-center' : 'flex justify-between items-center'}`}>
        {!navCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center mr-2">
              <span className="text-white font-semibold">P</span>
            </div>
            <div>
              <h2 className="font-medium text-neutral-900">Prompt App</h2>
              <div className="text-xs text-neutral-500">v4.0</div>
            </div>
          </div>
        )}
        {navCollapsed && (
          <div 
            className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center cursor-pointer"
            onClick={toggleNav}
          >
            <span className="text-white font-semibold">P</span>
          </div>
        )}
        {!navCollapsed && (
          <button 
            onClick={toggleNav} 
            className="p-1 rounded hover:bg-neutral-100 transition-colors text-neutral-400"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* GENERAL SECTION */}
        {!navCollapsed && (
          <SectionHeader label="General" />
        )}
        
        <NavItem 
          icon={<Home size={18} />}
          label="Dashboard"
          isActive={activePage === 'home'}
          onClick={() => setActivePage('home')}
          navCollapsed={navCollapsed}
        />

        {/* PROMPT SECTION */}
        {!navCollapsed && (
          <SectionHeader label="Prompt" />
        )}
        
        {/* Always show items, no toggle */}
        {!navCollapsed ? (
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
        ) : (
          <>
            <NavItem 
              icon={<PlayCircle size={18} />}
              label="Playground"
              isActive={activePage === 'playground'}
              onClick={() => setActivePage('playground')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Library size={18} />}
              label="Prompt Library"
              isActive={activePage === 'prompt_library'}
              onClick={() => setActivePage('prompt_library')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Clock size={18} />}
              label="History"
              isActive={activePage === 'prompt_history'}
              onClick={() => setActivePage('prompt_history')}
              navCollapsed={navCollapsed}
            />
          </>
        )}
        
        {/* WORKFLOW SECTION */}
        {!navCollapsed && (
          <SectionHeader label="Workflow" />
        )}
        
        {/* Always show items, no toggle */}
        {!navCollapsed ? (
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
        ) : (
          <>
            <NavItem 
              icon={<GitBranch size={18} />}
              label="Editor"
              isActive={activePage === 'workflow'}
              onClick={() => setActivePage('workflow')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<BookOpen size={18} />}
              label="Workflow Library"
              isActive={activePage === 'workflow_library'}
              onClick={() => setActivePage('workflow_library')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Calendar size={18} />}
              label="Jobs"
              isActive={activePage === 'jobs'}
              onClick={() => setActivePage('jobs')}
              navCollapsed={navCollapsed}
            />
          </>
        )}
      </div>
      
      {/* SETTINGS - always visible at bottom */}
      <div className="border-t border-neutral-200 mt-auto">
        <NavItem 
          icon={<Settings size={18} />}
          label="Settings"
          isActive={activePage === 'settings'}
          onClick={() => setActivePage('settings')}
          navCollapsed={navCollapsed}
        />
        <NavItem 
          icon={<FileText size={18} />}
          label="Documentation"
          isActive={activePage === 'documentation'}
          onClick={() => setActivePage('documentation')}
          navCollapsed={navCollapsed}
        />
      </div>
    </div>
  );
};

// Simplified component for section headers without toggle functionality
const SectionHeader = ({ label }) => {
  return (
    <div className="mt-2 mb-0.5 px-3">
      <div className="flex items-center text-neutral-500">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

// Helper component for top-level nav items
const NavItem = ({ icon, label, isActive, onClick, navCollapsed, badge }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center py-2 ${
        navCollapsed 
          ? 'justify-center px-0 mx-0' 
          : 'px-3 mx-0'
      } transition-colors ${
        isActive 
          ? 'bg-neutral-100 text-neutral-900' 
          : 'hover:bg-neutral-50 text-neutral-700'
      }`}
      aria-label={label}
    >
      <div className={`flex items-center justify-center ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
        {icon}
      </div>
      
      {!navCollapsed && (
        <span className={`ml-3 text-sm ${isActive ? 'font-medium text-neutral-900' : 'text-neutral-700'}`}>
          {label}
        </span>
      )}
      
      {!navCollapsed && badge && (
        <span className="ml-auto bg-neutral-200 text-neutral-800 text-xs font-medium rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
      
      {navCollapsed && badge && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-800">
            {badge}
          </span>
        </div>
      )}
    </button>
  );
};

// Helper component for sub-nav items
const SubNavItem = ({ icon, label, isActive, onClick, badge }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center py-2 pl-8 pr-3 transition-colors ${
        isActive 
          ? 'bg-neutral-100 text-neutral-900' 
          : 'hover:bg-neutral-50 text-neutral-600'
      }`}
      aria-label={label}
    >
      <div className={`${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
        {icon}
      </div>
      
      <span className={`ml-2 text-sm ${isActive ? 'font-medium text-neutral-900' : 'text-neutral-600'}`}>
        {label}
      </span>
      
      {badge && (
        <span className="ml-auto bg-neutral-200 text-neutral-800 text-xs font-medium rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </button>
  );
};

export default Navbar;