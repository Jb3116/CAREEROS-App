import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Map,
  Code2,
  BookOpen,
  FileText,
  Briefcase,
  User,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { NavTabId } from '../../types/dashboard';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: NavTabId) => void;
}

interface SidebarNavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Master navigation list matching the Figma Design hierarchy
  const navItems: SidebarNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'practice',
      label: 'Aptitude & Coding',
      path: '/practice',
      icon: Code2,
    },
    {
      id: 'assessment',
      label: 'Placement Assessment',
      path: '/assessment',
      icon: ClipboardCheck,
    },
    {
      id: 'career-roadmap',
      label: 'Career Roadmap',
      path: '/career-roadmap',
      icon: Map,
    },
    {
      id: 'opportunities',
      label: 'Opportunities & Calendar',
      path: '/opportunities',
      icon: Briefcase,
    },
    {
      id: 'learning',
      label: 'Learning Hub',
      path: '/learning',
      icon: BookOpen,
    },
    {
      id: 'resume',
      label: 'ATS Resume Builder',
      path: '/resume-builder',
      icon: FileText,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const checkIsActive = (item: SidebarNavItem): boolean => {
    if (location.pathname === item.path) return true;
    if (item.id === 'career-roadmap' && (location.pathname === '/career-roadmap' || location.pathname === '/roadmap')) {
      return true;
    }
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
    <aside className="sidebar" aria-label="Main Application Sidebar">
      {/* ---------------- Top Brand Logo Button ---------------- */}
      <button
        className="sidebar-logo"
        onClick={() => navigate('/')}
        title="CAREEROS Home"
        aria-label="CAREEROS Home"
        type="button"
      >
        <Activity size={24} strokeWidth={2.5} />
      </button>

      {/* ---------------- Main Navigation Items ---------------- */}
      <nav className="sidebar-nav" aria-label="Sidebar Page Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item);

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
              type="button"
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="nav-tooltip">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ---------------- Bottom Profile Footer ---------------- */}
      <div className="sidebar-footer">
        <button
          className={`nav-item ${location.pathname === '/profile' || activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavigate('/profile')}
          aria-label="My Profile"
          title="My Profile"
          type="button"
        >
          <User size={20} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
          <span className="nav-tooltip">My Profile</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
