import React from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { DeadlineItem } from '../../types/dashboard';

interface UpcomingDeadlineCardProps {
  deadline: DeadlineItem;
  onPrepare?: () => void;
}

export const UpcomingDeadlineCard: React.FC<UpcomingDeadlineCardProps> = ({
  deadline,
  onPrepare,
}) => {
  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Upcoming Deadline
        </h2>
        <button className="card-action-link" onClick={onPrepare}>
          <span>Prepare Now</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="deadline-card-body">
        <div className="deadline-icon-box">
          <Calendar size={22} />
        </div>

        <div className="deadline-details">
          <h3 className="deadline-title">{deadline.title}</h3>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
            {deadline.company} • {deadline.type}
          </span>
          <div className="deadline-tag-row">
            <span className="days-badge">
              <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />
              {deadline.daysLeft} days left
            </span>
            <span className="deadline-date">{deadline.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
