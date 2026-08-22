import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  Code2,
  BookOpen,
  MessageSquare,
  Briefcase,
  Settings,
  User,
  Activity,
  LucideIcon
} from 'lucide-react';
import { NavTabId } from '../../types/dashboard';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: NavTabId; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Career Roadmap', icon: GitFork },
    { id: 'practice', label: 'Practice & Coding', icon: Code2 },
    { id: 'learn', label: 'Learning Resources', icon: BookOpen },
    { id: 'communication', label: 'Communication Prep', icon: MessageSquare },
    { id: 'opportunities', label: 'Opportunities & Jobs', icon: Briefcase },
  ];

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      {/* Brand Icon */}
      <button
        className="sidebar-logo"
        onClick={() => onTabChange('dashboard')}
        title="CAREEROS Student Dashboard"
        aria-label="CAREEROS Home"
      >
        <Activity size={24} strokeWidth={2.5} />
      </button>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="nav-tooltip">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="sidebar-footer">
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onTabChange('settings')}
          aria-label="Settings"
        >
          <Settings size={20} />
          <span className="nav-tooltip">Settings</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
          aria-label="Profile"
        >
          <User size={20} />
          <span className="nav-tooltip">My Profile</span>
        </button>
      </div>
    </aside>
  );
};
