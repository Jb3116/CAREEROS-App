import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Video,
  Play,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Volume2,
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Zap,
  Users,
  Eye,
  Smile,
  X,
} from 'lucide-react';

export const InterviewStudioView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRound, setSelectedRound] = useState<'star' | 'technical' | 'hr'>('star');
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRecorded, setSecondsRecorded] = useState(48);
  const [showEvaluationReport, setShowEvaluationReport] = useState(false);

  // Live transcript state
  const [transcript, setTranscript] = useState(
    'In my previous distributed caching project, our team faced a major latency spike during flash traffic spikes where Redis cluster hit 100% CPU utilization. To diagnose this, I analyzed the slowlog and identified an un-indexed N+1 query pattern generating redundant cache invalidation calls. I designed a local LRU in-memory buffer with probabilistic early expiration (XFetch algorithm). This reduced cache query load by 74% and normalized p99 latency from 420ms down to 28ms.'
  );

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording) {
      timer = setInterval(() => {
        setSecondsRecorded((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowEvaluationReport(true);
    } else {
      setIsRecording(true);
      setSecondsRecorded(0);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="interview-page-container">
      {/* ---------------- Studio Header & Stats Banner ---------------- */}
      <section className="interview-header-card" aria-label="Interview Studio Header">
        <div className="interview-header-top">
          <div className="interview-header-title-group">
            <h1>
              <Mic size={26} color="#818CF8" />
              <span>AI Interview Studio & Speech Coach</span>
            </h1>
            <p>
              Simulate realistic mock rounds with <strong>Sophia (Senior Tech Recruiter AI)</strong> calibrated for Google & Tier-1 SDE standards.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="interview-status-pill">
              <ShieldCheck size={14} />
              <span>STAR Grading Engine v4.2 Active</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="interview-stats-row">
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#818CF8' }}>
              88 / 100
            </span>
            <span className="interview-stat-lbl">Average STAR Fluency Score</span>
          </div>
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#34D399' }}>
              132 WPM
            </span>
            <span className="interview-stat-lbl">Speaking Pace (Optimal Range: 125-145)</span>
          </div>
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#FBBF24' }}>
              1.2%
            </span>
            <span className="interview-stat-lbl">Filler Word Frequency (Very Low)</span>
          </div>
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#F472B6' }}>
              Strong Hire
            </span>
            <span className="interview-stat-lbl">Tier-1 SDE Readiness Benchmark</span>
          </div>
        </div>
      </section>

      {/* ---------------- Studio Mode Tabs ---------------- */}
      <div className="interview-mode-tabs">
        {[
          { id: 'star', label: '🎤 STAR Behavioral & Leadership Principles', icon: MessageSquare },
          { id: 'technical', label: '💻 Technical DSA & System Architecture Live Drill', icon: BrainCircuit },
          { id: 'hr', label: '👔 Cultural Fit & HR Scenario Studio', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedRound === tab.id;
          return (
            <button
              key={tab.id}
              className={`interview-mode-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={() => setSelectedRound(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- Main Live Split Studio Workspace ---------------- */}
      <div className="interview-workspace-grid">
        {/* Left Pane: AI Interviewer & Question Prompt */}
        <div className="interview-interviewer-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#F8FAFC' }}>Sophia • Senior Technical Recruiter AI</span>
            </div>
            <span style={{ fontSize: 11.5, background: 'rgba(79, 70, 229, 0.3)', color: '#C7D2FE', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
              Question 1 of 3
            </span>
          </div>

          {/* AI Avatar Video Simulation Box */}
          <div className="interview-avatar-box">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(99, 102, 241, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <BrainCircuit size={36} color="#FFFFFF" />
            </div>

            <div style={{ marginTop: 14, fontSize: 12.5, color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Volume2 size={14} color="#818CF8" />
              <span>Voice Prompt Playing • Speech Audio Synthesizer</span>
            </div>
          </div>

          {/* Question Text Box */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#818CF8', textTransform: 'uppercase', marginBottom: 6 }}>
              Target Principle: Deep Technical Ownership & Problem Resolution
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.5, margin: 0 }}>
              "Tell me about a challenging distributed systems or algorithmic bug you diagnosed under high time pressure. How did you identify the root cause, and what was the quantifiable impact of your fix?"
            </p>
          </div>

          {/* STAR Rubric Breakdown */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', marginBottom: 8 }}>
              STAR Framework Checklist:
            </div>
            <div className="interview-star-grid">
              <div className="interview-star-pill">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399' }}>S: Situation ✓</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>Redis CPU 100%</div>
              </div>
              <div className="interview-star-pill">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399' }}>T: Task ✓</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>Slowlog Analysis</div>
              </div>
              <div className="interview-star-pill">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399' }}>A: Action ✓</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>XFetch In-Memory</div>
              </div>
              <div className="interview-star-pill">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399' }}>R: Result ✓</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>28ms p99 Latency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Candidate Live Studio & Recorder */}
        <div className="interview-candidate-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: isRecording ? '#EF4444' : '#64748B' }} />
              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                Candidate Studio Feed • Alex Chen
              </span>
            </div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 13.5,
                fontWeight: 800,
                color: isRecording ? '#DC2626' : '#64748B',
                background: isRecording ? '#FEF2F2' : '#F1F5F9',
                padding: '4px 12px',
                borderRadius: 999,
                border: isRecording ? '1px solid #FECACA' : '1px solid #E2E8F0',
              }}
            >
              ⏱️ {formatTimer(secondsRecorded)} / 03:00
            </span>
          </div>

          {/* Webcam Simulator Box */}
          <div className="interview-webcam-preview">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94A3B8' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818CF8',
                }}
              >
                <Video size={28} />
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>
                {isRecording ? '🔴 Live Recording in Progress (1080p 60fps)' : 'Webcam & Noise-Cancelling Mic Ready'}
              </span>
            </div>

            {/* Floating Live Telemetry Badges */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
              <span style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#34D399', fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={12} /> Eye Contact 96%
              </span>
              <span style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#60A5FA', fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Smile size={12} /> Positive Confidence
              </span>
            </div>
          </div>

          {/* Live Real-time AI Transcript */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                Real-Time AI Speech Transcription & Voice Stream:
              </span>
              <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                Pacing: 132 WPM (Optimal)
              </span>
            </div>
            <div className="interview-transcript-box">{transcript}</div>
          </div>

          {/* Studio Control Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9', marginTop: 'auto' }}>
            <button
              onClick={() => setTranscript('')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} />
              <span>Clear Response</span>
            </button>

            <button
              onClick={toggleRecording}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isRecording
                  ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                  : 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: 12,
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: isRecording ? '0 4px 14px rgba(220, 38, 38, 0.4)' : '0 4px 14px rgba(79, 70, 229, 0.4)',
              }}
            >
              {isRecording ? <Square size={16} fill="#FFF" /> : <Mic size={16} />}
              <span>{isRecording ? 'Stop & Evaluate Answer' : 'Start AI Voice Recording'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- AI Evaluation Report Modal ---------------- */}
      {showEvaluationReport && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Award size={24} color="#F59E0B" />
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                    AI Mock Interview Evaluation Report
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    Tier-1 SDE Behavioral Benchmark (STAR Methodology)
                  </span>
                </div>
              </div>
              <button onClick={() => setShowEvaluationReport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Score Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '14px 0' }}>
              <div style={{ padding: 14, background: '#EEF2FF', borderRadius: 12, textAlign: 'center', border: '1px solid #C7D2FE' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>88%</div>
                <div style={{ fontSize: 11, color: '#4338CA', fontWeight: 700 }}>Overall STAR Score</div>
              </div>
              <div style={{ padding: 14, background: '#ECFDF5', borderRadius: 12, textAlign: 'center', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>92%</div>
                <div style={{ fontSize: 11, color: '#047857', fontWeight: 700 }}>Technical Depth</div>
              </div>
              <div style={{ padding: 14, background: '#FFFBEB', borderRadius: 12, textAlign: 'center', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>85%</div>
                <div style={{ fontSize: 11, color: '#B45309', fontWeight: 700 }}>Impact Metrics</div>
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle2 size={15} /> Key Strengths:
                </strong>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569' }}>
                  <li>Excellent technical vocabulary (e.g. <em>XFetch probabilistic expiration</em>, <em>N+1 query pattern</em>).</li>
                  <li>Clear quantification of business results (74% query reduction, 28ms latency).</li>
                </ul>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AlertTriangle size={15} /> Actionable Recommendations:
                </strong>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569' }}>
                  <li>Spend 15 seconds clarifying the initial baseline architecture before jumping into the solution.</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setShowEvaluationReport(false)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close Report
              </button>
              <button
                onClick={() => {
                  setShowEvaluationReport(false);
                  navigate('/practice');
                }}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
              >
                Practice Weakness in Arena →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewStudioView;
