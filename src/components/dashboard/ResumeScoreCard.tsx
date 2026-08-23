import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumeScoreCardProps {
  score?: number | null;
  onImproveResume?: () => void;
}

export const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({
  score = 0,
  onImproveResume,
}) => {
  const navigate = useNavigate();
  const currentScore = typeof score === 'number' ? score : 0;
  const isZeroState = currentScore === 0;

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">Resume ATS Score</h2>
        <button
          className="card-action-link"
          onClick={() => (onImproveResume ? onImproveResume() : navigate('/resume-builder'))}
          title={isZeroState ? 'Create AI Resume' : 'Open AI Resume Builder'}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span>{isZeroState ? 'Build Resume' : 'Improve Resume'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div
        className="ats-card-body"
        onClick={() => (onImproveResume ? onImproveResume() : navigate('/resume-builder'))}
        title={isZeroState ? 'Build Resume & Get ATS Score' : `ATS Score: ${currentScore}%`}
        style={{ cursor: 'pointer' }}
      >
        <div className="ats-info-col">
          {isZeroState ? (
            <>
              <p className="ats-highlight" style={{ color: '#64748B' }}>
                No resume available yet. Create or upload your resume to get your ATS score and target placement matching.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12, fontWeight: 700 }}>
                <FileText size={14} />
                <span>No resume uploaded</span>
              </div>
            </>
          ) : (
            <>
              <p className="ats-highlight">
                Your resume achieves a <strong>{currentScore}%</strong> ATS compatibility score optimized for automated campus screening parsers.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: currentScore >= 80 ? '#059669' : '#D97706',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {currentScore >= 80 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{currentScore >= 80 ? 'Ready for placement upload' : 'Optimization recommended'}</span>
              </div>
            </>
          )}
        </div>

        <div
          className="ats-badge-circle"
          title={isZeroState ? 'ATS Score: 0%' : `ATS Score: ${currentScore}%`}
          style={
            isZeroState
              ? {
                  background: '#F1F5F9',
                  color: '#64748B',
                  border: '1.5px solid #CBD5E1',
                }
              : currentScore >= 80
              ? {
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1.5px solid #A7F3D0',
                }
              : {
                  background: '#FFFBEB',
                  color: '#D97706',
                  border: '1.5px solid #FDE68A',
                }
          }
        >
          {currentScore}%
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreCard;

