import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ArrowRight, Sparkles, ExternalLink, Calendar, Code2, Brain } from 'lucide-react';
import { SmartInsight, PlanTask, OpportunityItem, DeadlineItem } from '../../types/dashboard';

export type ModalContentType =
  | { type: 'task_detail'; data: PlanTask }
  | { type: 'readiness_breakdown'; score: number }
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
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 800,
                  }}
                >
                  {content.score}%
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Placement Target: 85%+</h3>
                  <p style={{ fontSize: 13, color: '#64748B' }}>
                    Calculated from verified assessment attempts, coding challenges, and mock interviews.
                  </p>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Coding Demonstrated Mastery</span>
                  <span style={{ color: '#4F46E5', fontWeight: 700 }}>72%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Aptitude & Problem Solving</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>81%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Communication & Soft Skills</span>
                  <span style={{ color: '#D97706', fontWeight: 700 }}>64%</span>
                </div>
              </div>
            </div>
          )}

          {content.type === 'resume_ats' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>{content.score}%</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Placement Ready Score</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Matches Tier-1 Product Engineering criteria</div>
                </div>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#334155', marginBottom: 16 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Key technical keywords (React, Node, SQLite, Algorithms) verified</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Format passes Workday, Greenhouse & Lever parser checks</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Quantitative impact metrics present across 3 projects</span>
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
                  onClick={onClose}
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
                onClick={onClose}
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
