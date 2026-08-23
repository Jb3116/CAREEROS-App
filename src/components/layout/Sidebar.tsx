import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  GitFork,
  Code2,
  BookOpen,
  FileText,
  Briefcase,
  Settings,
  User,
  Activity,
  Home,
  Award,
  LucideIcon,
} from 'lucide-react';
import { NavTabId } from '../../types/dashboard';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: NavTabId) => void;
}

interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Placement Assessment', path: '/assessment', icon: Award },
    { id: 'career-roadmap', label: 'Career Roadmap', path: '/career-roadmap', icon: GitFork },
    { id: 'learning', label: 'Learning Hub', path: '/learning', icon: BookOpen },
    { id: 'practice', label: 'Practice & Coding', path: '/practice', icon: Code2 },
    { id: 'resume', label: 'ATS Resume Builder', path: '/resume-builder', icon: FileText },
  ];

  const handleNavClick = (item: NavItemConfig) => {
    if (onTabChange && location.pathname === '/dashboard') {
      if (item.id === 'home') navigate('/');
      else if (item.id === 'assessment') navigate('/assessment');
      else if (item.id === 'career-roadmap') navigate('/career-roadmap');
      else if (item.id === 'learning') navigate('/learning');
      else if (item.id === 'practice') navigate('/practice');
      else if (item.id === 'resume') navigate('/resume-builder');
      else onTabChange(item.id as NavTabId);
    } else {
      navigate(item.path);
    }
  };

  const isCurrentActive = (item: NavItemConfig) => {
    if (activeTab) {
      if (activeTab === item.id) return true;
      if (activeTab === 'roadmap' && item.id === 'career-roadmap') return true;
      if (activeTab === 'learn' && item.id === 'learning') return true;
      if (activeTab === 'resume' && item.id === 'resume') return true;
    }
    if (location.pathname === item.path) return true;
    if (item.id === 'career-roadmap' && (location.pathname === '/career-roadmap' || location.pathname === '/roadmap')) return true;
    return false;
  };

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      {/* Brand Icon (Clicking takes user to /) */}
      <button
        className="sidebar-logo"
        onClick={() => navigate('/')}
        title="CAREEROS Home"
        aria-label="CAREEROS Home"
      >
        <Activity size={24} strokeWidth={2.5} />
      </button>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item);
          return (
            <button
              key={item.id}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="nav-tooltip">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="sidebar-footer">
        <button
          className={`nav-item ${location.pathname === '/profile' || activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          title="My Profile"
        >
          <User size={20} />
          <span className="nav-tooltip">My Profile</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
