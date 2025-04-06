import React from 'react';
import { Menu, Sparkles, GitBranch, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar = ({ navCollapsed, toggleNav, activePage, setActivePage }) => {
  return (
    <div className={`bg-neutral-800 text-white transition-all duration-300 ${navCollapsed ? 'w-16' : 'w-64'} border-r border-neutral-700`}>
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
      
      <div className="mt-6">
        <NavItem 
          icon={<Menu size={20} />}
          label="Home"
          isActive={activePage === 'home'}
          onClick={() => setActivePage('home')}
          navCollapsed={navCollapsed}
        />
        
        <NavItem 
          icon={<Sparkles size={20} />}
          label="Playground"
          isActive={activePage === 'playground'}
          onClick={() => setActivePage('playground')}
          navCollapsed={navCollapsed}
        />
        
        <NavItem 
          icon={<GitBranch size={20} />}
          label="Workflow"
          isActive={activePage === 'workflow'}
          onClick={() => setActivePage('workflow')}
          navCollapsed={navCollapsed}
        />
        
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

// Helper component for nav items
const NavItem = ({ icon, label, isActive, onClick, navCollapsed }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center py-4 ${navCollapsed ? 'justify-center' : 'px-6'} transition-colors ${
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

export default Navbar;