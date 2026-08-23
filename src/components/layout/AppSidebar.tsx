import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  BookOpen,
  Sparkles,
  Map,
  Code2,
  Calendar,
  Mic,
  User,
  Activity,
  LucideIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '../ui/sidebar';

interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  tourId?: string;
  tourTarget?: string;
}

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Full CAREEROS student navigation menu in exact sequential order
  const navItems: NavItemConfig[] = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      tourId: 'dashboard',
      tourTarget: 'dashboard',
    },
    { id: 'resume', label: 'AI Resume Builder', path: '/resume-builder', icon: FileText },
    { id: 'onboarding', label: 'Student Onboarding', path: '/onboarding', icon: UserCheck },
    { id: 'learning', label: 'Learning Hub', path: '/learning', icon: BookOpen },
    {
      id: 'placement',
      label: 'AI Placement',
      path: '/placement',
      icon: Sparkles,
      tourId: 'assessment',
      tourTarget: 'assessment',
    },
    {
      id: 'career-roadmap',
      label: 'AI Roadmap',
      path: '/career-roadmap',
      icon: Map,
      tourId: 'roadmap',
      tourTarget: 'roadmap',
    },
    {
      id: 'practice',
      label: 'Coding & Aptitude',
      path: '/practice',
      icon: Code2,
      tourId: 'practice',
      tourTarget: 'practice',
    },
    {
      id: 'opportunities',
      label: 'Opportunity & Smart Calendar',
      path: '/opportunities',
      icon: Calendar,
      tourId: 'opportunities',
      tourTarget: 'opportunities',
    },
    {
      id: 'interview-studio',
      label: 'AI Interview Studio',
      path: '/interview-studio',
      icon: Mic,
      tourId: 'interview',
      tourTarget: 'interview-studio',
    },
  ];

  const isCurrentActive = (item: NavItemConfig): boolean => {
    if (location.pathname === item.path) return true;
    if (item.id === 'career-roadmap' && (location.pathname === '/career-roadmap' || location.pathname === '/roadmap')) {
      return true;
    }
    if (item.id === 'placement' && (location.pathname === '/placement' || location.pathname === '/assessment')) {
      return true;
    }
    return false;
  };

  return (
    <Sidebar aria-label="Main Application Sidebar">
      {/* ---------------- Top Brand Header ---------------- */}
      <SidebarHeader style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          className="sidebar-logo"
          onClick={() => navigate('/')}
          title="CAREEROS Home"
          aria-label="CAREEROS Home"
          type="button"
        >
          <Activity size={24} strokeWidth={2.5} />
        </button>
      </SidebarHeader>

      {/* ---------------- Main Navigation Menu ---------------- */}
      <SidebarContent>
        <SidebarMenu style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);

            return (
              <SidebarMenuItem key={item.id} style={{ listStyle: 'none' }}>
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.label}
                  onClick={() => navigate(item.path)}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  type="button"
                  data-tour={item.tourTarget}
                  data-tour-id={item.tourId}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ---------------- Bottom Profile Footer ---------------- */}
      <SidebarFooter>
        <SidebarMenuButton
          isActive={location.pathname === '/profile'}
          tooltip="My Profile"
          onClick={() => navigate('/profile')}
          aria-label="My Profile"
          aria-current={location.pathname === '/profile' ? 'page' : undefined}
          type="button"
          data-tour="profile"
          data-tour-id="profile"
        >
          <User size={20} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
