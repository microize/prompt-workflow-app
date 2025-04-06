import React from 'react';
import { Menu, Sparkles, GitBranch, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar = ({ navCollapsed, toggleNav, activePage, setActivePage }) => {
  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${navCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!navCollapsed && <h2 className="font-bold text-xl">Prompt App</h2>}
        <button onClick={toggleNav} className="p-2 rounded hover:bg-gray-700">
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
      className={`w-full flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}
    >
      {icon}
      {!navCollapsed && <span className="ml-4">{label}</span>}
    </button>
  );
};

export default Navbar;