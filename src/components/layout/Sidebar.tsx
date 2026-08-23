import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Map,
  BookOpen,
  Code2,
  FileText,
  User,
  Activity,
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

export const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation Items matching the CAREEROS full suite
  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Placement Assessment', path: '/assessment', icon: ClipboardCheck },
    { id: 'career-roadmap', label: 'Career Roadmap', path: '/career-roadmap', icon: Map },
    { id: 'practice', label: 'Aptitude & Coding', path: '/practice', icon: Code2 },
    { id: 'learning', label: 'Learning Hub', path: '/learning', icon: BookOpen },
    { id: 'resume', label: 'ATS Resume Builder', path: '/resume-builder', icon: FileText },
  ];

  const handleNavClick = (item: NavItemConfig) => {
    navigate(item.path);
  };

  const isCurrentActive = (item: NavItemConfig) => {
    if (location.pathname === item.path) return true;
    if (item.id === 'career-roadmap' && (location.pathname === '/career-roadmap' || location.pathname === '/roadmap')) return true;
    if (activeTab) {
      if (activeTab === item.id) return true;
      if (activeTab === 'practice' && item.id === 'practice') return true;
      if (activeTab === 'roadmap' && item.id === 'career-roadmap') return true;
      if (activeTab === 'learn' && item.id === 'learning') return true;
      if (activeTab === 'resume' && item.id === 'resume') return true;
    }
    return false;
  };

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      {/* Brand Logo Button */}
      <button
        className="sidebar-logo"
        onClick={() => navigate('/')}
        title="CAREEROS Home"
        aria-label="CAREEROS Home"
      >
        <Activity size={24} strokeWidth={2.5} />
      </button>

      {/* Main Navigation List */}
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

      {/* Bottom Profile Footer Action */}
      <div className="sidebar-footer">
        <button
          className={`nav-item ${location.pathname === '/profile' || activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
          aria-label="My Profile"
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
