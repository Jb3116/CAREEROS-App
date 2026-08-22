import React from 'react';
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
  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Opportunity Match
        </h2>
        <button className="card-action-link" onClick={onViewDetails}>
          <span>View all</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="opp-body">
        <div className="opp-icon-box">
          <Briefcase size={22} />
        </div>

        <div className="opp-details">
          <h3 className="opp-title">{opportunity.role}</h3>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
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
