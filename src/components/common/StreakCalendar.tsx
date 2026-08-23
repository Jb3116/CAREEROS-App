import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Check, Sparkles, Award, Zap, ChevronRight, ChevronLeft, Calendar, BarChart2 } from 'lucide-react';
import { calculateRealStreak, StudentEvent, DayActivityState, MonthDayActivityState } from '../../utils/streakCalculator';

interface StreakCalendarProps {
  streakDays?: number;
  longestStreak?: number;
  events?: StudentEvent[];
  compact?: boolean;
  onOpenPractice?: () => void;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streakDays: propStreakDays,
  longestStreak: propLongestStreak,
  events: propEvents,
  compact = false,
  onOpenPractice,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [fetchedEvents, setFetchedEvents] = useState<StudentEvent[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [monthOffset, setMonthOffset] = useState<number>(0);

  // Fetch verified student event ledger if not provided in props
  useEffect(() => {
    if (propEvents && propEvents.length > 0) return;

    let isMounted = true;

    // Load actual saved student events from local storage
    const loadRealEvents = () => {
      const localEventsStr = localStorage.getItem('careeros_local_events');
      let localEvents: StudentEvent[] = [];
      if (localEventsStr) {
        try {
          localEvents = JSON.parse(localEventsStr);
        } catch {}
      }

      // Also check event ledger
      const eventLedgerStr = localStorage.getItem('careeros_event_ledger');
      if (eventLedgerStr) {
        try {
          const ledger = JSON.parse(eventLedgerStr);
          if (Array.isArray(ledger)) {
            ledger.forEach((ev: any) => {
              if (ev.timestamp && !localEvents.some((le) => le.timestamp === ev.timestamp)) {
                localEvents.push({
                  student_id: 's123',
                  activity: ev.type || 'practice',
                  timestamp: ev.timestamp,
                  correct: true,
                });
              }
            });
          }
        } catch {}
      }

      return localEvents;
    };

    const initialEvents = loadRealEvents();
    setFetchedEvents(initialEvents);

    fetch('/api/student/dashboard?student_id=s123')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const currentEvents = loadRealEvents();
        const serverEvents = Array.isArray(data?.events) ? data.events : [];
        setFetchedEvents([...currentEvents, ...serverEvents]);
      })
      .catch(() => {
        if (!isMounted) return;
        setFetchedEvents(loadRealEvents());
      });

    return () => {
      isMounted = false;
    };
  }, [propEvents]);

  const activeEvents = propEvents && propEvents.length > 0 ? propEvents : fetchedEvents;

  // Real Streak calculations in user's local timezone
  const streakReport = useMemo(() => {
    return calculateRealStreak(activeEvents, new Date(), monthOffset);
  }, [activeEvents, monthOffset]);

  const currentStreak = propStreakDays !== undefined ? propStreakDays : streakReport.currentStreak;
  const longestStreak = propLongestStreak !== undefined ? propLongestStreak : streakReport.longestStreak;
  const weekDays = streakReport.weekDays;
  const monthReport = streakReport.monthReport;

  // ---------------- COMPACT MODE (HEADER PILL & POPOVER) ----------------
  if (compact) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1px solid #FED7AA',
            padding: '5px 12px',
            borderRadius: 999,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)',
            transition: 'all 150ms ease',
          }}
          title={`${currentStreak} Days Real Learning Streak • Click to see calendar`}
        >
          <Flame size={16} fill="#EA580C" color="#EA580C" style={{ animation: 'pulse 1.8s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#C2410C' }}>{currentStreak} Day Streak</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 2 }}>
            {weekDays.map((d, i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: d.isCompleted ? '#EA580C' : d.isToday ? '#F97316' : '#CBD5E1',
                }}
              />
            ))}
          </div>
        </button>

        {/* Compact Dropdown Popover with Week / Month switcher */}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 320,
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 15px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
              zIndex: 1000,
              animation: 'fadeIn 120ms ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame size={18} fill="#EA580C" color="#EA580C" />
                <span style={{ fontWeight: 900, fontSize: 14, color: '#0F172A' }}>{currentStreak} Day Streak Active!</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>
                Best: {longestStreak}d 🔥
              </span>
            </div>

            {/* Week day pills */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 12 }}>
              {weekDays.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: d.isToday ? '#EA580C' : '#64748B' }}>
                    {d.dayInitial}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: d.isToday
                        ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                        : d.isCompleted
                        ? '#FFEDD5'
                        : '#F1F5F9',
                      border: d.isToday
                        ? '2px solid #FDBA74'
                        : d.isCompleted
                        ? '1px solid #FED7AA'
                        : '1px solid #E2E8F0',
                      boxShadow: d.isToday ? '0 0 10px rgba(249, 115, 22, 0.5)' : 'none',
                    }}
                  >
                    {d.isToday ? (
                      <Flame size={14} fill="#FFFFFF" color="#FFFFFF" />
                    ) : d.isCompleted ? (
                      <Check size={14} color="#EA580C" strokeWidth={3} />
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: '#CBD5E1' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ margin: '0 0 12px 0', fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
              {streakReport.isActiveToday
                ? '✓ Today\'s practice completed! Placement readiness +5 XP.'
                : '⚡ Solve 1 coding problem today to maintain your daily streak!'}
            </p>

            {onOpenPractice && (
              <button
                onClick={onOpenPractice}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 0',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span>Launch Practice Sprint</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ---------------- FULL EXPANDED CARD LAYOUT (WEEK + NAVIGABLE MONTH) ----------------
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 18,
        border: '1px solid #FED7AA',
        padding: '20px 24px',
        boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Top Banner Header with View Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FFEDD5 0%, #FDBA74 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
            }}
          >
            <Flame size={26} fill="#EA580C" color="#EA580C" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {currentStreak} Day Continuous Learning Streak!
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#C2410C',
                  background: '#FFF7ED',
                  border: '1px solid #FED7AA',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                🔥 Best: {longestStreak} Days
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
              {streakReport.isActiveToday
                ? '✓ Today\'s practice verified! You are in the top 5% of consistent campus candidates.'
                : '⚡ Complete 1 problem today to extend your verified placement streak.'}
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Week vs Month */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: 3, borderRadius: 10, border: '1px solid #CBD5E1' }}>
          <button
            onClick={() => setViewMode('week')}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              border: 'none',
              background: viewMode === 'week' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'week' ? '#C2410C' : '#64748B',
              boxShadow: viewMode === 'week' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('month')}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              border: 'none',
              background: viewMode === 'month' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'month' ? '#C2410C' : '#64748B',
              boxShadow: viewMode === 'month' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Calendar size={13} />
            <span>Month Calendar</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: HORIZONTAL WEEK VIEW ================= */}
      {viewMode === 'week' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderTop: '1px solid #F1F5F9', paddingTop: 14, overflowX: 'auto' }}>
          {weekDays.map((d, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                flex: 1,
                minWidth: 42,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: d.isToday ? '#EA580C' : d.isCompleted ? '#0F172A' : '#94A3B8',
                }}
              >
                {d.dayInitial}
              </span>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: d.isToday
                    ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                    : d.isCompleted
                    ? '#FFEDD5'
                    : '#F8FAFC',
                  border: d.isToday
                    ? '2px solid #FDBA74'
                    : d.isCompleted
                    ? '1.5px solid #FED7AA'
                    : '1.5px solid #E2E8F0',
                  boxShadow: d.isToday ? '0 0 14px rgba(249, 115, 22, 0.55)' : 'none',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                title={`${d.dayName} (${d.formattedDate}): ${d.isCompleted ? `${d.activityCount} learning activities logged` : d.isToday ? 'Active today!' : 'No activity logged'}`}
              >
                {d.isToday ? (
                  <Flame size={20} fill="#FFFFFF" color="#FFFFFF" />
                ) : d.isCompleted ? (
                  <Check size={20} color="#EA580C" strokeWidth={3.5} />
                ) : (
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: '#CBD5E1' }} />
                )}
              </div>
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600 }}>{d.formattedDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* ================= VIEW 2: NAVIGABLE FULL MONTH CALENDAR ================= */}
      {viewMode === 'month' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
          {/* Month Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setMonthOffset((prev) => prev - 1)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <h4 style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {monthReport.monthName}
              </h4>
              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: 6 }}>
                {monthReport.monthActiveDaysCount} / {monthReport.monthTotalDays} Active Days ({monthReport.monthConsistencyPercent}%)
              </span>
              {monthOffset !== 0 && (
                <button
                  onClick={() => setMonthOffset(0)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Current Month
                </button>
              )}
            </div>
          </div>

          {/* Month Calendar Grid */}
          <div>
            {/* Weekday Names Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', marginBottom: 6 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => (
                <div key={idx} style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  {dayName}
                </div>
              ))}
            </div>

            {/* Month Day Slots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {monthReport.monthDays.map((mDay, idx) => (
                <div
                  key={idx}
                  style={{
                    height: 42,
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: mDay.isToday
                      ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                      : mDay.isCompleted
                      ? '#FFEDD5'
                      : mDay.isCurrentMonth
                      ? '#F8FAFC'
                      : '#F1F5F9',
                    border: mDay.isToday
                      ? '2px solid #FDBA74'
                      : mDay.isCompleted
                      ? '1px solid #FED7AA'
                      : '1px solid #E2E8F0',
                    color: mDay.isToday
                      ? '#FFFFFF'
                      : mDay.isCompleted
                      ? '#C2410C'
                      : mDay.isCurrentMonth
                      ? '#1E293B'
                      : '#94A3B8',
                    fontWeight: mDay.isCompleted || mDay.isToday ? 900 : 600,
                    fontSize: 12,
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: mDay.isToday ? '0 0 10px rgba(249, 115, 22, 0.4)' : 'none',
                  }}
                  title={`${mDay.dateStr}: ${mDay.isCompleted ? `${mDay.activityCount} tasks completed` : mDay.isToday ? 'Active Today!' : 'No activity'}`}
                >
                  <span>{mDay.dayNum}</span>
                  {mDay.isCompleted && !mDay.isToday && (
                    <span style={{ position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: 999, background: '#EA580C' }} />
                  )}
                  {mDay.isToday && (
                    <Flame size={10} fill="#FFFFFF" color="#FFFFFF" style={{ position: 'absolute', bottom: 2 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakCalendar;
