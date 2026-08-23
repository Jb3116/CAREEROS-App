import React from 'react';
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
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="drives-page-container">
      {/* ---------------- Hero Header ---------------- */}
      <section className="drives-header-card" aria-label="Batch Analytics Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <BarChart3 size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Batch Placement & Skill Gap Analytics Dashboard
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Comprehensive institutional telemetry across department placement velocity, recruiter conversion funnels, and core skill mastery.
          </p>
        </div>

        <div>
          <button
            onClick={() => alert('Exporting full institutional placement analytics report (PDF)...')}
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
            <Download size={16} />
            <span>Download Annual Report (PDF)</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="drives-stats-grid">
        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Highest Offer (Super Dream)</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>₹52.0 LPA</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>Google Software Engineering</div>
        </div>

        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Average Batch CTC</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>₹18.4 LPA</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>Median: ₹16.2 LPA (+18% YoY)</div>
        </div>

        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Offers Extended</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>142 Offers</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>38 Companies Visiting</div>
        </div>

        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Cohort Placement Velocity</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>92% Velocity</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>Fastest clearance in 5 years</div>
        </div>
      </div>

      {/* ---------------- Department-wise Placement Velocity ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>
            Department Placement Clearance & Readiness
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { dept: 'Computer Science & Engineering (Core)', placed: 94, total: '620 Students', color: '#4F46E5' },
              { dept: 'CSE (AI & Machine Learning / Data Science)', placed: 96, total: '380 Students', color: '#059669' },
              { dept: 'Information Technology', placed: 89, total: '340 Students', color: '#2563EB' },
              { dept: 'Electronics & Communication (Circuital)', placed: 82, total: '260 Students', color: '#D97706' },
            ].map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span>{d.dept}</span>
                  <span style={{ color: d.color }}>{d.placed}% Verified ({d.total})</span>
                </div>
                <div style={{ height: 10, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${d.placed}%`, height: '100%', background: d.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Hiring Funnel */}
        <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>
            Recruiter Conversion Funnel (2026 Batch)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { stage: '1. Registered & Eligible Applicants', count: '1,420 Students', pct: '100%', bg: '#EEF2FF', text: '#4F46E5' },
              { stage: '2. Online Assessment (OA) Cleared', count: '680 Students', pct: '47.8%', bg: '#EFF6FF', text: '#2563EB' },
              { stage: '3. Technical Interview Rounds', count: '280 Students', pct: '19.7%', bg: '#FFFBEB', text: '#D97706' },
              { stage: '4. Final Offers Extended', count: '142 Placed', pct: '10.0%', bg: '#ECFDF5', text: '#059669' },
            ].map((f, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: f.bg, borderRadius: 10 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13 }}>{f.stage}</span>
                <span style={{ fontWeight: 900, color: f.text, fontSize: 13 }}>{f.count} ({f.pct})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
