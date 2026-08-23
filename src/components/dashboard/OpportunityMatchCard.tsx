import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Sparkles, Building } from 'lucide-react';
import { OpportunityItem } from '../../types/dashboard';

interface OpportunityMatchCardProps {
  opportunity: OpportunityItem;
  onViewDetails?: () => void;
}

export const OpportunityMatchCard: React.FC<OpportunityMatchCardProps> = ({
  opportunity,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Opportunity Match
        </h2>
        <button
          className="card-action-link"
          onClick={() => navigate('/opportunities')}
          title="Explore All Matched Placement Opportunities"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span>View all</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div
        className="opp-body"
        onClick={() => navigate('/opportunities')}
        title="View details in Opportunities & Smart Calendar"
        style={{ cursor: 'pointer' }}
      >
        <div className="opp-icon-box">
          <Briefcase size={22} />
        </div>

        <div className="opp-details">
          <h3 className="opp-title">{opportunity.role}</h3>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            {opportunity.company} • {opportunity.location}
          </span>
          <div className="opp-tags">
            <span className="opp-match-badge">
              <Sparkles size={10} style={{ display: 'inline', marginRight: 3 }} />
              {opportunity.matchScore}% Match
            </span>
            <span className="opp-deadline-sub">{opportunity.deadlineDays} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityMatchCard;
