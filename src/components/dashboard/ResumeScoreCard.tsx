import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface ResumeScoreCardProps {
  score: number;
  onImproveResume?: () => void;
}

export const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({
  score = 91,
  onImproveResume,
}) => {
  const navigate = useNavigate();

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Resume ATS Score
        </h2>
        <button
          className="card-action-link"
          onClick={() => navigate('/resume-builder')}
          title="Open AI Resume Builder"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span>Improve Resume</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div
        className="ats-card-body"
        onClick={() => navigate('/resume-builder')}
        title="Open AI Resume Builder & ATS Scorer"
        style={{ cursor: 'pointer' }}
      >
        <div className="ats-info-col">
          <p className="ats-highlight">
            Your resume matches <strong>91%</strong> of target SWE job descriptions and is optimized for automated ATS parsers.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: 12, fontWeight: 700 }}>
            <CheckCircle2 size={14} />
            <span>Ready for placement upload</span>
          </div>
        </div>

        <div className="ats-badge-circle" title="ATS Match Score: 91%">
          {score}%
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreCard;
