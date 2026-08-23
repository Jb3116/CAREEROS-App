import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitFork,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Code2,
  BrainCircuit,
  Lock,
  Play,
  Calendar,
  Layers,
  Award,
  Target,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Check,
} from 'lucide-react';

import { useStudentProfile } from '../../utils/userProfile';
import {
  hasAssessmentRecord,
  getUserRoadmap,
  saveUserRoadmap,
  getAssessmentRecord,
} from '../../utils/assessmentValidation';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  practiceLink?: string;
  skill_id?: string;
  mastery_at_generation?: number;
  target_mastery?: number;
  isPriority?: boolean;
  whyThisSkill?: string;
}

interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'upcoming';
  milestones: Milestone[];
}

export const RoadmapView: React.FC = () => {
  const navigate = useNavigate();
  const profile = useStudentProfile();
  const studentId = profile.email || 'student';
  const isAssessed = hasAssessmentRecord(studentId);

  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed' | 'upcoming'>('all');
  const [activeModalMilestone, setActiveModalMilestone] = useState<Milestone | null>(null);
  const [activeWhySkillModal, setActiveWhySkillModal] = useState<Milestone | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());

  const [phases, setPhases] = useState<RoadmapPhase[]>([]);

  const fetchAdaptiveRoadmap = async (isRegen = false) => {
    if (!isAssessed) return;
    if (isRegen) setIsRegenerating(true);
    try {
      const response = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          target_career: 'swe',
          completed_milestones: Array.from(completedMilestones),
          regenerate: isRegen,
        }),
      });

      const data = await response.json();
      if (data.status === 'success' && data.phases) {
        setRoadmapData(data);
        setPhases(data.phases);
        saveUserRoadmap(data.phases, studentId);
      }
    } catch (err) {
      console.warn('Roadmap API notice:', err);
    } finally {
      if (isRegen) {
        setTimeout(() => setIsRegenerating(false), 300);
      }
    }
  };

  useEffect(() => {
    if (!isAssessed) {
      setPhases([]);
      return;
    }

    const saved = getUserRoadmap(studentId);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setPhases(saved);
      return;
    }

    fetchAdaptiveRoadmap(false);
  }, [studentId, isAssessed]);

  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    const nextCompleted = new Set(completedMilestones);
    if (nextCompleted.has(milestoneId)) {
      nextCompleted.delete(milestoneId);
    } else {
      nextCompleted.add(milestoneId);
    }
    setCompletedMilestones(nextCompleted);

    setPhases((prevPhases) => {
      const updated = prevPhases.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            const newStatus: 'completed' | 'in-progress' = m.status === 'completed' ? 'in-progress' : 'completed';
            return { ...m, status: newStatus };
          }),
        };
      });
      saveUserRoadmap(updated, studentId);
      return updated;
    });
  };

  const totalMilestones = phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedCount = phases.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.status === 'completed').length,
    0
  );
  const percentMastered = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  // ---------------- GATED STATE: User has not completed assessment ----------------
  if (!isAssessed) {
    return (
      <div className="roadmap-page-container">
        {/* Header Bar */}
        <div className="roadmap-header-card" style={{ marginBottom: 24 }}>
          <div className="roadmap-header-top">
            <div className="roadmap-header-title-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: '8px', background: '#EEF2FF', borderRadius: 10, color: '#4F46E5' }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    Adaptive AI Career Roadmap
                  </h1>
                  <p style={{ fontSize: 13.5, color: '#64748B', margin: '4px 0 0 0' }}>
                    Target Role: <strong>{profile.targetRoles?.[0] || 'Software Development Engineer (SDE)'}</strong>
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                background: '#FEF3C7',
                color: '#D97706',
                fontWeight: 800,
                fontSize: 12.5,
              }}
            >
              <Lock size={14} />
              <span>Assessment Required</span>
            </div>
          </div>
        </div>

        {/* Action Hero Gated Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1.5px dashed #CBD5E1',
            padding: '40px 28px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.15)',
            }}
          >
            <Lock size={30} />
          </div>

          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>
              Diagnostic Assessment Required to Unlock Roadmap
            </h2>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Your dynamic learning roadmap is custom-built from verified performance benchmarks. Complete the 15-minute diagnostic test to isolate skill gaps, calibrate Deep Knowledge Tracing neural models, and generate your placement sprint.
            </p>
          </div>

          {/* 4-Phase Curriculum Preview Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              width: '100%',
              maxWidth: 920,
              marginTop: 10,
              textAlign: 'left',
            }}
          >
            <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase' }}>Phase 1</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', marginTop: 4 }}>Diagnostic Baseline &amp; Foundations</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Complexity analysis, linear structures, and initial test calibration.</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase' }}>Phase 2</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', marginTop: 4 }}>Targeted Skill Gap Remediation</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Binary Trees, Dynamic Programming, Graphs &amp; Aptitude speed.</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase' }}>Phase 3</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', marginTop: 4 }}>Systems Engineering &amp; SQL</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>B+ trees, concurrency, database indexing, and backend architecture.</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase' }}>Phase 4</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', marginTop: 4 }}>Mock Placement Diagnoses</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Timed proctored assessments, STAR behavioral rounds &amp; campus drives.</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/assessment')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #4F46E5, #3730A3)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: 14.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
              marginTop: 10,
            }}
          >
            <span>Take Diagnostic Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-page-container">
      {/* ---------------- Roadmap Header & Version Banner ---------------- */}
      <section className="roadmap-header-card" aria-label="Roadmap Summary">
        <div className="roadmap-header-top">
          <div className="roadmap-header-title-group">
            <h1>
              <GitFork size={26} color="#818CF8" />
              <span>Adaptive AI Career Roadmap</span>
            </h1>
            <p>
              Target: <strong>{roadmapData?.target_career?.title || 'Software Development Engineer (SDE 1)'}</strong> • Calibrated with DKT & Sentence-BERT
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="roadmap-version-badge">
              <Sparkles size={14} color="#FBBF24" />
              <span>{roadmapData?.version || 'Roadmap v4.2 • DKT + SBERT Adaptive'}</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="roadmap-stats-row">
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#818CF8' }}>
              {percentMastered}%
            </span>
            <span className="roadmap-stat-lbl">Roadmap Completion ({completedCount}/{totalMilestones} Milestones)</span>
          </div>
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#34D399' }}>
              {roadmapData?.target_career?.role_fit_score || 85}% Role Fit
            </span>
            <span className="roadmap-stat-lbl">Target SDE Readiness</span>
          </div>
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#FBBF24' }}>
              3 Days Left
            </span>
            <span className="roadmap-stat-lbl">Google Assessment Drive</span>
          </div>
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#F472B6' }}>
              {roadmapData?.top_priority_gap?.skill_name ? `Fix: ${roadmapData.top_priority_gap.skill_name}` : '2 Tree Problems'}
            </span>
            <span className="roadmap-stat-lbl">Sentence-BERT Priority Gap</span>
          </div>
        </div>
      </section>

      {/* ---------------- Controls & Status Filters ---------------- */}
      <div className="roadmap-controls-bar">
        <div className="roadmap-phase-filter-group">
          {(['all', 'in-progress', 'completed', 'upcoming'] as const).map((st) => (
            <button
              key={st}
              className={`roadmap-filter-btn ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st === 'all' && 'All Phases'}
              {st === 'in-progress' && 'In Progress'}
              {st === 'completed' && 'Mastered'}
              {st === 'upcoming' && 'Upcoming'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => fetchAdaptiveRoadmap(true)}
            disabled={isRegenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 700,
              color: '#4F46E5',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              padding: '8px 16px',
              borderRadius: 10,
              cursor: isRegenerating ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Regenerate dynamic roadmap using latest DKT mastery"
          >
            <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
            <span>{isRegenerating ? 'Adapting with AI...' : 'Regenerate Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* ---------------- Timeline Rail & Phases ---------------- */}
      <div className="roadmap-timeline-container">
        <div className="roadmap-rail-line" />

        {phases.map((phase) => {
          const visibleMilestones = phase.milestones.filter((m) => {
            if (filterStatus === 'all') return true;
            return m.status === filterStatus;
          });

          if (visibleMilestones.length === 0) return null;

          return (
            <div key={phase.id} className="roadmap-phase-block">
              {/* Phase Header */}
              <div className="roadmap-phase-header">
                <div className={`roadmap-phase-badge ${phase.status === 'completed' ? 'completed' : ''}`}>
                  {phase.status === 'completed' ? '✓' : phase.phaseNumber}
                </div>
                <div>
                  <h2 className="roadmap-phase-title-text">
                    Phase {phase.phaseNumber}: {phase.title}
                  </h2>
                  <p className="roadmap-phase-sub">{phase.subtitle}</p>
                </div>
              </div>

              {/* Milestones Grid */}
              <div className="roadmap-milestones-grid">
                {visibleMilestones.map((m) => (
                  <div
                    key={m.id}
                    className={`roadmap-milestone-card ${m.isPriority ? 'current-sprint' : ''}`}
                  >
                    <div className="roadmap-card-header-row">
                      <span className={`roadmap-status-pill ${m.status}`}>
                        {m.status === 'completed' && <CheckCircle2 size={12} />}
                        {m.status === 'in-progress' && <span>⚡</span>}
                        {m.status === 'upcoming' && <Lock size={12} />}
                        <span>
                          {m.status === 'completed' && 'Mastered'}
                          {m.status === 'in-progress' && 'In Progress'}
                          {m.status === 'upcoming' && 'Scheduled'}
                        </span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {m.whyThisSkill && (
                          <button
                            onClick={() => setActiveWhySkillModal(m)}
                            style={{
                              background: 'rgba(99, 102, 241, 0.1)',
                              color: '#6366F1',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              borderRadius: 6,
                              padding: '2px 6px',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                            title="Why was this skill scheduled?"
                          >
                            <HelpCircle size={12} />
                            <span>Why this skill?</span>
                          </button>
                        )}
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                          {m.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="roadmap-card-title">{m.title}</h3>
                    <p className="roadmap-card-desc">{m.description}</p>

                    <div className="roadmap-skill-tags">
                      {m.topics.map((t, idx) => (
                        <span key={idx} className="roadmap-skill-tag">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="roadmap-card-actions" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="roadmap-btn-action"
                        onClick={() => navigate('/practice')}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Code2 size={13} />
                        <span>Practice</span>
                      </button>

                      <button
                        className="roadmap-btn-action"
                        onClick={() => navigate('/learning')}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <BookOpen size={13} />
                        <span>Start Learning</span>
                      </button>

                      <button
                        className="roadmap-btn-toggle"
                        onClick={() => toggleMilestone(phase.id, m.id)}
                      >
                        {m.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete ✓'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- Detailed Milestone Syllabus Modal ---------------- */}
      {activeModalMilestone && (
        <div className="modal-backdrop" onClick={() => setActiveModalMilestone(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#4F46E5" />
                <h2 className="modal-title">{activeModalMilestone.title}</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveModalMilestone(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                {activeModalMilestone.description}
              </p>

              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>
                  Target Practice Concepts & Patterns:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activeModalMilestone.topics.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{t}</span>
                      <button
                        onClick={() => {
                          setActiveModalMilestone(null);
                          navigate('/practice');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4F46E5',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Solve in Arena &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  className="ai-banner-btn"
                  onClick={() => {
                    setActiveModalMilestone(null);
                    navigate('/assessment');
                  }}
                >
                  <span>Take Diagnostic Assessment &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 'Why This Skill?' Modal ---------------- */}
      {activeWhySkillModal && (
        <div className="modal-backdrop" onClick={() => setActiveWhySkillModal(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BrainCircuit size={20} color="#6366F1" />
                <h2 className="modal-title">Why Was This Skill Scheduled?</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveWhySkillModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#312E81', margin: '0 0 4px' }}>
                  {activeWhySkillModal.title}
                </h4>
                <p style={{ fontSize: 13, color: '#4338CA', margin: 0, lineHeight: 1.45 }}>
                  {activeWhySkillModal.whyThisSkill || 'Calibrated based on your active DKT knowledge state and Sentence-BERT role match deficit.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Your DKT Mastery</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                    {activeWhySkillModal.mastery_at_generation ? `${activeWhySkillModal.mastery_at_generation}%` : '56%'}
                  </div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Hiring Benchmark</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>
                    {activeWhySkillModal.target_mastery ? `${activeWhySkillModal.target_mastery}%` : '75%'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button
                  className="ai-banner-btn"
                  onClick={() => {
                    setActiveWhySkillModal(null);
                    navigate('/practice');
                  }}
                >
                  <span>Practice Skill Now &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
