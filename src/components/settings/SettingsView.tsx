import React, { useState } from 'react';
import { Settings, Bell, Shield, Key, Moon, Sun, Laptop, Save, Sparkles } from 'lucide-react';
import { clearTourCompleted } from '../tour/InteractiveTour';

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

      {/* Preferences Grid */}
      <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
          AI Notifications & Automation
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Real-time Opportunity Alerts</div>
              <div style={{ fontSize: 12.5, color: '#64748B' }}>Get notified instantly when new internship match scores exceed 85%.</div>
            </div>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#4F46E5' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Daily Adaptive Practice Reminders</div>
              <div style={{ fontSize: 12.5, color: '#64748B' }}>Receive curated morning study tasks aligned with upcoming company test dates.</div>
            </div>
            <input type="checkbox" checked={dailyReminders} onChange={(e) => setDailyReminders(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#4F46E5' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Automated Resume ATS Scoring</div>
              <div style={{ fontSize: 12.5, color: '#64748B' }}>Re-evaluate your resume whenever new project achievements or skill milestones are logged.</div>
            </div>
            <input type="checkbox" checked={autoAtsCheck} onChange={(e) => setAutoAtsCheck(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#4F46E5' }} />
          </label>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="#4F46E5" />
          <span>Interactive AI Platform Tour</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Guided Feature Tour & Onboarding</div>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>
              Re-launch the spotlight walkthrough of all 8 core CAREER OS modules.
            </div>
          </div>
          <button
            onClick={() => {
              clearTourCompleted();
              window.dispatchEvent(new CustomEvent('careeros-start-tour'));
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#EEF2FF',
              color: '#4F46E5',
              border: '1px solid #C7D2FE',
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={15} />
            <span>Take Website Tour Again</span>
          </button>
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
