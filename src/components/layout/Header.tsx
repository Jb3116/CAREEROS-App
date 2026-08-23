import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Flame,
  Search,
  ChevronDown,
  CheckCheck,
  Sparkles,
  X,
  ClipboardCheck,
  Map,
  User,
  FileText,
  LogOut,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { StudentProfile } from '../../types/dashboard';
import { StreakCalendar } from '../common/StreakCalendar';
import { useStudentProfile } from '../../utils/userProfile';

interface HeaderProps {
  profile?: StudentProfile;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  const navigate = useNavigate();
  const globalProfile = useStudentProfile();
  const activeProfile = {
    ...globalProfile,
    ...profile,
    name: profile?.name && profile.name !== 'Alex Chen' ? profile.name : globalProfile.name,
    college: profile?.college && profile.college !== 'Vellore Institute of Technology' ? profile.college : globalProfile.college,
    year: profile?.year && profile.year !== 'CS @ 3rd Year' ? profile.year : (globalProfile.currentYear || globalProfile.year),
    avatarText: globalProfile.avatarText,
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'AI Roadmap Updated',
      desc: 'Target syllabus updated for upcoming Google SWE coding assessment.',
      time: '10m ago',
      read: false,
      targetPath: '/career-roadmap',
    },
    {
      id: 'n2',
      title: 'New Opportunity Match',
      desc: 'Goldman Sachs posted a SWE Internship matching 94% of your skills.',
      time: '1h ago',
      read: false,
      targetPath: '/opportunities',
    },
    {
      id: 'n3',
      title: 'Daily Streak Milestone',
      desc:
        activeProfile.streakDays > 0
          ? `You have an active ${activeProfile.streakDays}-day learning streak!`
          : 'Start your daily learning streak today by solving 1 challenge!',
      time: 'Today',
      read: true,
      targetPath: '/practice',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (targetPath: string, id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setShowNotifications(false);
    navigate(targetPath);
  };

  // Calculate dynamic greeting (Morning / Afternoon / Evening / Night)
  const hour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeGreeting = 'Good Evening';
  } else if (hour >= 22 || hour < 5) {
    timeGreeting = 'Good Night';
  }

  const firstName = activeProfile.name.trim().split(' ')[0] || 'Champ';

  return (
    <header className="header" role="banner">
      {/* Welcome Title */}
      <div className="header-welcome">
        <div className="header-title-row">
          <h1 className="header-title">{timeGreeting}, {firstName} 👋</h1>
        </div>
        <p className="header-subtitle">Let's make today count.</p>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Quick Nav Shortcuts */}
        <button
          onClick={() => navigate('/assessment')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            fontSize: 12.5,
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: 999,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          title="Start or review Placement Assessment"
        >
          <ClipboardCheck size={14} />
          <span>
            {activeProfile.readinessScore > 0
              ? `Assessment (${activeProfile.readinessScore}%)`
              : 'Diagnostic Assessment'}
          </span>
        </button>

        <button
          onClick={() => navigate('/career-roadmap')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            color: '#4F46E5',
            fontSize: 12.5,
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: 999,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          title="View Adaptive Career Roadmap"
        >
          <Map size={14} />
          <span>Roadmap v3.2</span>
        </button>

        {/* Duolingo-Style Streak Calendar Badge */}
        <StreakCalendar
          compact
          streakDays={activeProfile.streakDays}
          onOpenPractice={() => navigate('/practice')}
        />

        {/* ---------------- Notifications Popover ---------------- */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="header-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            aria-label="Notifications"
            title="View Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
                width: 320,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.15)',
                padding: '16px',
                zIndex: 100,
                animation: 'slideUp 180ms ease-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: '#EEF2FF',
                        color: '#4F46E5',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '1px 7px',
                        borderRadius: 999,
                      }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{ fontSize: 11.5, color: '#4F46E5', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.targetPath, n.id)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: n.read ? '#FAFAFA' : '#F5F7FF',
                      border: n.read ? '1px solid #F1F5F9' : '1px solid #E0E7FF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      cursor: 'pointer',
                      transition: 'background 120ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: '#1E293B' }}>{n.title}</span>
                      <span style={{ fontSize: 10.5, color: '#94A3B8' }}>{n.time}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.35 }}>{n.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Profile Popover Dropdown ---------------- */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div
            className="user-profile-pill"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            title="View Student Profile Menu"
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className="user-avatar">{activeProfile.avatarText}</div>
            <div className="user-info">
              <span className="user-name">{activeProfile.name}</span>
              <span className="user-role">{activeProfile.year}</span>
            </div>
            <ChevronDown size={14} color="#94A3B8" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
                width: 240,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.15)',
                padding: '12px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                animation: 'slideUp 180ms ease-out',
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                <div style={{ fontSize: 13.5, fontWeight: 900, color: '#0F172A' }}>{activeProfile.name}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>{activeProfile.college}</div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <User size={15} color="#4F46E5" />
                <span>My Profile & Skills</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/resume-builder');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <FileText size={15} color="#059669" />
                <span>AI Resume Builder</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  localStorage.removeItem('careeros_tour_completed');
                  window.dispatchEvent(new CustomEvent('careeros-start-tour'));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#4F46E5',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Sparkles size={15} color="#4F46E5" />
                <span>Interactive Website Tour</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  localStorage.removeItem('careeros_auth_user');
                  navigate('/login');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#DC2626',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: 6,
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
