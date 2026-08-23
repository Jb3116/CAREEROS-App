import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Upcoming Deadline
        </h2>
        <button
          className="card-action-link"
          onClick={() => navigate('/practice')}
          title="Prepare for Assessment in Coding Arena"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span>Prepare Now</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div
        className="deadline-card-body"
        onClick={() => navigate('/opportunities')}
        title="View Placement Opportunities & Schedule"
        style={{ cursor: 'pointer' }}
      >
        <div className="deadline-icon-box">
          <Calendar size={22} />
        </div>

        <div className="deadline-details">
          <h3 className="deadline-title">{deadline.title}</h3>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
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

export default UpcomingDeadlineCard;
