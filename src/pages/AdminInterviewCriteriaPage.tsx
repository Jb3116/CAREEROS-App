import React, { useState } from 'react';
import {
  ClipboardCheck,
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Mic,
  Cpu,
  ShieldCheck,
  Award,
  Eye,
  Smile,
  Volume2,
  Users,
} from 'lucide-react';

export const AdminInterviewCriteriaPage: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<'sde' | 'product' | 'ai' | 'quant'>('sde');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rubric State
  const [starWeight, setStarWeight] = useState('30');
  const [dsaWeight, setDsaWeight] = useState('45');
  const [speechWeight, setSpeechWeight] = useState('25');

  // STAR Toggles
  const [requireMetrics, setRequireMetrics] = useState(true);
  const [strictActionAttribution, setStrictActionAttribution] = useState(true);
  const [minStarPassingScore, setMinStarPassingScore] = useState('80');

  // Technical Toggles
  const [requireBigOComplexity, setRequireBigOComplexity] = useState(true);
  const [requireEdgeCases, setRequireEdgeCases] = useState(true);
  const [minDsaPassingScore, setMinDsaPassingScore] = useState('85');

  // Speech Toggles
  const [minPaceWpm, setMinPaceWpm] = useState('125');
  const [maxPaceWpm, setMaxPaceWpm] = useState('145');
  const [maxFillerPercent, setMaxFillerPercent] = useState('2.0');
  const [enforceEyeContact, setEnforceEyeContact] = useState(true);
  const [flagProctoringViolations, setFlagProctoringViolations] = useState(true);

  const handleSave = () => {
    setToastMessage('✓ Institutional Interview Criteria & AI Scoring Rubrics v5.1 successfully saved!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetDefaults = () => {
    setStarWeight('30');
    setDsaWeight('45');
    setSpeechWeight('25');
    setMinStarPassingScore('80');
    setMinDsaPassingScore('85');
    setMinPaceWpm('125');
    setMaxPaceWpm('145');
    setMaxFillerPercent('2.0');
    setRequireMetrics(true);
    setRequireBigOComplexity(true);
    setToastMessage('✓ Reset rubrics to FAANG Benchmark Standards (Google / Goldman Sachs Calibrated)!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="criteria-page-container">
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
      <section className="criteria-header-card" aria-label="Interview Criteria Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <ClipboardCheck size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Institutional Interview Criteria & AI Scoring Rubrics
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Configure mock interview weights, STAR framework evaluation strictness, and live speech telemetry standards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleResetDefaults}
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
            <RotateCcw size={15} />
            <span>Reset to FAANG Standard</span>
          </button>

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
            <span>Save Rubric Ruleset</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="criteria-stats-grid">
        <div className="criteria-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Scoring Ruleset Standard</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>Tier-1 SDE v5.1</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>Google & Goldman Sachs Calibrated</div>
        </div>

        <div className="criteria-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>STAR Behavioral Weight</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>{starWeight}% Weight</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>Min {minStarPassingScore}% Passing Score</div>
        </div>

        <div className="criteria-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>DSA & System Design Weight</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>{dsaWeight}% Weight</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>Min {minDsaPassingScore}% Passing Score</div>
        </div>

        <div className="criteria-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Speech & Fluency Weight</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>{speechWeight}% Weight</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>125 - 145 WPM Optimal Pace</div>
        </div>
      </div>

      {/* ---------------- Track Selector Tabs ---------------- */}
      <div className="criteria-tabs">
        {[
          { id: 'sde', label: '🎯 Core SDE & Tech Engineering Roles (Default)' },
          { id: 'product', label: '👔 Product Management & APM Tracks' },
          { id: 'ai', label: '📊 AI & Data Science Engineering' },
          { id: 'quant', label: '🌐 FinTech Quantitative Analyst' },
        ].map((track) => (
          <button
            key={track.id}
            onClick={() => setSelectedTrack(track.id as any)}
            className={`criteria-tab-btn ${selectedTrack === track.id ? 'active' : 'inactive'}`}
          >
            <span>{track.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------- 3 Core Rubric Parameter Cards Grid ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        {/* Rubric 1: STAR Behavioral */}
        <div className="criteria-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                <Mic size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>STAR Behavioral Evaluation</h3>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>Situation, Task, Action, Result</span>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#4F46E5', background: '#EEF2FF', padding: '4px 10px', borderRadius: 8 }}>
              {starWeight}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Minimum Passing STAR Threshold (%)
              </label>
              <input
                type="text"
                value={minStarPassingScore}
                onChange={(e) => setMinStarPassingScore(e.target.value)}
                style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 800 }}
              />
            </div>

            <div className="criteria-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>Enforce Quantified Metric Requirement</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Answers must contain measurable impact (e.g., % latency reduction, throughput numbers).</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={requireMetrics} onChange={(e) => setRequireMetrics(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="criteria-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>Strict Individual Action Attribution</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Differentiate individual code ownership vs. general team contributions.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={strictActionAttribution} onChange={(e) => setStrictActionAttribution(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Rubric 2: Technical Depth & DSA */}
        <div className="criteria-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>Technical Depth & Algorithms</h3>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>Complexity, Edge Cases, Distributed Design</span>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: 8 }}>
              {dsaWeight}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Minimum Technical Pass Cutoff (%)
              </label>
              <input
                type="text"
                value={minDsaPassingScore}
                onChange={(e) => setMinDsaPassingScore(e.target.value)}
                style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 800 }}
              />
            </div>

            <div className="criteria-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>Big-O Time & Space Proof Requirement</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Candidate must explicitly state algorithmic complexity proof.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={requireBigOComplexity} onChange={(e) => setRequireBigOComplexity(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="criteria-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>Mandatory Boundary & Edge Case Checking</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Flag solutions that do not test null inputs, integer overflow, or cycle states.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={requireEdgeCases} onChange={(e) => setRequireEdgeCases(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Rubric 3: Speech Analytics & Telemetry */}
        <div className="criteria-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <Volume2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>Speech Analytics & Telemetry</h3>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>Speaking Pace, Filler Words, Eye Contact</span>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#D97706', background: '#FFFBEB', padding: '4px 10px', borderRadius: 8 }}>
              {speechWeight}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Min Pace (WPM)
                </label>
                <input
                  type="text"
                  value={minPaceWpm}
                  onChange={(e) => setMinPaceWpm(e.target.value)}
                  style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 800 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Max Pace (WPM)
                </label>
                <input
                  type="text"
                  value={maxPaceWpm}
                  onChange={(e) => setMaxPaceWpm(e.target.value)}
                  style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 800 }}
                />
              </div>
            </div>

            <div className="criteria-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>Webcam Eye Contact Tracking</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Require minimum 85% camera gaze during mock interview questions.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={enforceEyeContact} onChange={(e) => setEnforceEyeContact(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>

            <div className="criteria-toggle-row">
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>Automated Proctoring Anomaly Flag</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Flag tab switches and multi-face detections during online rounds.</div>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={flagProctoringViolations} onChange={(e) => setFlagProctoringViolations(e.target.checked)} />
                <span className="admin-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Batch Calibration Impact Card ---------------- */}
      <div className="criteria-card" style={{ background: '#F8FAFC' }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
          Batch Calibration Benchmark & Projected Tier-1 Readiness
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>1,280 Students (80.0%)</div>
            <div style={{ fontSize: 12, color: '#047857', fontWeight: 700 }}>Meet or Exceed Tier-1 SDE Mock Standard ✓</div>
          </div>

          <div style={{ padding: 16, background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>320 Students (20.0%)</div>
            <div style={{ fontSize: 12, color: '#B45309', fontWeight: 700 }}>Assigned to Targeted AI Speech & STAR Remediation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInterviewCriteriaPage;
