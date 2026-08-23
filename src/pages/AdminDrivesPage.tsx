import React, { useState } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  Award,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Send,
  Eye,
} from 'lucide-react';

interface CampusDrive {
  id: string;
  companyName: string;
  role: string;
  tier: 'super' | 'dream' | 'growth';
  tierLabel: string;
  ctc: string;
  cgpaCutoff: string;
  branches: string;
  stage: string;
  stageColor: string;
  registeredCount: number;
  oaDate: string;
  location: string;
}

export const AdminDrivesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'reg' | 'oa' | 'interview' | 'offers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRosterDrive, setSelectedRosterDrive] = useState<CampusDrive | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Drive Form
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newTier, setNewTier] = useState<'super' | 'dream' | 'growth'>('super');
  const [newCtc, setNewCtc] = useState('');
  const [newCutoff, setNewCutoff] = useState('8.00');

  const [drives, setDrives] = useState<CampusDrive[]>([
    {
      id: 'd1',
      companyName: 'Google',
      role: 'Software Engineering Summer Intern 2026',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      ctc: '₹1,75,000 / mo (₹52.0 LPA PPO)',
      cgpaCutoff: '>= 8.50 CGPA (Zero Backlogs)',
      branches: 'CSE, IT, AI & ML, Data Science',
      stage: 'Registration Closing in 48 Hours',
      stageColor: '#DC2626',
      registeredCount: 320,
      oaDate: 'Aug 25, 2026',
      location: 'Bengaluru / Hyderabad',
    },
    {
      id: 'd2',
      companyName: 'Goldman Sachs',
      role: 'Summer Analyst 2026 - Engineering Division',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      ctc: '₹1,50,000 / mo (₹38.0 LPA PPO)',
      cgpaCutoff: '>= 8.00 CGPA',
      branches: 'All B.Tech & Dual Degree Circuital',
      stage: 'HackerRank OA Exam Scheduled (Aug 28)',
      stageColor: '#4F46E5',
      registeredCount: 280,
      oaDate: 'Aug 28, 2026 (6:00 PM)',
      location: 'Bengaluru / Hyderabad',
    },
    {
      id: 'd3',
      companyName: 'Razorpay',
      role: 'Product Engineering Intern (Backend & Payments)',
      tier: 'dream',
      tierLabel: 'Tier-1 Dream',
      ctc: '₹80,000 / mo (₹26.0 LPA PPO)',
      cgpaCutoff: '>= 7.50 CGPA',
      branches: 'CSE, IT, ECE',
      stage: 'Coding Assessment on Sep 02',
      stageColor: '#2563EB',
      registeredCount: 210,
      oaDate: 'Sep 02, 2026',
      location: 'Bengaluru',
    },
    {
      id: 'd4',
      companyName: 'Microsoft',
      role: 'Software Development Engineer (Full-Time 2026)',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      ctc: '₹36.0 - ₹44.0 LPA',
      cgpaCutoff: '>= 8.00 CGPA',
      branches: 'All Engineering Disciplines',
      stage: 'Pre-Placement Talk (PPT) on Sep 05',
      stageColor: '#D97706',
      registeredCount: 410,
      oaDate: 'Sep 10, 2026',
      location: 'Hyderabad / Noida',
    },
    {
      id: 'd5',
      companyName: 'Zepto',
      role: 'Backend SDE - Fast Commerce Supply Chain',
      tier: 'growth',
      tierLabel: 'High-Growth Tech',
      ctc: '₹24.0 - ₹28.0 LPA',
      cgpaCutoff: '>= 7.00 CGPA',
      branches: 'CSE, IT, ECE, EEE',
      stage: 'Technical Interviews Ongoing',
      stageColor: '#059669',
      registeredCount: 180,
      oaDate: 'Sep 08, 2026',
      location: 'Bengaluru / Mumbai',
    },
    {
      id: 'd6',
      companyName: 'Amazon',
      role: 'Software Development Engineer Intern',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      ctc: '₹1,40,000 / mo (₹45.0 LPA PPO)',
      cgpaCutoff: '>= 8.00 CGPA',
      branches: 'CSE, IT, AI & ML, ECE',
      stage: 'Online Assessment Stage Active',
      stageColor: '#7C3AED',
      registeredCount: 340,
      oaDate: 'Sep 12, 2026',
      location: 'Hyderabad / Chennai',
    },
  ]);

  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const created: CampusDrive = {
      id: `d-${Date.now()}`,
      companyName: newCompany,
      role: newRole,
      tier: newTier,
      tierLabel: newTier === 'super' ? 'Tier-1 Super Dream' : newTier === 'dream' ? 'Tier-1 Dream' : 'High-Growth Tech',
      ctc: newCtc || '₹20.0 LPA CTC',
      cgpaCutoff: `>= ${newCutoff} CGPA`,
      branches: 'CSE, IT, AI & ML, ECE',
      stage: 'Registration Just Opened',
      stageColor: '#059669',
      registeredCount: 0,
      oaDate: 'TBA',
      location: 'Bengaluru / Remote',
    };

    setDrives([created, ...drives]);
    setShowAddModal(false);
    setNewCompany('');
    setNewRole('');
    setNewCtc('');
    setToastMessage(`✓ ${newCompany} campus recruitment drive successfully scheduled & broadcasted!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ctc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="drives-page-container">
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
      <section className="drives-header-card" aria-label="Campus Placement Drives Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Building2 size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Campus Placement Drives & Recruiter Hub
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Coordinate visiting recruiter schedules, manage applicant eligibility gates, and monitor online assessment stages.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowAddModal(true)}
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
            <span>Onboard New Recruiter Drive</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="drives-stats-grid">
        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Active Registered Recruiters</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>38 Companies</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>Google, Goldman, Amazon, MSFT</div>
        </div>

        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Verified Applicants</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>1,420 Students</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>88.75% Batch Verification</div>
        </div>

        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Placement Offers Extended</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>142 Offers</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>₹18.4 LPA Avg CTC (High: ₹52L)</div>
        </div>

        <div className="drives-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Hiring Sprints This Week</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>4 Active Rounds</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>Google & Goldman Sachs OA</div>
        </div>
      </div>

      {/* ---------------- Search & Filter Bar ---------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div className="drives-filter-tabs" style={{ border: 'none', padding: 0 }}>
          {[
            { id: 'all', label: 'All Drives (38)' },
            { id: 'reg', label: 'Registration Open (6)' },
            { id: 'oa', label: 'OA Exam Stage (4)' },
            { id: 'interview', label: 'Interviews (3)' },
            { id: 'offers', label: 'Offers Extended (12)' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`drives-tab-btn ${activeFilter === tab.id ? 'active' : 'inactive'}`}
              onClick={() => setActiveFilter(tab.id as any)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search company, CTC, role..."
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

      {/* ---------------- Drives Grid ---------------- */}
      <div className="drives-grid">
        {filteredDrives.map((d) => (
          <article key={d.id} className="drives-card">
            {/* Card Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>{d.companyName}</h2>
                  <span
                    className={`drives-tier-badge ${
                      d.tier === 'super' ? 'super' : d.tier === 'dream' ? 'dream' : 'growth'
                    }`}
                  >
                    {d.tierLabel}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#4F46E5' }}>{d.role}</div>
              </div>
            </div>

            {/* CTC & Criteria */}
            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Package / CTC:</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#059669' }}>{d.ctc}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Eligibility Cutoff:</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>{d.cgpaCutoff}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Eligible Depts:</span>
                <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>{d.branches}</span>
              </div>
            </div>

            {/* Stage Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: d.stageColor }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.stageColor }} />
                <span>{d.stage}</span>
              </div>
              <span style={{ color: '#64748B', fontWeight: 700 }}>{d.registeredCount} Applied</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
              <button
                onClick={() => setSelectedRosterDrive(d)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  color: '#4F46E5',
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Users size={14} />
                <span>View Applicants ({d.registeredCount})</span>
              </button>

              <button
                onClick={() => alert(`Dispatching recruiter webhook synchronization for ${d.companyName}...`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Recruiter Portal Sync"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ---------------- View Applicants Roster Modal ---------------- */}
      {selectedRosterDrive && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {selectedRosterDrive.companyName} • Registered Applicants Roster
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  {selectedRosterDrive.role} ({selectedRosterDrive.registeredCount} Verified Candidates)
                </span>
              </div>
              <button onClick={() => setSelectedRosterDrive(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
              {[
                { name: 'Alex Chen', roll: '23BCE1042', cgpa: '8.90', ats: '91%', readiness: '78%', status: 'Shortlisted for OA' },
                { name: 'Priya Sharma', roll: '23BCE1189', cgpa: '9.32', ats: '95%', readiness: '89%', status: 'Shortlisted for OA' },
                { name: 'Rohan Iyer', roll: '23BCE1402', cgpa: '8.45', ats: '86%', readiness: '74%', status: 'Under Review' },
                { name: 'Neha Gupta', roll: '23BCE1670', cgpa: '9.10', ats: '92%', readiness: '84%', status: 'Shortlisted for OA' },
              ].map((st, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13 }}>{st.name} ({st.roll})</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>CGPA: {st.cgpa} • ATS: {st.ats} • Readiness: {st.readiness}</div>
                  </div>
                  <span style={{ background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 800 }}>
                    {st.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelectedRosterDrive(null)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close Roster
              </button>
              <button
                onClick={() => {
                  alert(`Exporting official CSV applicant roster for ${selectedRosterDrive.companyName}...`);
                  setSelectedRosterDrive(null);
                }}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <FileSpreadsheet size={14} />
                <span>Export Candidate CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Onboard New Campus Recruiter Modal ---------------- */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building2 size={22} color="#4F46E5" />
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Onboard Visiting Campus Recruiter
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleAddDrive} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uber / D.E. Shaw / Atlassian..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Role & Track
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer (Backend / Distributed Systems)..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Placement Tier
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                  >
                    <option value="super">Tier-1 Super Dream (&gt; ₹30 LPA)</option>
                    <option value="dream">Tier-1 Dream (₹15 - 30 LPA)</option>
                    <option value="growth">High-Growth Tech</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Offered CTC / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1.25L/mo or ₹32 LPA"
                    value={newCtc}
                    onChange={(e) => setNewCtc(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Minimum CGPA Cutoff
                </label>
                <input
                  type="text"
                  value={newCutoff}
                  onChange={(e) => setNewCutoff(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={14} />
                  <span>Publish & Open Applications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrivesPage;
