import React, { useState } from 'react';
import { Bell, Flame, Search, ChevronDown, CheckCheck, Sparkles, X } from 'lucide-react';
import { StudentProfile } from '../../types/dashboard';

interface HeaderProps {
  profile: StudentProfile;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenProfile }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'AI Roadmap Updated',
      desc: 'Target syllabus updated for upcoming SWE assessment.',
      time: '10m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'New Opportunity Match',
      desc: 'Goldman Sachs posted a SWE Internship matching 94% of your skills.',
      time: '1h ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'Daily Streak Milestone',
      desc: 'You reached a 5-day continuous learning streak!',
      time: 'Yesterday',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="header" role="banner">
      {/* Welcome Title */}
      <div className="header-welcome">
        <div className="header-title-row">
          <h1 className="header-title">Morning Champ 👋</h1>
        </div>
        <p className="header-subtitle">Let's make today count.</p>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Streak Badge */}
        <div className="streak-badge" title="Consecutive days practiced">
          <Flame size={16} fill="#EA580C" strokeWidth={0} />
          <span>{profile.streakDays} Day Streak</span>
        </div>

        {/* Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            title="View Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>

          {/* Notifications Dropdown */}
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
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                padding: '16px',
                zIndex: 60,
                animation: 'slideUp 200ms ease-out',
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
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: '#EEF2FF',
                        color: '#4F46E5',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '1px 6px',
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
                    style={{ fontSize: 11, color: '#4F46E5', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: n.read ? '#FAFAFA' : '#F5F7FF',
                      border: n.read ? '1px solid #F1F5F9' : '1px solid #E0E7FF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B' }}>{n.title}</span>
                      <span style={{ fontSize: 10, color: '#94A3B8' }}>{n.time}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.3 }}>{n.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Pill */}
        <div
          className="user-profile-pill"
          onClick={onOpenProfile}
          title="View Student Profile"
          role="button"
          tabIndex={0}
        >
          <div className="user-avatar">{profile.avatarText}</div>
          <div className="user-info">
            <span className="user-name">{profile.name}</span>
            <span className="user-role">{profile.year}</span>
          </div>
          <ChevronDown size={14} color="#94A3B8" />
        </div>
      </div>
    </header>
  );
};
