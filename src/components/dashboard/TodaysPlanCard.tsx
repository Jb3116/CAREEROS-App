import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Clock, Target, Code2, Globe, Mic, Zap, ShieldCheck } from 'lucide-react';
import {
  AutomatedPlanTask,
  generateAutomatedTodaysPlan,
  subscribeAppEvent,
} from '../../utils/appEvents';

interface TodaysPlanCardProps {
  onStartPlan?: () => void;
}

export const TodaysPlanCard: React.FC<TodaysPlanCardProps> = ({ onStartPlan }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<AutomatedPlanTask[]>(() => generateAutomatedTodaysPlan());

  // Subscribe to real-time application events (problemSolved, lessonCompleted, speakingSessionCompleted)
  useEffect(() => {
    // Initial sync
    setTasks(generateAutomatedTodaysPlan());

    const unsubscribe = subscribeAppEvent((event) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.eventType === event.type) {
            return {
              ...t,
              status: 'completed',
              completedAt: event.timestamp,
            };
          }
          return t;
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coding':
        return <Code2 size={16} color="#4F46E5" />;
      case 'language':
        return <Globe size={16} color="#059669" />;
      case 'speaking':
        return <Mic size={16} color="#D97706" />;
      default:
        return <Target size={16} color="#6366F1" />;
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 18,
        border: '1px solid #E2E8F0',
        padding: '20px 24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4F46E5',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Today's Adaptive Plan
              </h2>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#4F46E5',
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  padding: '1px 6px',
                  borderRadius: 999,
                }}
              >
                Event-Driven
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              Calibrated to your weakest skill gaps &amp; active roadmap
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: completedCount === tasks.length ? '#059669' : '#4F46E5',
          }}
        >
          {completedCount}/{tasks.length} Completed ({progressPercent}%)
        </span>
      </div>

      {/* If No Tasks Exist (New Unevaluated Student) */}
      {tasks.length === 0 ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #F8FAFC, #EEF2FF)',
            border: '1.5px dashed #CBD5E1',
            borderRadius: 14,
            padding: '24px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div style={{ maxWidth: 460 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
              Your Adaptive Plan will appear after your first assessment
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Complete the diagnostic assessment to allow our AI to pinpoint your exact skill gaps and calibrate daily high-yield practice drills.
            </p>
          </div>
          <button
            onClick={() => navigate('/assessment')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              marginTop: 4,
            }}
          >
            <span>Take Diagnostic Assessment</span>
            <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <>
          {/* Progress Track */}
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background:
                  completedCount === tasks.length
                    ? '#10B981'
                    : 'linear-gradient(90deg, #4F46E5, #818CF8)',
                borderRadius: 999,
                transition: 'width 300ms ease',
              }}
            />
          </div>

          {/* Task List (Automated, Read-Only with Direct Action Buttons) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  style={{
                    background: isDone ? '#F0FDF4' : '#F8FAFC',
                    border: isDone ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    transition: 'all 150ms ease',
                  }}
                >
                  {/* Left Column: Icon & Task Details */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: isDone ? '#DCFCE7' : '#FFFFFF',
                        border: isDone ? '1.5px solid #10B981' : '1px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {isDone ? <Check size={16} color="#059669" strokeWidth={3} /> : getCategoryIcon(task.category)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 800,
                          color: isDone ? '#166534' : '#0F172A',
                          textDecoration: isDone ? 'line-through' : 'none',
                          margin: '0 0 2px 0',
                        }}
                      >
                        {task.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: isDone ? '#15803D' : '#64748B', lineHeight: 1.4 }}>
                        {isDone ? '✓ Verified by platform event telemetry' : task.rationale}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status & Action Button */}
                  <div>
                    {isDone ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #86EFAC',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        <Check size={12} strokeWidth={3} /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate(task.route)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#4F46E5',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span>{task.actionLabel}</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              {completedCount === tasks.length
                ? '🎉 All daily target goals completed! Placement readiness +10 XP.'
                : '⚡ Tasks automatically complete as you practice and solve problems.'}
            </span>
            <button
              onClick={() => navigate('/practice')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4F46E5',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>View Practice Hub</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodaysPlanCard;
