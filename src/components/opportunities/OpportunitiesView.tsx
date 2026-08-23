import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Sparkles,
  Building,
  MapPin,
  DollarSign,
  FileText,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Send,
  X,
} from 'lucide-react';
import { useStudentProfile } from '../../utils/userProfile';

interface DriveItem {
  id: string;
  company: string;
  role: string;
  logoBg: string;
  initials: string;
  type: 'On-Campus Drive' | 'Off-Campus Internship' | 'Full-Time SDE';
  stipendOrSalary: string;
  location: string;
  deadlineDate: string;
  daysRemaining: number;
  matchScore: number;
  tags: string[];
  status: 'Open' | 'Applied' | 'Shortlisted' | 'Assessment Scheduled';
  roundInfo: string;
}

export const OpportunitiesView: React.FC = () => {
  const navigate = useNavigate();
  const profile = useStudentProfile();
  const [activeTab, setActiveTab] = useState<'drives' | 'calendar' | 'pipeline'>('drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDrive, setSelectedDrive] = useState<DriveItem | null>(null);
  const [appliedDrives, setAppliedDrives] = useState<string[]>(['d1']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const drives: DriveItem[] = [
    {
      id: 'd1',
      company: 'Goldman Sachs',
      role: 'Summer Analyst 2026 - Engineering',
      logoBg: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      initials: 'GS',
      type: 'On-Campus Drive',
      stipendOrSalary: '₹1,50,000 / mo',
      location: 'Bangalore / Hyderabad',
      deadlineDate: 'Aug 28, 2026',
      daysRemaining: 5,
      matchScore: 94,
      tags: ['C++', 'DSA Trees & Graphs', 'System Design', 'Quantitative Logic'],
      status: 'Shortlisted',
      roundInfo: 'HackerRank OA on Aug 28 (120 mins)',
    },
    {
      id: 'd2',
      company: 'Google',
      role: 'Software Engineering Intern (Summer 2026)',
      logoBg: 'linear-gradient(135deg, #EA4335 0%, #FBBC05 100%)',
      initials: 'G',
      type: 'On-Campus Drive',
      stipendOrSalary: '₹1,75,000 / mo',
      location: 'Bangalore / Pune',
      deadlineDate: 'Aug 25, 2026',
      daysRemaining: 2,
      matchScore: 91,
      tags: ['Algorithms', 'Python', 'Go', 'Tree LCA'],
      status: 'Open',
      roundInfo: 'Registration Closes in 48 Hours',
    },
    {
      id: 'd3',
      company: 'Razorpay',
      role: 'Product Engineering Intern',
      logoBg: 'linear-gradient(135deg, #0C2340 0%, #0080FF 100%)',
      initials: 'RZ',
      type: 'Off-Campus Internship',
      stipendOrSalary: '₹80,000 / mo',
      location: 'Bangalore',
      deadlineDate: 'Sep 02, 2026',
      daysRemaining: 10,
      matchScore: 88,
      tags: ['React', 'Node.js', 'PostgreSQL', 'Microservices'],
      status: 'Open',
      roundInfo: 'Round 1 Coding Challenge: Sep 04',
    },
    {
      id: 'd4',
      company: 'Zepto',
      role: 'Backend SDE Intern - Supply Chain',
      logoBg: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)',
      initials: 'ZP',
      type: 'Off-Campus Internship',
      stipendOrSalary: '₹1,00,000 / mo',
      location: 'Mumbai / Remote',
      deadlineDate: 'Sep 05, 2026',
      daysRemaining: 13,
      matchScore: 86,
      tags: ['Go', 'Kafka', 'Redis', 'High-Scale Concurrency'],
      status: 'Open',
      roundInfo: 'Rolling Shortlists Every Friday',
    },
    {
      id: 'd5',
      company: 'Microsoft',
      role: 'Software Development Engineer (Full-Time 2026)',
      logoBg: 'linear-gradient(135deg, #0078D4 0%, #002050 100%)',
      initials: 'MS',
      type: 'Full-Time SDE',
      stipendOrSalary: '₹32 - 44 LPA',
      location: 'Hyderabad / Noida',
      deadlineDate: 'Sep 10, 2026',
      daysRemaining: 18,
      matchScore: 84,
      tags: ['C#', 'Azure', 'DSA', 'OOP Architecture'],
      status: 'Open',
      roundInfo: 'Pre-Placement Talk (PPT): Sep 06',
    },
  ];

  const handleApply = (drive: DriveItem) => {
    if (!appliedDrives.includes(drive.id)) {
      setAppliedDrives([...appliedDrives, drive.id]);
    }
    setToastMessage(`✓ Successfully submitted tailored ATS resume to ${drive.company}!`);
    setSelectedDrive(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType =
      filterType === 'all' ||
      (filterType === 'campus' && d.type === 'On-Campus Drive') ||
      (filterType === 'intern' && d.type === 'Off-Campus Internship') ||
      (filterType === 'fulltime' && d.type === 'Full-Time SDE');
    return matchesSearch && matchesType;
  });

  return (
    <div className="opp-page-container">
      {/* ---------------- Toast Notification ---------------- */}
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
            animation: 'slideIn 200ms ease',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------- Top Hero Stats Banner ---------------- */}
      <section className="opp-header-card" data-tour-id="opportunities" data-tour="opportunities" aria-label="Opportunities Summary">
        <div className="opp-header-top">
          <div className="opp-header-title-group">
            <h1>
              <Briefcase size={26} color="#818CF8" />
              <span>Opportunities & Smart Placement Calendar</span>
            </h1>
            <p>
              AI-calibrated campus drives, ATS resume matching scores, and real-time assessment schedules for <strong>{profile.name}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34D399',
                fontSize: 12.5,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 999,
              }}
            >
              <Sparkles size={14} />
              <span>14 Verified Drives Active</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="opp-stats-row">
          <div className="opp-stat-box">
            <span className="opp-stat-val" style={{ color: '#818CF8' }}>
              94% Match
            </span>
            <span className="opp-stat-lbl">Top Fit: Goldman Sachs SDE</span>
          </div>
          <div className="opp-stat-box">
            <span className="opp-stat-val" style={{ color: '#F87171' }}>
              3 Days Left
            </span>
            <span className="opp-stat-lbl">Google Summer Intern Reg.</span>
          </div>
          <div className="opp-stat-box">
            <span className="opp-stat-val" style={{ color: '#34D399' }}>
              5 In Pipeline
            </span>
            <span className="opp-stat-lbl">2 Shortlisted • 1 OA Scheduled</span>
          </div>
          <div className="opp-stat-box">
            <span className="opp-stat-val" style={{ color: '#FBBF24' }}>
              ₹1.5L / mo
            </span>
            <span className="opp-stat-lbl">Average Tier-1 Stipend</span>
          </div>
        </div>
      </section>

      {/* ---------------- Navigation Tabs ---------------- */}
      <div className="opp-mode-tabs">
        {[
          { id: 'drives', label: '💼 Verified Drives & Openings (14)', icon: Briefcase },
          { id: 'calendar', label: '📅 Smart Placement Calendar', icon: CalendarDays },
          { id: 'pipeline', label: '📈 Application Tracker & Pipeline', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`opp-mode-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB 1: ALL DRIVES & EXPLORER ---------------- */}
      {activeTab === 'drives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Filter & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 280, maxWidth: 420 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by company, role, skills (e.g. Goldman, React, C++)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 16px 0 38px',
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#1E293B',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Openings' },
                { id: 'campus', label: 'On-Campus Drives' },
                { id: 'intern', label: 'Internships' },
                { id: 'fulltime', label: 'Full-Time SDE' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterType(pill.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    border: '1px solid #CBD5E1',
                    background: filterType === pill.id ? '#4F46E5' : '#FFFFFF',
                    color: filterType === pill.id ? '#FFFFFF' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities Cards Grid */}
          <div className="opp-cards-grid">
            {filteredDrives.map((drive) => {
              const isApplied = appliedDrives.includes(drive.id);
              return (
                <div key={drive.id} className="opp-drive-card">
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="opp-company-badge-box" style={{ background: drive.logoBg }}>
                        {drive.initials}
                      </div>
                      <div>
                        <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
                          {drive.company}
                        </h2>
                        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{drive.type}</span>
                      </div>
                    </div>

                    <div className="opp-match-pill">
                      <Sparkles size={12} />
                      <span>{drive.matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Role Title & Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#1E293B' }}>{drive.role}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <DollarSign size={14} color="#059669" />
                        <strong style={{ color: '#059669' }}>{drive.stipendOrSalary}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} />
                        {drive.location}
                      </span>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {drive.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: '#F1F5F9',
                          color: '#334155',
                          padding: '3px 9px',
                          borderRadius: 6,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Round Timeline & CTA Actions */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: drive.daysRemaining <= 3 ? '#DC2626' : '#64748B', fontWeight: 700 }}>
                      <Clock size={14} />
                      <span>{drive.daysRemaining <= 3 ? `Closing in ${drive.daysRemaining} days!` : drive.roundInfo}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setSelectedDrive(drive)}
                        style={{
                          background: '#EEF2FF',
                          color: '#4F46E5',
                          border: '1px solid #C7D2FE',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Syllabus
                      </button>

                      <button
                        onClick={() => handleApply(drive)}
                        disabled={isApplied}
                        style={{
                          background: isApplied ? '#ECFDF5' : 'linear-gradient(135deg, #4F46E5, #4338CA)',
                          color: isApplied ? '#059669' : '#FFFFFF',
                          border: isApplied ? '1px solid #A7F3D0' : 'none',
                          padding: '6px 14px',
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: 800,
                          cursor: isApplied ? 'default' : 'pointer',
                        }}
                      >
                        {isApplied ? 'Applied ✓' : '1-Click Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: SMART PLACEMENT CALENDAR ---------------- */}
      {activeTab === 'calendar' && (
        <div className="opp-calendar-grid">
          {/* Left: Monthly Grid */}
          <div className="opp-calendar-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>August / September 2026</h2>
                <span style={{ fontSize: 12.5, color: '#64748B' }}>Campus Placement Drive & Assessment Schedule</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 12, fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} /> Deadline
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#7C3AED' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} /> OA Exam
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} /> Interview
                </span>
              </div>
            </div>

            <div className="opp-days-header">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            <div className="opp-days-grid">
              {/* Sample calendar cells */}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 23;
                return (
                  <div key={day} className={`opp-cal-day ${isToday ? 'today' : ''}`}>
                    <span>{day}</span>
                    {day === 25 && <div className="opp-event-chip deadline">Google Closes</div>}
                    {day === 28 && <div className="opp-event-chip oa">Goldman OA</div>}
                    {day === 30 && <div className="opp-event-chip interview">Prep Mock Round</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Upcoming Timeline */}
          <div className="opp-calendar-box">
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', marginBottom: 14 }}>
              Upcoming Milestones This Week
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 14, borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13, color: '#DC2626' }}>
                  <span>Google SDE Intern</span>
                  <span>Aug 25 (2 Days)</span>
                </div>
                <p style={{ fontSize: 12, color: '#7F1D1D', margin: '4px 0 0' }}>
                  Official registration deadline on campus placement portal. Ensure resume is verified.
                </p>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: '#F3E8FF', border: '1px solid #E9D5FF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13, color: '#7C3AED' }}>
                  <span>Goldman Sachs OA (120m)</span>
                  <span>Aug 28 (5 Days)</span>
                </div>
                <p style={{ fontSize: 12, color: '#581C87', margin: '4px 0 0' }}>
                  Proctored HackerRank test: 2 Coding Problems (Trees + DP) + 10 CS Core MCQs.
                </p>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13, color: '#059669' }}>
                  <span>Mock STAR Interview Round</span>
                  <span>Aug 30 (7 Days)</span>
                </div>
                <p style={{ fontSize: 12, color: '#064E3B', margin: '4px 0 0' }}>
                  AI speech-evaluation & system design drill with instant feedback report.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: APPLICATION PIPELINE TRACKER ---------------- */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            {
              stage: 'Applied (5)',
              color: '#3B82F6',
              items: ['Google SDE Intern', 'Razorpay Backend', 'Zepto SDE'],
            },
            {
              stage: 'Shortlisted (2)',
              color: '#F59E0B',
              items: ['Goldman Sachs Summer Analyst', 'Microsoft SDE Campus'],
            },
            {
              stage: 'Online Assessment (1)',
              color: '#8B5CF6',
              items: ['Goldman Sachs HackerRank OA (Aug 28)'],
            },
            {
              stage: 'Interview Scheduled (0)',
              color: '#10B981',
              items: ['No active rounds scheduled yet'],
            },
          ].map((col, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 14, color: col.color }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                <span>{col.stage}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.items.map((item, i) => (
                  <div key={i} style={{ padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12.5, fontWeight: 700, color: '#1E293B' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Drive Syllabus Detail Modal ---------------- */}
      {selectedDrive && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building size={20} color="#4F46E5" />
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>{selectedDrive.company} Hiring Syllabus</h3>
              </div>
              <button onClick={() => setSelectedDrive(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <strong>Role:</strong> {selectedDrive.role} ({selectedDrive.type})
              </div>
              <div>
                <strong>Key Test Topics:</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                  <li>Binary Trees, Segment Trees & Graphs BFS/DFS</li>
                  <li>Database Indexing (B+ Trees) & 2-Phase Locking</li>
                  <li>System Design: Load Balancers & Caching Invalidation</li>
                </ul>
              </div>
              <div style={{ background: '#F5F7FF', padding: 12, borderRadius: 10, border: '1px solid #E0E7FF', color: '#4F46E5', fontWeight: 700 }}>
                💡 Your ATS Resume Match Score for this role is <strong>{selectedDrive.matchScore}%</strong>.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelectedDrive(null)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => handleApply(selectedDrive)}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
              >
                Apply with Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesView;
