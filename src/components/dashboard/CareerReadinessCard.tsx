import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Info, ArrowRight } from 'lucide-react';

interface CareerReadinessCardProps {
  score?: number | null;
  onViewDetails?: () => void;
}

export const CareerReadinessCard: React.FC<CareerReadinessCardProps> = ({
  score = null,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const isAssessed = typeof score === 'number' && score > 0;
  const displayScore = isAssessed ? score : 0;

  // SVG Donut calculation
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isAssessed
    ? circumference - (displayScore / 100) * circumference
    : circumference;

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Career Readiness
        </h2>
        <button
          onClick={onViewDetails}
          title="Click to view readiness breakdown score"
          style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Readiness calculation info"
        >
          <Info size={16} />
        </button>
      </div>

      <div className="readiness-body">
        <div
          className="gauge-container"
          onClick={() => navigate('/assessment')}
          title="Click to Take or Review Diagnostic Assessment"
          style={{ cursor: 'pointer' }}
        >
          <svg className="gauge-svg" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="60%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            <circle
              className="gauge-bg"
              cx="80"
              cy="80"
              r={radius}
            />
            <circle
              className="gauge-progress"
              cx="80"
              cy="80"
              r={radius}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                stroke: isAssessed ? 'url(#readinessGradient)' : '#E2E8F0',
              }}
            />
          </svg>

          <div className="gauge-center-content">
            {isAssessed ? (
              <>
                <span className="gauge-value">{score}%</span>
                <span className="gauge-label">Placement Ready</span>
              </>
            ) : (
              <>
                <span className="gauge-value" style={{ fontSize: 14, fontWeight: 800, color: '#64748B' }}>
                  Not Assessed
                </span>
                <span className="gauge-label" style={{ fontSize: 10.5, color: '#94A3B8' }}>
                  Awaiting Test
                </span>
              </>
            )}
          </div>
        </div>

        {!isAssessed && (
          <div style={{ fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 1.4, margin: '2px 0 6px' }}>
            Complete your assessment to calculate your career readiness.
          </div>
        )}

        <button
          className="readiness-status-badge"
          onClick={() => navigate('/assessment')}
          title="Start or review Placement Assessment"
          style={{ cursor: 'pointer', border: 'none' }}
        >
          <TrendingUp size={14} />
          <span>{isAssessed ? 'Review Assessment' : 'Take Assessment'}</span>
        </button>
      </div>
    </div>
  );
};

export default CareerReadinessCard;
