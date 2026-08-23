import React, { useState } from 'react';
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [searchStudent, setSearchStudent] = useState('');

  const students = [
    {
      id: 'st1',
      name: 'Alex Chen',
      rollNo: '23BCE1042',
      dept: 'CSE Core (3rd Yr)',
      cgpa: '8.90',
      readiness: 78,
      atsScore: 91,
      shortlisted: 'Goldman Sachs, Google',
      status: 'Ready for OA',
    },
    {
      id: 'st2',
      name: 'Priya Sharma',
      rollNo: '23BCE1189',
      dept: 'CSE (AI & ML)',
      cgpa: '9.32',
      readiness: 89,
      atsScore: 95,
      shortlisted: 'Google, Microsoft, Amazon',
      status: 'Interview Scheduled',
    },
    {
      id: 'st3',
      name: 'Rohan Iyer',
      rollNo: '23BCE1402',
      dept: 'Information Technology',
      cgpa: '8.45',
      readiness: 74,
      atsScore: 86,
      shortlisted: 'Razorpay, Zepto',
      status: 'Ready for OA',
    },
    {
      id: 'st4',
      name: 'Neha Gupta',
      rollNo: '23BCE1670',
      dept: 'CSE Core (3rd Yr)',
      cgpa: '9.10',
      readiness: 84,
      atsScore: 92,
      shortlisted: 'Goldman Sachs, Uber',
      status: 'Shortlisted',
    },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ---------------- Top Banner ---------------- */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #1E293B 100%)',
          borderRadius: 20,
          padding: '28px 32px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Sparkles size={22} color="#FBBF24" />
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Campus Placement Command Center
            </h2>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Cohort 2026 / 2027 Engineering Placement Velocity & AI Telemetry Roster
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => alert('Exporting full batch placement report to CSV...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* ---------------- 4 Key Metric Stat Cards ---------------- */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Placement-Eligible Cohort</span>
            <Users size={18} color="#4F46E5" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>1,420 / 1,600</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>88.75% Verification Rate ✓</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Registered Companies</span>
            <Building2 size={18} color="#3B82F6" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>38 Companies</div>
          <div style={{ fontSize: 12, color: '#2563EB', fontWeight: 700 }}>Google, Goldman, Microsoft, Zepto</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Average Batch CTC</span>
            <TrendingUp size={18} color="#059669" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>₹18.4 LPA</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Highest Offer: ₹52.0 LPA (Google)</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Batch Readiness Score</span>
            <Award size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>78% Avg</div>
          <div style={{ fontSize: 12, color: '#D97706', fontWeight: 700 }}>+12% Gain post-AI Calibration</div>
        </div>
      </div>

      {/* ---------------- Active Drives Schedule & Batch Analytics ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Drives Progress */}
        <div className="admin-table-card">
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', marginBottom: 14 }}>
            Upcoming Campus Drive Schedule
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { company: 'Google SDE Intern', date: 'Aug 25, 2026', applicants: 320, ctc: '₹1.75L/mo', status: 'Registration Closing' },
              { company: 'Goldman Sachs Summer Analyst', date: 'Aug 28, 2026', applicants: 280, ctc: '₹1.50L/mo', status: 'OA Exam Scheduled' },
              { company: 'Razorpay Backend Intern', date: 'Sep 02, 2026', applicants: 210, ctc: '₹80K/mo', status: 'Applications Open' },
              { company: 'Microsoft SDE Campus', date: 'Sep 10, 2026', applicants: 410, ctc: '₹36 - 44 LPA', status: 'PPT Scheduled' },
            ].map((drive, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5 }}>{drive.company}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{drive.date} • {drive.applicants} Registered Applicants</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#059669' }}>{drive.ctc}</span>
                  <div style={{ fontSize: 11, color: '#4F46E5', fontWeight: 700 }}>{drive.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Telemetry */}
        <div className="admin-table-card">
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', marginBottom: 14 }}>
            Batch Skill Mastery & Gap Analysis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { topic: 'DSA: Trees, Graphs & Dynamic Programming', avg: 82, color: '#4F46E5' },
              { topic: 'CS Core: Operating Systems & Virtual Memory', avg: 74, color: '#3B82F6' },
              { topic: 'CS Core: DBMS B+ Trees & 2-Phase Locking', avg: 68, color: '#F59E0B' },
              { topic: 'STAR Behavioral & Video Communication', avg: 80, color: '#10B981' },
            ].map((topic, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                  <span>{topic.topic}</span>
                  <span style={{ color: topic.color }}>{topic.avg}%</span>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${topic.avg}%`, height: '100%', background: topic.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Student Cohort Table ---------------- */}
      <div className="admin-table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Live Student Cohort Readiness Roster (Top Candidates)
            </h3>
            <span style={{ fontSize: 12.5, color: '#64748B' }}>
              Real-time synchronization with student practice telemetry & ATS verified scores.
            </span>
          </div>

          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search candidate name or roll number..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                padding: '0 14px 0 36px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 12.5,
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>ROLL NUMBER</th>
                <th>DEPARTMENT</th>
                <th>CGPA</th>
                <th>READINESS</th>
                <th>ATS SCORE</th>
                <th>SHORTLISTED DRIVES</th>
                <th>PLACEMENT STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => (
                <tr key={st.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{st.name}</td>
                  <td>{st.rollNo}</td>
                  <td>{st.dept}</td>
                  <td style={{ fontWeight: 700 }}>{st.cgpa}</td>
                  <td>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                      {st.readiness}%
                    </span>
                  </td>
                  <td>
                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                      {st.atsScore}%
                    </span>
                  </td>
                  <td style={{ color: '#475569', fontSize: 12 }}>{st.shortlisted}</td>
                  <td>
                    <span style={{ background: '#F1F5F9', color: '#334155', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700 }}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
