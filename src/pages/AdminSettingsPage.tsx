import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
  RotateCcw,
  Bell,
  Lock,
  Cpu,
  GraduationCap,
  Users,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eligibility' | 'ai-gates' | 'webhooks'>('eligibility');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Policy Form State
  const [minCgpaTier1, setMinCgpaTier1] = useState('8.50');
  const [minCgpaCore, setMinCgpaCore] = useState('7.50');
  const [allowBacklogs, setAllowBacklogs] = useState(false);
  const [dreamOfferCap, setDreamOfferCap] = useState(true);
  const [minPracticePct, setMinPracticePct] = useState('75');

  // AI Gates State
  const [minAtsThreshold, setMinAtsThreshold] = useState('85');
  const [strictStarGrading, setStrictStarGrading] = useState(true);
  const [autoProctoringViolations, setAutoProctoringViolations] = useState(true);

  // Webhook state
  const [autoSmsBroadcast, setAutoSmsBroadcast] = useState(true);
  const [googleRecruiterWebhook, setGoogleRecruiterWebhook] = useState(true);
  const [goldmanRecruiterWebhook, setGoldmanRecruiterWebhook] = useState(true);

  const handleSave = () => {
    setToastMessage('✓ Placement Policy Ruleset v4.2 successfully updated and applied across 2026 Batch!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="admin-control-container">
      {/* ---------------- Toast Notification ---------------- */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            background: '#064E3B',
            color: '#A7F3D0',
            border: '1px solid #059669',
            padding: '12px 20px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 13.5,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------- Header Card ---------------- */}
      <section className="admin-control-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Sliders size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Institutional Placement Control Center & Policy Engine
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Configure academic eligibility thresholds, automated drive gating, AI speech proctoring strictness, and TPO dispatch settings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Save size={16} />
            <span>Save Policy Ruleset</span>
          </button>
        </div>
      </section>

      {/* ---------------- Mode Switcher Tabs ---------------- */}
      <div className="admin-control-tabs">
        {[
          { id: 'eligibility', label: '⚙️ Eligibility & Tier Gating Rules', icon: Sliders },
          { id: 'ai-gates', label: '🤖 AI Calibration & Proctoring Thresholds', icon: Cpu },
          { id: 'webhooks', label: '📢 Recruiter Webhooks & TPO Broadcasts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`admin-control-tab-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB 1: ELIGIBILITY & TIER GATING ---------------- */}
      {activeTab === 'eligibility' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          <div className="admin-settings-card">
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>
              Academic Senate CGPA Gating Criteria
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Tier-1 Product Companies (FAANG, High-Tier Tech) Minimum CGPA Cutoff
                </label>
                <input
                  type="text"
                  value={minCgpaTier1}
                  onChange={(e) => setMinCgpaTier1(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Core Technology & FinTech Companies Minimum CGPA Cutoff
                </label>
                <input
                  type="text"
                  value={minCgpaCore}
                  onChange={(e) => setMinCgpaCore(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Minimum Practice Milestone Completion (%) to Unlock Campus Applications
                </label>
                <input
                  type="text"
                  value={minPracticePct}
                  onChange={(e) => setMinPracticePct(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700 }}
                />
              </div>
            </div>

            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>Enforce Zero Active Backlogs Policy</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Students with standing arrears are automatically filtered out of Tier-1 drives.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={!allowBacklogs} onChange={(e) => setAllowBacklogs(!e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>Dream Offer Policy (2x Upgrade Window)</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Placed students can only apply to Dream Companies offering &gt; 2x their current CTC.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={dreamOfferCap} onChange={(e) => setDreamOfferCap(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>
          </div>

          {/* Live Batch Impact Simulator */}
          <div className="admin-settings-card" style={{ background: '#F8FAFC' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>
              Live Batch Impact Simulation (Cohort 2026)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 14, background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>1,420 Students</div>
                <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Eligible for Tier-1 & Core Campus Drives (88.75%)</div>
              </div>

              <div style={{ padding: 14, background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>180 Students</div>
                <div style={{ fontSize: 12, color: '#B45309', fontWeight: 700 }}>Under Practice Threshold (Remediation Assigned)</div>
              </div>

              <div style={{ background: '#EEF2FF', padding: 12, borderRadius: 10, border: '1px solid #C7D2FE', color: '#4F46E5', fontSize: 12.5, fontWeight: 600 }}>
                💡 <strong>TPO Insight:</strong> Raising the Practice threshold from 70% to 75% increased average first-round coding test clearance by <strong>+18.4%</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: AI CALIBRATION GATES ---------------- */}
      {activeTab === 'ai-gates' && (
        <div className="admin-settings-card">
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>
            AI Proctoring & Diagnostic Strictness Thresholds
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                Minimum ATS Resume Score Required for 1-Click Application Dispatch
              </label>
              <input
                type="text"
                value={minAtsThreshold}
                onChange={(e) => setMinAtsThreshold(e.target.value)}
                style={{ width: 240, height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700 }}
              />
            </div>

            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>High-Precision STAR Behavioral Speech Evaluation</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Strictly enforce quantifiable metric requirements in candidate interview answers.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={strictStarGrading} onChange={(e) => setStrictStarGrading(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>Automatic AI Proctoring Flagging</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Flag tab switches and multi-face detections during online diagnostic assessments.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={autoProctoringViolations} onChange={(e) => setAutoProctoringViolations(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: RECRUITER WEBHOOKS ---------------- */}
      {activeTab === 'webhooks' && (
        <div className="admin-settings-card">
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>
            Recruiter Portals & Automated Broadcast Webhooks
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>Automated SMS / Email Notifications to Eligible Cohort</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Dispatch immediate alerts whenever a company opens registration on campus.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={autoSmsBroadcast} onChange={(e) => setAutoSmsBroadcast(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>Google University Placement API Integration</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Direct candidate resume forwarding to Google University Programs terminal.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={googleRecruiterWebhook} onChange={(e) => setGoogleRecruiterWebhook(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="admin-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A' }}>Goldman Sachs Campus Roster Webhook</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Sync shortlisted applicant test scores directly to Goldman Sachs Hiring portal.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={goldmanRecruiterWebhook} onChange={(e) => setGoldmanRecruiterWebhook(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
