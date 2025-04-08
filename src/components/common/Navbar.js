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
      className={`bg-neutral-50 text-neutral-700 transition-all duration-300 h-full overflow-x-hidden flex flex-col`}
      style={{ boxShadow: 'none' }} // Ensure no shadow effect
    >
      {/* Header section with app name and toggle button */}
      <div className={`p-4 ${navCollapsed ? 'flex justify-center' : 'flex justify-between items-center'}`}>
        {!navCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center mr-2">
              <span className="text-white font-semibold">P</span>
            </div>
            <div>
              <h2 className="font-medium text-neutral-800">Prompt App</h2>
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
            className="p-1 rounded hover:bg-neutral-200/50 transition-colors text-neutral-500"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {/* GENERAL SECTION */}
        {!navCollapsed && (
          <SectionHeader label="General" />
        )}
        
        <NavItem 
          icon={<Home size={18} strokeWidth={1.75} />}
          label="Dashboard"
          isActive={activePage === 'home'}
          onClick={() => setActivePage('home')}
          navCollapsed={navCollapsed}
        />

        {/* PROMPT SECTION */}
        {!navCollapsed && (
          <SectionHeader label="Prompts" />
        )}
        
        {/* Always show items, no toggle */}
        {!navCollapsed ? (
          <>
            <SubNavItem 
              icon={<PlayCircle size={18} strokeWidth={1.75} />}
              label="Playground"
              isActive={activePage === 'playground'}
              onClick={() => setActivePage('playground')}
            />
            
            <SubNavItem 
              icon={<Library size={18} strokeWidth={1.75} />}
              label="Prompt Library"
              isActive={activePage === 'prompt_library'}
              onClick={() => setActivePage('prompt_library')}
            />
            
            <SubNavItem 
              icon={<Clock size={18} strokeWidth={1.75} />}
              label="History"
              isActive={activePage === 'prompt_history'}
              onClick={() => setActivePage('prompt_history')}
            />
          </>
        ) : (
          <>
            <NavItem 
              icon={<PlayCircle size={18} strokeWidth={1.75} />}
              label="Playground"
              isActive={activePage === 'playground'}
              onClick={() => setActivePage('playground')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Library size={18} strokeWidth={1.75} />}
              label="Prompt Library"
              isActive={activePage === 'prompt_library'}
              onClick={() => setActivePage('prompt_library')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Clock size={18} strokeWidth={1.75} />}
              label="History"
              isActive={activePage === 'prompt_history'}
              onClick={() => setActivePage('prompt_history')}
              navCollapsed={navCollapsed}
            />
          </>
        )}
        
        {/* WORKFLOW SECTION */}
        {!navCollapsed && (
          <SectionHeader label="Workflows" />
        )}
        
        {/* Always show items, no toggle */}
        {!navCollapsed ? (
          <>
            <SubNavItem 
              icon={<GitBranch size={18} strokeWidth={1.75} />}
              label="Editor"
              isActive={activePage === 'workflow'}
              onClick={() => setActivePage('workflow')}
            />
            
            <SubNavItem 
              icon={<BookOpen size={18} strokeWidth={1.75} />}
              label="Workflow Library"
              isActive={activePage === 'workflow_library'}
              onClick={() => setActivePage('workflow_library')}
            />
            
            <SubNavItem 
              icon={<Calendar size={18} strokeWidth={1.75} />}
              label="Jobs"
              isActive={activePage === 'jobs'}
              onClick={() => setActivePage('jobs')}
            />
          </>
        ) : (
          <>
            <NavItem 
              icon={<GitBranch size={18} strokeWidth={1.75} />}
              label="Editor"
              isActive={activePage === 'workflow'}
              onClick={() => setActivePage('workflow')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<BookOpen size={18} strokeWidth={1.75} />}
              label="Workflow Library"
              isActive={activePage === 'workflow_library'}
              onClick={() => setActivePage('workflow_library')}
              navCollapsed={navCollapsed}
            />
            
            <NavItem 
              icon={<Calendar size={18} strokeWidth={1.75} />}
              label="Jobs"
              isActive={activePage === 'jobs'}
              onClick={() => setActivePage('jobs')}
              navCollapsed={navCollapsed}
            />
          </>
        )}
      </div>
      
      {/* SETTINGS - always visible at bottom with margin-top auto */}
      <div className="mt-auto border-t border-neutral-200/50 pt-2">
        <NavItem 
          icon={<Settings size={18} strokeWidth={1.75} />}
          label="Settings"
          isActive={activePage === 'settings'}
          onClick={() => setActivePage('settings')}
          navCollapsed={navCollapsed}
        />
        <NavItem 
          icon={<FileText size={18} strokeWidth={1.75} />}
          label="Documentation"
          isActive={activePage === 'documentation'}
          onClick={() => setActivePage('documentation')}
          navCollapsed={navCollapsed}
          className="mb-4"
        />
      </div>
    </div>
  );
};

// Simplified component for section headers without toggle functionality
const SectionHeader = ({ label }) => {
  return (
    <div className="mt-4 mb-1 px-4">
      <div className="flex items-center text-neutral-400">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

// Helper component for top-level nav items
const NavItem = ({ icon, label, isActive, onClick, navCollapsed, badge, className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center py-2.5 ${
        navCollapsed 
          ? 'justify-center px-0' 
          : 'px-4'
      } transition-colors ${
        isActive 
          ? 'text-primary-600 bg-primary-50 font-medium' 
          : 'hover:bg-neutral-100 hover:text-neutral-800 text-neutral-600'
      } ${className}`}
      aria-label={label}
    >
      <div className={`flex items-center justify-center ${navCollapsed ? 'w-full' : ''}`}>
        {icon}
      </div>
      
      {!navCollapsed && (
        <span className="ml-3 text-sm">
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
      className={`w-full flex items-center py-2.5 pl-10 pr-4 transition-colors ${
        isActive 
          ? 'text-primary-600 bg-primary-50 font-medium' 
          : 'hover:bg-neutral-100 hover:text-neutral-800 text-neutral-600'
      }`}
      aria-label={label}
    >
      <div>
        {icon}
      </div>
      
      <span className="ml-2 text-sm">
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