import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Send,
  Eye,
  GraduationCap,
  Award,
  ShieldCheck,
  TrendingUp,
  FileText,
  Mic,
  BrainCircuit,
} from 'lucide-react';

interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  dept: string;
  cgpa: string;
  atsScore: number;
  readinessScore: number;
  starScore: number;
  shortlistedDrives: string[];
  status: 'Shortlisted for OA' | 'Interview Scheduled' | 'Placed (Dream Offer)' | 'Under Review';
  statusColor: string;
  email: string;
  activeBacklogs: number;
}

export const AdminStudentsPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 'st1',
      name: 'Alex Chen',
      rollNo: '23BCE1042',
      dept: 'Computer Science & Engineering',
      cgpa: '8.90',
      atsScore: 91,
      readinessScore: 78,
      starScore: 88,
      shortlistedDrives: ['Goldman Sachs', 'Google SDE Intern'],
      status: 'Shortlisted for OA',
      statusColor: '#4F46E5',
      email: 'alex.chen@vit.edu',
      activeBacklogs: 0,
    },
    {
      id: 'st2',
      name: 'Priya Sharma',
      rollNo: '23BCE1189',
      dept: 'CSE (AI & Machine Learning)',
      cgpa: '9.32',
      atsScore: 95,
      readinessScore: 89,
      starScore: 92,
      shortlistedDrives: ['Google SDE Intern', 'Microsoft', 'Amazon'],
      status: 'Interview Scheduled',
      statusColor: '#059669',
      email: 'priya.sharma@vit.edu',
      activeBacklogs: 0,
    },
    {
      id: 'st3',
      name: 'Rohan Iyer',
      rollNo: '23BCE1402',
      dept: 'Information Technology',
      cgpa: '8.45',
      atsScore: 86,
      readinessScore: 74,
      starScore: 80,
      shortlistedDrives: ['Razorpay', 'Zepto'],
      status: 'Shortlisted for OA',
      statusColor: '#2563EB',
      email: 'rohan.iyer@vit.edu',
      activeBacklogs: 0,
    },
    {
      id: 'st4',
      name: 'Neha Gupta',
      rollNo: '23BCE1670',
      dept: 'Computer Science & Engineering',
      cgpa: '9.10',
      atsScore: 92,
      readinessScore: 84,
      starScore: 86,
      shortlistedDrives: ['Goldman Sachs', 'Uber'],
      status: 'Placed (Dream Offer)',
      statusColor: '#7C3AED',
      email: 'neha.gupta@vit.edu',
      activeBacklogs: 0,
    },
    {
      id: 'st5',
      name: 'Karan Patel',
      rollNo: '23BCE1891',
      dept: 'Electronics & Communication',
      cgpa: '8.12',
      atsScore: 84,
      readinessScore: 68,
      starScore: 75,
      shortlistedDrives: ['Zepto Supply Chain'],
      status: 'Under Review',
      statusColor: '#D97706',
      email: 'karan.patel@vit.edu',
      activeBacklogs: 0,
    },
  ]);

  const filteredStudents = students.filter((st) => {
    const matchesDept = selectedDept === 'all' || st.dept.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="students-page-container">
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
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------- Hero Header ---------------- */}
      <section className="students-header-card" aria-label="Student Cohort Roster Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Users size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Student Cohort Roster & Placement Telemetry
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Unified student candidate roster with live ATS resume scores, STAR interview evaluations, and drive shortlists.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              setToastMessage('✓ Exporting official verified batch candidate roster (CSV)...');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="students-stats-grid">
        <div className="students-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Total Registered Cohort</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>1,600 Students</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>100% Academic Profile Sync</div>
        </div>

        <div className="students-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Tier-1 Drive Eligible</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>1,420 Students</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>88.75% Verification Rate</div>
        </div>

        <div className="students-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Batch Placement Rate</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>142 Placed</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>₹18.4 LPA Avg CTC</div>
        </div>

        <div className="students-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Remediation Assigned</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>180 Students</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>AI Practice Sprint Active</div>
        </div>
      </div>

      {/* ---------------- Department Filters & Search ---------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Departments (1,600)' },
            { id: 'computer', label: 'CSE Core (620)' },
            { id: 'ai', label: 'AI & Data Science (380)' },
            { id: 'information', label: 'Information Tech (340)' },
            { id: 'electronics', label: 'ECE Circuital (260)' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDept(d.id)}
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: selectedDept === d.id ? '1.5px solid #4F46E5' : '1px solid #CBD5E1',
                background: selectedDept === d.id ? '#4F46E5' : '#FFFFFF',
                color: selectedDept === d.id ? '#FFFFFF' : '#475569',
                boxShadow: selectedDept === d.id ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search candidate, roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              padding: '0 14px 0 36px',
              borderRadius: 10,
              border: '1px solid #CBD5E1',
              fontSize: 13,
              fontWeight: 600,
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>
      </div>

      {/* ---------------- Student Table ---------------- */}
      <div className="students-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="students-table">
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>ROLL NUMBER</th>
                <th>DEPARTMENT</th>
                <th>CGPA</th>
                <th>ATS SCORE</th>
                <th>READINESS</th>
                <th>STAR SCORE</th>
                <th>SHORTLISTED DRIVES</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => (
                <tr key={st.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{st.name}</td>
                  <td>{st.rollNo}</td>
                  <td style={{ fontSize: 12 }}>{st.dept}</td>
                  <td style={{ fontWeight: 700 }}>{st.cgpa}</td>
                  <td>
                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                      {st.atsScore}%
                    </span>
                  </td>
                  <td>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                      {st.readinessScore}%
                    </span>
                  </td>
                  <td>
                    <span style={{ background: '#FFFBEB', color: '#D97706', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                      {st.starScore}%
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#475569' }}>{st.shortlistedDrives.join(', ')}</td>
                  <td>
                    <span
                      style={{
                        background: '#F1F5F9',
                        color: st.statusColor,
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 800,
                      }}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(st)}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#4F46E5',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Candidate Profile Inspector Modal ---------------- */}
      {selectedStudent && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {selectedStudent.name} • Candidate Telemetry
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  {selectedStudent.rollNo} • {selectedStudent.dept}
                </span>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Scores Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 12, background: '#EEF2FF', borderRadius: 10, textAlign: 'center', border: '1px solid #C7D2FE' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#4F46E5' }}>{selectedStudent.readinessScore}%</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4338CA' }}>Placement Readiness</div>
              </div>
              <div style={{ padding: 12, background: '#ECFDF5', borderRadius: 10, textAlign: 'center', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#059669' }}>{selectedStudent.atsScore}%</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#047857' }}>ATS Resume Score</div>
              </div>
              <div style={{ padding: 12, background: '#FFFBEB', borderRadius: 10, textAlign: 'center', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#D97706' }}>{selectedStudent.starScore}%</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309' }}>AI Mock STAR Score</div>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#334155' }}>
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Academic & Eligibility Telemetry:</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569' }}>
                  <li>CGPA: <strong>{selectedStudent.cgpa}</strong> (No standing backlogs)</li>
                  <li>Institutional Email: <strong>{selectedStudent.email}</strong></li>
                  <li>Verified Shortlisted Companies: <strong>{selectedStudent.shortlistedDrives.join(', ')}</strong></li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close Drawer
              </button>
              <button
                onClick={() => {
                  setToastMessage(`✓ Dispatched official TPO notification to ${selectedStudent.name}!`);
                  setSelectedStudent(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Send size={14} />
                <span>Send Direct TPO Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;
