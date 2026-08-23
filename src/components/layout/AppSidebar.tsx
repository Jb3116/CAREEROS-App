import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  ClipboardCheck,
  Map,
  BookOpen,
  FileText,
  Briefcase,
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
}

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Full CAREEROS master navigation items including Opportunities & Smart Calendar
  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'practice', label: 'Aptitude & Coding', path: '/practice', icon: Code2 },
    { id: 'assessment', label: 'Placement Assessment', path: '/assessment', icon: ClipboardCheck },
    { id: 'career-roadmap', label: 'Career Roadmap', path: '/career-roadmap', icon: Map },
    { id: 'opportunities', label: 'Opportunities & Calendar', path: '/opportunities', icon: Briefcase },
    { id: 'learning', label: 'Learning Hub', path: '/learning', icon: BookOpen },
    { id: 'resume', label: 'Resume Builder', path: '/resume-builder', icon: FileText },
  ];

  const isCurrentActive = (item: NavItemConfig): boolean => {
    if (location.pathname === item.path) return true;
    if (item.id === 'career-roadmap' && (location.pathname === '/career-roadmap' || location.pathname === '/roadmap')) {
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
          tooltip="Profile"
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          aria-current={location.pathname === '/profile' ? 'page' : undefined}
          type="button"
        >
          <User size={20} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
