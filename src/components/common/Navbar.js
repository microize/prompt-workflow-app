import React from 'react';
import { Menu, Sparkles, GitBranch, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar = ({ navCollapsed, toggleNav, activePage, setActivePage }) => {
  return (
    <div className={`bg-[#1d2536] text-white transition-all duration-300 ${navCollapsed ? 'w-16' : 'w-64'} border-r border-[#2c3344]`}>
      {/* Header section with centered toggle button when collapsed */}
      <div className={`p-6 ${navCollapsed ? 'flex justify-center' : 'flex justify-between items-center'}`}>
        {!navCollapsed && <h2 className="font-semibold text-xl tracking-tight">Prompt App</h2>}
        <button onClick={toggleNav} className="p-2 rounded transition-colors">
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
      className={`w-full flex items-center py-4 ${navCollapsed ? 'justify-center' : 'px-6'} transition-colors ${isActive ? 'bg-[#2c3344]' : 'hover:bg-[#252c3c]'}`}
    >
      <div className={`${isActive ? 'text-[#4285f4]' : 'text-gray-400'} ${navCollapsed ? 'ml-0' : ''}`}>
        {icon}
      </div>
      {!navCollapsed && <span className={`ml-4 ${isActive ? 'font-medium text-white' : 'text-gray-300'}`}>{label}</span>}
    </button>
  );
};

export default Navbar;