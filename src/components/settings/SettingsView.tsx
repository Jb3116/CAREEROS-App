import React, { useState } from 'react';
import { Settings, Bell, Shield, Key, Moon, Sun, Laptop, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [autoAtsCheck, setAutoAtsCheck] = useState(true);

  return (
    <div style={{ padding: '24px 36px', maxWidth: 800, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={24} color="#4F46E5" />
          <span>Student Account Settings</span>
        </h1>
        <p style={{ fontSize: 13.5, color: '#64748B' }}>
          Manage your AI preferences, notifications, security, and institutional synchronization.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
          Notification Preferences
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Campus Drive & Assessment Deadlines</div>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>Receive urgent alerts 48h before registered tests</div>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: '#4F46E5' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Daily Adaptive Practice Reminders</div>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>Maintain your streak and execute scheduled high-yield tasks</div>
          </div>
          <input
            type="checkbox"
            checked={dailyReminders}
            onChange={(e) => setDailyReminders(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: '#4F46E5' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Automated ATS Resume Sync</div>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>Recalculate ATS matching when new projects or skills are completed</div>
          </div>
          <input
            type="checkbox"
            checked={autoAtsCheck}
            onChange={(e) => setAutoAtsCheck(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: '#4F46E5' }}
          />
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
          Institutional Data Connection
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Vellore Institute of Technology Placement Cell</div>
            <div style={{ fontSize: 12.5, color: '#059669', fontWeight: 600 }}>Connected & Verified ✓ (Batch of 2027)</div>
          </div>
          <span style={{ fontSize: 12, background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>
            Sync Active
          </span>
        </div>
      </div>

      <button
        onClick={() => alert('Settings saved successfully!')}
        style={{
          alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
          color: '#FFFFFF',
          padding: '10px 24px',
          borderRadius: 12,
          fontWeight: 800,
          fontSize: 14,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
        }}
      >
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </div>
  );
};

export default SettingsView;
