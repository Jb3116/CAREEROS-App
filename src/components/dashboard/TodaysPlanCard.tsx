import React from 'react';
import { Check, ArrowRight, ListTodo } from 'lucide-react';
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
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Today's Plan
        </h2>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>
          {completedCount}/{tasks.length} Completed
        </span>
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
            >
              <div className="plan-item-left">
                <div className="plan-checkbox">
                  {task.completed && <Check size={13} strokeWidth={3} />}
                </div>
                <span className="plan-item-text">{task.title}</span>
              </div>
              {task.tag && <span className="plan-item-tag">{task.tag}</span>}
            </div>
          );
        })}
      </div>

      <div className="plan-footer">
        <span className="plan-progress-text">
          {completedCount === tasks.length
            ? '🎉 All daily targets accomplished!'
            : `${tasks.length - completedCount} tasks remaining today`}
        </span>
        <button className="btn-start-plan" onClick={onStartPlan}>
          <span>Start Now</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
