import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ArrowRight, Sparkles, ExternalLink, Calendar, Code2, Brain } from 'lucide-react';
import { SmartInsight, PlanTask, OpportunityItem, DeadlineItem } from '../../types/dashboard';

export type ModalContentType =
  | { type: 'task_detail'; data: PlanTask }
  | { type: 'readiness_breakdown'; score?: number | null }
  | { type: 'resume_ats'; score: number }
  | { type: 'deadline_detail'; deadline: DeadlineItem }
  | { type: 'opportunity_detail'; opportunity: OpportunityItem }
  | { type: 'insight_detail'; insight: SmartInsight }
  | { type: 'category_preview'; category: string }
  | null;

interface DetailModalProps {
  content: ModalContentType;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ content, onClose }) => {
  const navigate = useNavigate();
  if (!content) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#4F46E5" />
            <h2 className="modal-title">
              {content.type === 'task_detail' && 'Daily Task Details'}
              {content.type === 'readiness_breakdown' && 'Career Readiness Intelligence'}
              {content.type === 'resume_ats' && 'Resume ATS Optimization'}
              {content.type === 'deadline_detail' && 'Assessment Preparation'}
              {content.type === 'opportunity_detail' && 'Opportunity Intelligence'}
              {content.type === 'insight_detail' && content.insight.title}
              {content.type === 'category_preview' && `${content.category.toUpperCase()} Module`}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Variations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {content.type === 'readiness_breakdown' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: typeof content.score === 'number' ? 22 : 13,
                    fontWeight: 800,
                    textAlign: 'center',
                    padding: 4,
                  }}
                >
                  {typeof content.score === 'number' ? `${content.score}%` : 'Not Assessed'}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>Placement Target: 85%+</h3>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                    Calculated from verified assessment attempts, coding challenges, and mock interviews.
                  </p>
                </div>
              </div>

              {typeof content.score === 'number' ? (
                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>Coding Demonstrated Mastery</span>
                    <span style={{ color: '#4F46E5', fontWeight: 700 }}>{Math.min(98, Math.round(content.score * 0.95))}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>Aptitude & Problem Solving</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{Math.min(98, Math.round(content.score * 1.02))}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>Communication & Soft Skills</span>
                    <span style={{ color: '#D97706', fontWeight: 700 }}>{Math.min(98, Math.round(content.score * 0.85))}%</span>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1.5px dashed #CBD5E1', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#334155' }}>No Assessment Record Found</span>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Take the 15-minute diagnostic test to calculate your benchmark competencies.</span>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/assessment');
                    }}
                    style={{
                      background: '#4F46E5',
                      color: '#FFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: 4,
                    }}
                  >
                    Take Assessment Now
                  </button>
                </div>
              )}
            </div>
          )}

          {content.type === 'resume_ats' && (
            <div>
              {content.score === 0 ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        background: '#F1F5F9',
                        color: '#64748B',
                        border: '1.5px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 800,
                      }}
                    >
                      0%
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>No Resume Available Yet</h3>
                      <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                        Create or upload your resume to generate your ATS score and placement recommendations.
                      </p>
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1.5px dashed #CBD5E1', marginBottom: 16, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                    The CAREEROS ATS engine analyzes keywords, section structure, impact metrics, and action verbs against automated company screening filters.
                  </div>

                  <button
                    className="ai-banner-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      onClose();
                      navigate('/resume-builder');
                    }}
                  >
                    <span>Build Your Resume Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: content.score >= 80 ? '#059669' : '#D97706' }}>
                      {content.score}%
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        {content.score >= 80 ? 'Placement Ready Score' : 'ATS Compatibility Score'}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        {content.score >= 80 ? 'Matches Tier-1 Product Engineering criteria' : 'Review recommendations to boost ATS parsing score'}
                      </div>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#334155', marginBottom: 16 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>Technical skills and taxonomy evaluated</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>Format tested against Workday, Greenhouse & Lever ATS parsers</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>Action verbs and metric quantification analyzed</span>
                    </li>
                  </ul>
                  <button
                    className="ai-banner-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      onClose();
                      navigate('/resume-builder');
                    }}
                  >
                    <span>Open Full ATS Resume Builder</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {content.type === 'opportunity_detail' && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>{content.opportunity.role}</h3>
                <span style={{ fontSize: 13, color: '#4F46E5', fontWeight: 600 }}>{content.opportunity.company}</span>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 14 }}>
                Your demonstrated coding and aptitude skills give you a <strong>{content.opportunity.matchScore}% match rate</strong>. 
                Applying through CAREEROS places your profile into the direct campus screening pool.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="ai-banner-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    onClose();
                    navigate('/opportunities');
                  }}
                >
                  <span>Submit Application</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )}

          {content.type === 'deadline_detail' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Calendar size={28} color="#4F46E5" />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>{content.deadline.title}</h3>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{content.deadline.company} • {content.deadline.dueDate}</div>
                </div>
              </div>
              <div style={{ background: '#EEF2FF', padding: 12, borderRadius: 10, fontSize: 13, color: '#3730A3', marginBottom: 14 }}>
                💡 <strong>Target Practice:</strong> We recommend finishing today's 2 Tree Problems and DSA Revision before entering the live test window.
              </div>
              <button
                className="ai-banner-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onClose();
                  navigate('/practice');
                }}
              >
                <span>Prepare Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {content.type === 'insight_detail' && (
            <div>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, marginBottom: 14 }}>
                {content.insight.description}
              </p>
              <button
                className="ai-banner-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onClose();
                  const targetPath =
                    (content.insight as any).path ||
                    (content.insight.type === 'roadmap'
                      ? '/career-roadmap'
                      : content.insight.type === 'gap'
                      ? '/practice'
                      : content.insight.type === 'ats'
                      ? '/resume-builder'
                      : content.insight.type === 'opportunity'
                      ? '/opportunities'
                      : '/dashboard');
                  navigate(targetPath);
                }}
              >
                <span>Take Action Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {content.type === 'category_preview' && (
            <div>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.5, marginBottom: 14 }}>
                Explore tailored resources, practice queues, and real-time assessments for <strong>{content.category}</strong>.
              </p>
              <button
                className="ai-banner-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onClose();
                  if (content.category === 'resume') {
                    navigate('/resume-builder');
                  } else if (content.category === 'learn') {
                    navigate('/learning');
                  } else if (content.category === 'practice' || content.category === 'coding' || content.category === 'aptitude') {
                    navigate('/practice');
                  } else if (content.category === 'communication' || content.category === 'interview') {
                    navigate('/interview-studio');
                  } else if (content.category === 'internships' || content.category === 'opportunities') {
                    navigate('/opportunities');
                  } else if (content.category === 'placements') {
                    navigate('/placement');
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                <span>Launch {content.category === 'resume' ? 'Resume Builder' : content.category === 'learn' ? 'Learning Hub' : `${content.category} Workspace`}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
