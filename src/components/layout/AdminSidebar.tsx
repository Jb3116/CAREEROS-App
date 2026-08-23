import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  ClipboardCheck,
  Megaphone,
  Briefcase,
  Building2,
  Sliders,
  Users,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

interface AdminNavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Master Navigation Items for College Admin & TPO Placement Command Center
  const navItems: AdminNavItem[] = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'calendar',
      label: 'Placement Calendar',
      path: '/admin/placement-calendar',
      icon: CalendarDays,
    },
    {
      id: 'opportunities',
      label: 'Opportunity Manager',
      path: '/admin/opportunities',
      icon: CalendarCheck,
    },
    {
      id: 'criteria',
      label: 'Interview Criteria',
      path: '/admin/interview-criteria',
      icon: ClipboardCheck,
    },
    {
      id: 'announcements',
      label: 'Announcements Hub',
      path: '/admin/announcements',
      icon: Megaphone,
    },
    {
      id: 'companies',
      label: 'Company Registry',
      path: '/admin/companies',
      icon: Briefcase,
    },
    {
      id: 'drives',
      label: 'Campus Placement Drives',
      path: '/admin/drives',
      icon: Building2,
    },
    {
      id: 'students',
      label: 'Student Cohort Roster',
      path: '/admin/students',
      icon: Users,
    },
    {
      id: 'control',
      label: 'Placement Control Center',
      path: '/admin/control',
      icon: Sliders,
    },
    {
      id: 'analytics',
      label: 'Batch Readiness Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Campus TPO Settings',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  const checkIsActive = (item: AdminNavItem) => {
    if (location.pathname === item.path) return true;
    if (item.id === 'control' && (location.pathname === '/admin/control' || location.pathname === '/admin/settings')) {
      return true;
    }
    return false;
  };

  return (
    <aside className="admin-sidebar" aria-label="College Admin Sidebar Navigation">
      {/* Brand Header */}
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo-icon">
          <GraduationCap size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            CAREEROS
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
            TPO & University Portal
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item);
          return (
            <button
              key={item.id}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* TPO Profile & Logout */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 16, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 13,
              color: '#FFFFFF',
            }}
          >
            RS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#F8FAFC' }}>Dr. R. K. Sharma</span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Head of Placement Cell</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#F87171',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
          type="button"
        >
          <LogOut size={14} />
          <span>Exit Admin Portal (Logout)</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
