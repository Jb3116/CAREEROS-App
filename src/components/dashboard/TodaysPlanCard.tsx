import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ListTodo, Plus, Sparkles } from 'lucide-react';
import { PlanTask } from '../../types/dashboard';

interface TodaysPlanCardProps {
  tasks: PlanTask[];
  onToggleTask: (id: string) => void;
  onStartPlan: () => void;
}

export const TodaysPlanCard: React.FC<TodaysPlanCardProps> = ({
  tasks,
  onToggleTask,
  onStartPlan,
}) => {
  const navigate = useNavigate();
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const handleActionClick = () => {
    // Route to practice or active task target
    const firstIncomplete = tasks.find((t) => !t.completed);
    if (firstIncomplete?.title.toLowerCase().includes('interview')) {
      navigate('/interview-studio');
    } else {
      navigate('/practice');
    }
  };

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Today's Plan
        </h2>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: completedCount === tasks.length ? '#059669' : '#4F46E5' }}>
          {completedCount}/{tasks.length} Completed ({progressPercent}%)
        </span>
      </div>

      {/* Progress Track */}
      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, margin: '4px 0 10px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: completedCount === tasks.length ? '#10B981' : 'linear-gradient(90deg, #4F46E5, #818CF8)',
            borderRadius: 999,
            transition: 'width 250ms ease',
          }}
        />
      </div>

      <div className="plan-list">
        {tasks.map((task) => {
          return (
            <div
              key={task.id}
              className={`plan-item ${task.completed ? 'completed' : ''}`}
              onClick={() => onToggleTask(task.id)}
              role="checkbox"
              aria-checked={task.completed}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggleTask(task.id);
                }
              }}
              title="Click to mark complete/pending"
              style={{ cursor: 'pointer' }}
            >
              <div className="plan-item-left">
                <div className="plan-checkbox">
                  {task.completed && <Check size={13} strokeWidth={3} />}
                </div>
                <span className="plan-item-text">{task.title}</span>
              </div>
              {task.tag && (
                <span
                  className="plan-item-tag"
                  style={{
                    background: task.completed ? '#ECFDF5' : '#EEF2FF',
                    color: task.completed ? '#059669' : '#4F46E5',
                    fontWeight: 700,
                  }}
                >
                  {task.completed ? '✓ Done' : task.tag}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="plan-footer">
        <span className="plan-progress-text">
          {completedCount === tasks.length
            ? '🎉 All daily goals achieved!'
            : `${tasks.length - completedCount} goals remaining today`}
        </span>
        <button
          className="btn-start-plan"
          onClick={handleActionClick}
          title="Jump into Coding & Aptitude Practice"
        >
          <span>Start Practice</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default TodaysPlanCard;
