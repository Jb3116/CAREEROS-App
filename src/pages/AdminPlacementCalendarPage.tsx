import React, { useState } from 'react';
import {
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  Send,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Video,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  company: string;
  category: 'deadline' | 'oa' | 'ppt' | 'interview';
  categoryLabel: string;
  day: number;
  month: string;
  time: string;
  venue: string;
  registeredCount: number;
  targetBatch: string;
}

export const AdminPlacementCalendarPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<'August 2026' | 'September 2026'>('August 2026');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Event Form
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCompany, setNewEventCompany] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'deadline' | 'oa' | 'ppt' | 'interview'>('oa');
  const [newEventDay, setNewEventDay] = useState('28');
  const [newEventTime, setNewEventTime] = useState('6:00 PM - 8:00 PM');
  const [newEventVenue, setNewEventVenue] = useState('Central Computing Lab 1-4');

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'Google SWE Intern App Window Closes',
      company: 'Google',
      category: 'deadline',
      categoryLabel: '🔴 REGISTRATION DEADLINE',
      day: 25,
      month: 'August 2026',
      time: '11:59 PM',
      venue: 'Online Campus Portal',
      registeredCount: 320,
      targetBatch: 'Batch 2026 CSE/IT (>= 8.5 CGPA)',
    },
    {
      id: 'e2',
      title: 'Goldman Sachs HackerRank OA (120 Mins)',
      company: 'Goldman Sachs',
      category: 'oa',
      categoryLabel: '🟣 ONLINE ASSESSMENT (OA)',
      day: 28,
      month: 'August 2026',
      time: '6:00 PM - 8:00 PM',
      venue: 'Central Computing Lab 1-4 / Remote',
      registeredCount: 280,
      targetBatch: 'Shortlisted Circuital Candidates',
    },
    {
      id: 'e3',
      title: 'Razorpay Online Coding Sprint',
      company: 'Razorpay',
      category: 'oa',
      categoryLabel: '🟣 ONLINE ASSESSMENT (OA)',
      day: 2,
      month: 'September 2026',
      time: '5:00 PM - 7:00 PM',
      venue: 'HackerEarth Platform',
      registeredCount: 210,
      targetBatch: 'Full Stack & Backend Track',
    },
    {
      id: 'e4',
      title: 'Microsoft Azure Cloud PPT & Tech Briefing',
      company: 'Microsoft',
      category: 'ppt',
      categoryLabel: '🟠 PRE-PLACEMENT TALK (PPT)',
      day: 5,
      month: 'September 2026',
      time: '4:00 PM - 6:00 PM',
      venue: 'Main University Auditorium (Hall A)',
      registeredCount: 410,
      targetBatch: 'All 3rd Year B.Tech & M.Tech',
    },
    {
      id: 'e5',
      title: 'Zepto Supply Chain Engineering Interviews',
      company: 'Zepto',
      category: 'interview',
      categoryLabel: '🟢 TECHNICAL INTERVIEWS',
      day: 8,
      month: 'September 2026',
      time: '9:00 AM - 6:00 PM',
      venue: 'Placement Cell Boardroom 1 & 2',
      registeredCount: 45,
      targetBatch: 'Interview Shortlisted Finalists',
    },
    {
      id: 'e6',
      title: 'Amazon SDE Bar Raiser Final Sprints',
      company: 'Amazon',
      category: 'interview',
      categoryLabel: '🟢 TECHNICAL INTERVIEWS',
      day: 12,
      month: 'September 2026',
      time: '10:00 AM - 5:00 PM',
      venue: 'Amazon Chime Live Video Panels',
      registeredCount: 38,
      targetBatch: 'Final Round Candidates',
    },
  ]);

  // Calendar Day generation for August (starts on Saturday Aug 1, 31 days)
  const augustDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - 5; // Adjust start offset for Sat Aug 1
    const isCurrentMonth = dayNumber >= 1 && dayNumber <= 31;
    return {
      day: isCurrentMonth ? dayNumber : dayNumber < 1 ? 31 + dayNumber : dayNumber - 31,
      isCurrentMonth,
      isToday: isCurrentMonth && dayNumber === 23, // Aug 23 is current active day
      dateKey: dayNumber,
    };
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventCompany.trim()) return;

    const created: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      company: newEventCompany,
      category: newEventCategory,
      categoryLabel:
        newEventCategory === 'deadline'
          ? '🔴 REGISTRATION DEADLINE'
          : newEventCategory === 'oa'
          ? '🟣 ONLINE ASSESSMENT (OA)'
          : newEventCategory === 'ppt'
          ? '🟠 PRE-PLACEMENT TALK (PPT)'
          : '🟢 TECHNICAL INTERVIEWS',
      day: parseInt(newEventDay) || 28,
      month: selectedMonth,
      time: newEventTime,
      venue: newEventVenue,
      registeredCount: 0,
      targetBatch: 'All Verified Eligible Candidates',
    };

    setEvents([...events, created]);
    setShowScheduleModal(false);
    setNewEventTitle('');
    setNewEventCompany('');
    setToastMessage(`✓ ${newEventTitle} added to master campus placement schedule!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getEventsForDay = (day: number) => {
    return events.filter((e) => e.day === day && e.month === selectedMonth);
  };

  return (
    <div className="calendar-page-container">
      {/* ---------------- Toast Alert ---------------- */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            background: '#064E3B',
            color: '#A7F3D0',
            border: '1px solid #059669',
            padding: '12px 20px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 13.5,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------- Hero Header ---------------- */}
      <section className="calendar-header-card" aria-label="Placement Calendar Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CalendarDays size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Institutional Placement Calendar & Master Schedule
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Coordinate recruiter arrival slots, auditorium PPT briefings, HackerRank test windows, and interview rooms.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowScheduleModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
            }}
          >
            <Plus size={16} />
            <span>Schedule Drive Event</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="calendar-stats-grid">
        <div className="calendar-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Total Scheduled Sprints</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>18 Events</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>August & September 2026</div>
        </div>

        <div className="calendar-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Online Assessment Windows</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>6 OA Tests</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>HackerRank & Mettle Active</div>
        </div>

        <div className="calendar-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>In-Person PPT Briefings</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>4 Sessions</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>Main Auditorium Booked</div>
        </div>

        <div className="calendar-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Technical Interview Panels</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>8 Panels</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>Boardrooms & Video Chime</div>
        </div>
      </div>

      {/* ---------------- Split Workspace ---------------- */}
      <div className="calendar-workspace-grid">
        {/* Left: Main Month Grid */}
        <div className="calendar-main-card">
          {/* Top Month Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {selectedMonth}
              </h2>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setSelectedMonth('August 2026')}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: selectedMonth === 'August 2026' ? '#EEF2FF' : '#FFFFFF',
                    color: selectedMonth === 'August 2026' ? '#4F46E5' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedMonth('September 2026')}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: selectedMonth === 'September 2026' ? '#EEF2FF' : '#FFFFFF',
                    color: selectedMonth === 'September 2026' ? '#4F46E5' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* View Selector */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 10, gap: 2 }}>
              {(['month', 'week', 'agenda'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: viewMode === mode ? '#FFFFFF' : 'transparent',
                    color: viewMode === mode ? '#4F46E5' : '#64748B',
                    fontWeight: viewMode === mode ? 800 : 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    boxShadow: viewMode === mode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    textTransform: 'capitalize',
                  }}
                >
                  {mode} View
                </button>
              ))}
            </div>
          </div>

          {/* Grid Header (Days of week) */}
          <div className="calendar-grid-header">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* 35 Day Cell Grid */}
          <div className="calendar-month-grid">
            {augustDays.map((d, index) => {
              const dayEvents = d.isCurrentMonth ? getEventsForDay(d.day) : [];
              return (
                <div
                  key={index}
                  className={`calendar-day-cell ${!d.isCurrentMonth ? 'other-month' : ''} ${
                    d.isToday ? 'today' : ''
                  }`}
                >
                  <span className="calendar-day-number">{d.day}</span>
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`calendar-event-pill ${
                        ev.category === 'deadline'
                          ? 'deadline'
                          : ev.category === 'oa'
                          ? 'oa'
                          : ev.category === 'ppt'
                          ? 'ppt'
                          : 'interview'
                      }`}
                      title={`${ev.title} (${ev.time})`}
                    >
                      <span>{ev.company}: {ev.title.slice(0, 16)}...</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Upcoming Sprints & Conflict Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Conflict Guard Badge */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={24} color="#059669" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#065F46' }}>Zero Venue Conflicts</div>
              <span style={{ fontSize: 11.5, color: '#047857' }}>All computing labs and auditorium slots verified clear.</span>
            </div>
          </div>

          {/* Upcoming Event Chronology */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', marginBottom: 14 }}>
              Upcoming Drive Sprints
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  style={{
                    padding: 12,
                    background: '#F8FAFC',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5' }}>{ev.categoryLabel}</span>
                    <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>{ev.month.slice(0, 3)} {ev.day}</span>
                  </div>
                  <strong style={{ fontSize: 13, color: '#0F172A' }}>{ev.title}</strong>
                  <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {ev.time} • <MapPin size={12} /> {ev.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Event Details Modal ---------------- */}
      {selectedEvent && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#4F46E5' }}>{selectedEvent.categoryLabel}</span>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '4px 0 0' }}>
                  {selectedEvent.title}
                </h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
              <div>🏢 Company Partner: <strong>{selectedEvent.company}</strong></div>
              <div>📅 Scheduled Date: <strong>{selectedEvent.month} {selectedEvent.day}, 2026</strong> ({selectedEvent.time})</div>
              <div>📍 Location / Platform: <strong>{selectedEvent.venue}</strong></div>
              <div>🎯 Target Cohort: <strong>{selectedEvent.targetBatch}</strong></div>
              <div>👥 Registered Candidates: <strong>{selectedEvent.registeredCount} Verified Students</strong></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close View
              </button>
              <button
                onClick={() => {
                  setToastMessage(`✓ Broadcast reminder dispatched to all ${selectedEvent.registeredCount} registered candidates!`);
                  setSelectedEvent(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Send size={14} />
                <span>Send Reminder Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Schedule Event Modal ---------------- */}
      {showScheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarDays size={22} color="#4F46E5" />
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Schedule Placement Drive Event
                </h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Goldman Sachs HackerRank OA Exam..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Goldman Sachs"
                    value={newEventCompany}
                    onChange={(e) => setNewEventCompany(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Event Category
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                  >
                    <option value="oa">🟣 Online Assessment (OA)</option>
                    <option value="deadline">🔴 Registration Deadline</option>
                    <option value="ppt">🟠 Pre-Placement Talk (PPT)</option>
                    <option value="interview">🟢 Technical Interviews</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Day of Month (Aug 2026)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newEventDay}
                    onChange={(e) => setNewEventDay(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Event Time Window
                  </label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Venue / Platform Location
                </label>
                <input
                  type="text"
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={14} />
                  <span>Add to Calendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlacementCalendarPage;
