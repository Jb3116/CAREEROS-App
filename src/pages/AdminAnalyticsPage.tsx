import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  FileSpreadsheet,
  Layers,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  Zap,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState<'2026' | '2025' | 'dept'>('2026');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = (format: 'PDF' | 'Excel') => {
    setToastMessage(`✓ Generating full institutional ${format} placement intelligence report...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="analytics-page-container">
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

      {/* ---------------- Hero Header ---------------- */}
      <section className="analytics-header-card" aria-label="Analytics & Insights Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <BarChart3 size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Institutional Analytics & Executive Placement Insights
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Real-time cohort velocity, salary distribution curves, recruiter funnel yield, and department benchmarks for the <strong>Class of 2026</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExport('Excel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Export Data (Excel)</span>
          </button>

          <button
            onClick={() => handleExport('PDF')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
            }}
          >
            <Download size={16} />
            <span>Download Annual Report (PDF)</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Executive Summary Metric Cards ---------------- */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Peak Compensation (Super Dream)</span>
            <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
              +18.2% YoY
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>₹52.0 LPA</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Google Software Engineering PPO</div>
        </div>

        <div className="analytics-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Average Batch CTC Yield</span>
            <span style={{ fontSize: 11, background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
              +14.5% YoY
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>₹18.4 LPA</div>
          <div style={{ fontSize: 12, color: '#4338CA', fontWeight: 700 }}>Median: ₹16.2 LPA across 142 Placed</div>
        </div>

        <div className="analytics-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Placement Velocity Index</span>
            <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
              On-Track
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>88.75%</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>1,420 / 1,600 Verified Tier-1 Ready</div>
        </div>

        <div className="analytics-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Recruiter Partner Network</span>
            <span style={{ fontSize: 11, background: '#FDF4FF', color: '#A855F7', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
              100% Retained
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>38 Partners</div>
          <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 700 }}>Google, Goldman, Microsoft, Amazon</div>
        </div>
      </div>

      {/* ---------------- 2x2 Grid of In-Depth Visual Analytics Modules ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Module 1: Compensation Tier Distribution */}
        <div className="analytics-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={20} color="#4F46E5" />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Compensation Tier Distribution
              </h3>
            </div>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>142 Total Offers</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { tier: 'Tier-1 Super Dream (> ₹30 LPA)', count: 42, pct: '29.6%', color: '#A855F7', bg: '#FDF4FF' },
              { tier: 'Tier-1 Dream (₹15 - ₹30 LPA)', count: 68, pct: '47.9%', color: '#4F46E5', bg: '#EEF2FF' },
              { tier: 'High-Growth Core Tech (₹10 - ₹15 LPA)', count: 24, pct: '16.9%', color: '#059669', bg: '#ECFDF5' },
              { tier: 'Standard Mass Hiring (₹6 - ₹10 LPA)', count: 8, pct: '5.6%', color: '#D97706', bg: '#FFFBEB' },
            ].map((t, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                  <span>{t.tier}</span>
                  <span style={{ color: t.color, fontWeight: 800 }}>{t.count} Offers ({t.pct})</span>
                </div>
                <div className="analytics-progress-bar-bg">
                  <div className="analytics-progress-bar-fill" style={{ width: t.pct, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Recruiter Conversion Funnel */}
        <div className="analytics-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={20} color="#059669" />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Recruiter Conversion Funnel & Yield
              </h3>
            </div>
            <span style={{ fontSize: 12, color: '#059669', fontWeight: 800 }}>10.0% Final Conversion</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { stage: '1. Registered & Eligible Candidates', count: '1,420 Students', pct: '100%', bg: '#EEF2FF', text: '#4F46E5' },
              { stage: '2. Online Assessment (OA) Cleared', count: '680 Students', pct: '47.8%', bg: '#EFF6FF', text: '#2563EB' },
              { stage: '3. Technical Interview Panels', count: '280 Students', pct: '19.7%', bg: '#FFFBEB', text: '#D97706' },
              { stage: '4. Corporate Placement Offers Extended', count: '142 Placed', pct: '10.0%', bg: '#ECFDF5', text: '#059669' },
            ].map((f, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: f.bg, borderRadius: 12 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13 }}>{f.stage}</span>
                <span style={{ fontWeight: 900, color: f.text, fontSize: 13 }}>{f.count} ({f.pct})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 3: Department-wise Placement Velocity */}
        <div className="analytics-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={20} color="#2563EB" />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Department Placement Velocity & CTC
              </h3>
            </div>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>4 Major Depts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { dept: 'CSE Core', total: '620 Students', rate: '94%', avgCtc: '₹22.4 LPA', color: '#4F46E5' },
              { dept: 'CSE (AI & ML / Data Science)', total: '380 Students', rate: '96%', avgCtc: '₹24.8 LPA', color: '#059669' },
              { dept: 'Information Technology', total: '340 Students', rate: '89%', avgCtc: '₹17.6 LPA', color: '#2563EB' },
              { dept: 'Electronics & Communication', total: '260 Students', rate: '82%', avgCtc: '₹15.2 LPA', color: '#D97706' },
            ].map((d, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                  <span>{d.dept} ({d.total})</span>
                  <span style={{ color: d.color, fontWeight: 800 }}>{d.rate} Verified • Avg {d.avgCtc}</span>
                </div>
                <div className="analytics-progress-bar-bg">
                  <div className="analytics-progress-bar-fill" style={{ width: d.rate, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 4: Batch Skill Mastery & Diagnostic Gap Radar */}
        <div className="analytics-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BrainCircuit size={20} color="#D97706" />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Skill Mastery & Diagnostic Benchmarks
              </h3>
            </div>
            <span style={{ fontSize: 12, color: '#059669', fontWeight: 800 }}>+14% Post-Arena Gain</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { topic: 'DSA: Trees, Graphs & Dynamic Programming', mastery: '82%', status: 'Optimal (Tier-1 Ready)', color: '#4F46E5' },
              { topic: 'CS Core: Operating Systems & Virtual Memory', mastery: '76%', status: 'Proficient', color: '#2563EB' },
              { topic: 'CS Core: DBMS B+ Trees & 2-Phase Locking', mastery: '70%', status: 'Needs Targeted Drill', color: '#D97706' },
              { topic: 'STAR Behavioral & Video Speech Fluency', mastery: '84%', status: 'High Confidence', color: '#059669' },
            ].map((s, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                  <span>{s.topic}</span>
                  <span style={{ color: s.color, fontWeight: 800 }}>{s.mastery} ({s.status})</span>
                </div>
                <div className="analytics-progress-bar-bg">
                  <div className="analytics-progress-bar-fill" style={{ width: s.mastery, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- AI Placement Officer Insights Banner ---------------- */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          border: '1px solid #C7D2FE',
          borderRadius: 18,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#4F46E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Sparkles size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 900, color: '#1E1B4B', margin: '0 0 4px' }}>
            Executive AI Placement Telemetry Insight:
          </h4>
          <p style={{ fontSize: 13, color: '#3730A3', margin: 0, lineHeight: 1.5 }}>
            Students who completed more than <strong>75% of their adaptive coding roadmap milestones</strong> demonstrated an <strong>82.4% clearance rate</strong> on Tier-1 Google and Goldman Sachs OA assessments compared to 41.2% in un-calibrated cohorts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
