import React, { useState } from 'react';
import {
  Briefcase,
  CalendarCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Paperclip,
  X,
  FileSpreadsheet,
  Check,
  Ban,
  Eye,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

interface OpportunityPosting {
  id: string;
  companyName: string;
  role: string;
  type: 'Summer Internship 2026' | 'Full-Time SDE (PPO)' | '6-Month Product Track';
  tier: 'super' | 'dream' | 'growth';
  tierLabel: string;
  compensation: string;
  cgpaCutoff: string;
  eligibleBranches: string;
  deadline: string;
  daysRemaining: string;
  applicantsCount: number;
  status: 'published' | 'pending' | 'closed';
  statusLabel: string;
  postedDate: string;
}

export const AdminOpportunityManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'published' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityPosting | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Opportunity Form State
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newType, setNewType] = useState<'Summer Internship 2026' | 'Full-Time SDE (PPO)' | '6-Month Product Track'>('Summer Internship 2026');
  const [newTier, setNewTier] = useState<'super' | 'dream' | 'growth'>('super');
  const [newComp, setNewComp] = useState('');
  const [newCgpa, setNewCgpa] = useState('8.00');
  const [newDeadline, setNewDeadline] = useState('Aug 30, 2026');

  const [postings, setPostings] = useState<OpportunityPosting[]>([
    {
      id: 'op1',
      companyName: 'Google',
      role: 'Software Engineering Summer Intern 2026',
      type: 'Summer Internship 2026',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      compensation: '₹1,75,000 / mo (₹52.0 LPA PPO)',
      cgpaCutoff: '>= 8.50 CGPA • No Backlogs',
      eligibleBranches: 'CSE, IT, AI & ML, Data Science',
      deadline: 'Aug 25, 2026 (11:59 PM)',
      daysRemaining: '2 days left',
      applicantsCount: 320,
      status: 'published',
      statusLabel: 'Published & Live',
      postedDate: 'Aug 18, 2026',
    },
    {
      id: 'op2',
      companyName: 'Goldman Sachs',
      role: 'Summer Analyst 2026 - Engineering Division',
      type: 'Summer Internship 2026',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      compensation: '₹1,50,000 / mo (₹38.0 LPA PPO)',
      cgpaCutoff: '>= 8.00 CGPA',
      eligibleBranches: 'All Circuital Engineering Branches',
      deadline: 'Aug 26, 2026',
      daysRemaining: '3 days left',
      applicantsCount: 280,
      status: 'published',
      statusLabel: 'Published & Live',
      postedDate: 'Aug 15, 2026',
    },
    {
      id: 'op3',
      companyName: 'Uber',
      role: 'Software Engineer - Distributed Systems (Full-Time 2026)',
      type: 'Full-Time SDE (PPO)',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      compensation: '₹38.0 - ₹48.0 LPA',
      cgpaCutoff: '>= 8.00 CGPA',
      eligibleBranches: 'CSE, IT, AI & ML',
      deadline: 'Aug 29, 2026',
      daysRemaining: 'Pending Approval',
      applicantsCount: 0,
      status: 'pending',
      statusLabel: 'Pending TPO Approval',
      postedDate: 'Just now (Recruiter Submitted)',
    },
    {
      id: 'op4',
      companyName: 'Atlassian',
      role: 'Associate Software Engineer - Cloud Platform',
      type: 'Full-Time SDE (PPO)',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      compensation: '₹42.0 LPA CTC',
      cgpaCutoff: '>= 8.20 CGPA',
      eligibleBranches: 'CSE, IT',
      deadline: 'Sep 04, 2026',
      daysRemaining: 'Pending Approval',
      applicantsCount: 0,
      status: 'pending',
      statusLabel: 'Pending TPO Approval',
      postedDate: '2 hours ago (Recruiter Submitted)',
    },
    {
      id: 'op5',
      companyName: 'Razorpay',
      role: 'Product Engineering Intern (Backend & Payments)',
      type: '6-Month Product Track',
      tier: 'dream',
      tierLabel: 'Tier-1 Dream',
      compensation: '₹80,000 / mo (₹26.0 LPA PPO)',
      cgpaCutoff: '>= 7.50 CGPA',
      eligibleBranches: 'CSE, IT, ECE',
      deadline: 'Sep 01, 2026',
      daysRemaining: '9 days left',
      applicantsCount: 210,
      status: 'published',
      statusLabel: 'Published & Live',
      postedDate: 'Aug 20, 2026',
    },
    {
      id: 'op6',
      companyName: 'Microsoft',
      role: 'Software Development Engineer (Class of 2026)',
      type: 'Full-Time SDE (PPO)',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      compensation: '₹36.0 - ₹44.0 LPA',
      cgpaCutoff: '>= 8.00 CGPA',
      eligibleBranches: 'All Engineering Disciplines',
      deadline: 'Sep 05, 2026',
      daysRemaining: '13 days left',
      applicantsCount: 410,
      status: 'published',
      statusLabel: 'Published & Live',
      postedDate: 'Aug 12, 2026',
    },
  ]);

  const handleApprove = (id: string, company: string) => {
    setPostings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'published', statusLabel: 'Published & Live', daysRemaining: 'Open for Applications' } : p))
    );
    setToastMessage(`✓ Approved & Published ${company} recruitment drive to student portal!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreatePosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const created: OpportunityPosting = {
      id: `op-${Date.now()}`,
      companyName: newCompany,
      role: newRole,
      type: newType,
      tier: newTier,
      tierLabel: newTier === 'super' ? 'Tier-1 Super Dream' : newTier === 'dream' ? 'Tier-1 Dream' : 'High-Growth Tech',
      compensation: newComp || '₹20.0 LPA CTC',
      cgpaCutoff: `>= ${newCgpa} CGPA`,
      eligibleBranches: 'CSE, IT, AI & ML, ECE',
      deadline: newDeadline,
      daysRemaining: 'Open for Applications',
      applicantsCount: 0,
      status: 'published',
      statusLabel: 'Published & Live',
      postedDate: 'Just now',
    };

    setPostings([created, ...postings]);
    setShowCreateModal(false);
    setNewCompany('');
    setNewRole('');
    setNewComp('');
    setToastMessage(`✓ ${newCompany} opportunity successfully published across student portals!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredPostings = postings.filter((p) => {
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    const matchesSearch =
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.compensation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = postings.filter((p) => p.status === 'pending').length;

  return (
    <div className="opportunity-manager-container">
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
      <section className="opportunity-header-card" aria-label="Opportunity Manager Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CalendarCheck size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Opportunity Manager & Placement Drive Workflow
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Review, approve, publish, and manage visiting recruiter job descriptions and campus hiring opportunities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {pendingCount > 0 && (
            <button
              onClick={() => {
                setPostings((prev) =>
                  prev.map((p) => ({ ...p, status: 'published', statusLabel: 'Published & Live', daysRemaining: 'Open for Applications' }))
                );
                setToastMessage(`✓ Bulk approved ${pendingCount} pending recruiter job postings!`);
                setTimeout(() => setToastMessage(null), 3500);
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
              <Check size={16} />
              <span>Bulk Approve ({pendingCount} Pending)</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
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
            <span>Post New Opportunity</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="opportunity-stats-grid">
        <div className="opportunity-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Published Opportunities</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>28 Active Postings</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>Live on Student Portals</div>
        </div>

        <div className="opportunity-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Pending TPO Approvals</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>{pendingCount} Recruiter JDs</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>Action Required by Placement Cell</div>
        </div>

        <div className="opportunity-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Total Student Submissions</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>1,840 Applications</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>Across 2026 Batch Cohort</div>
        </div>

        <div className="opportunity-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Average Compensation</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>₹18.4 LPA CTC</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>Highest: ₹52.0 LPA (Google)</div>
        </div>
      </div>

      {/* ---------------- Filter & Search Bar ---------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Opportunities (32)' },
            { id: 'pending', label: `Pending TPO Review (${pendingCount})` },
            { id: 'published', label: 'Published & Active (22)' },
            { id: 'closed', label: 'Registration Closed (6)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: activeTab === tab.id ? '1.5px solid #4F46E5' : '1px solid #CBD5E1',
                background: activeTab === tab.id ? '#4F46E5' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search company, role, package..."
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

      {/* ---------------- Opportunity Management Table ---------------- */}
      <div className="opportunity-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="opportunity-table">
            <thead>
              <tr>
                <th>OPPORTUNITY & COMPANY</th>
                <th>TYPE & COMPENSATION</th>
                <th>ELIGIBILITY CRITERIA</th>
                <th>APPLICATION DEADLINE</th>
                <th>APPLICANTS</th>
                <th>STATUS</th>
                <th>TPO ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPostings.map((p) => (
                <tr key={p.id}>
                  {/* Opportunity & Company */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 14 }}>{p.companyName}</span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: p.tier === 'super' ? '#FDF4FF' : '#EEF2FF',
                            color: p.tier === 'super' ? '#A855F7' : '#4F46E5',
                            border: `1px solid ${p.tier === 'super' ? '#F0ABFC' : '#C7D2FE'}`,
                          }}
                        >
                          {p.tierLabel}
                        </span>
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#4F46E5' }}>{p.role}</span>
                    </div>
                  </td>

                  {/* Type & Compensation */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 900, color: '#059669', fontSize: 13 }}>{p.compensation}</span>
                      <span style={{ fontSize: 11.5, color: '#64748B' }}>{p.type}</span>
                    </div>
                  </td>

                  {/* Eligibility */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 800, color: '#1E293B', fontSize: 12 }}>{p.cgpaCutoff}</span>
                      <span style={{ fontSize: 11.5, color: '#64748B' }}>{p.eligibleBranches}</span>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 12 }}>{p.deadline}</span>
                      <span style={{ fontSize: 11, color: p.status === 'pending' ? '#D97706' : '#DC2626', fontWeight: 700 }}>
                        ⏱️ {p.daysRemaining}
                      </span>
                    </div>
                  </td>

                  {/* Applicants */}
                  <td>
                    <span style={{ fontWeight: 900, color: '#4F46E5', fontSize: 13 }}>
                      {p.applicantsCount} Applied
                    </span>
                  </td>

                  {/* Status Pill */}
                  <td>
                    <span
                      className={`opportunity-status-pill ${
                        p.status === 'published' ? 'published' : p.status === 'pending' ? 'pending' : 'closed'
                      }`}
                    >
                      {p.status === 'published' ? '🟢' : p.status === 'pending' ? '🟠' : '⚪'} {p.statusLabel}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.status === 'pending' ? (
                        <button
                          onClick={() => handleApprove(p.id, p.companyName)}
                          style={{
                            background: '#10B981',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 11.5,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Check size={13} />
                          <span>Approve & Post</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedOpportunity(p)}
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#4F46E5',
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Eye size={13} />
                          <span>Inspect JD</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Inspect Opportunity Modal ---------------- */}
      {selectedOpportunity && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {selectedOpportunity.companyName} • Job Opportunity Details
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  {selectedOpportunity.role} ({selectedOpportunity.tierLabel})
                </span>
              </div>
              <button onClick={() => setSelectedOpportunity(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Package / Compensation:</span>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#059669' }}>{selectedOpportunity.compensation}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Application Deadline:</span>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{selectedOpportunity.deadline}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Eligibility Cutoff:</span>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1E293B' }}>{selectedOpportunity.cgpaCutoff}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Eligible Disciplines:</span>
                  <div style={{ fontSize: 12, color: '#475569' }}>{selectedOpportunity.eligibleBranches}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelectedOpportunity(null)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close View
              </button>
              <button
                onClick={() => {
                  alert(`Exporting candidate roster for ${selectedOpportunity.companyName}...`);
                  setSelectedOpportunity(null);
                }}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <FileSpreadsheet size={14} />
                <span>Export Applicant Roster</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Create Opportunity Modal ---------------- */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarCheck size={22} color="#4F46E5" />
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Post Campus Opportunity
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleCreatePosting} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adobe / NVIDIA / Morgan Stanley..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Job Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer (Cloud Platform)..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Opportunity Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                  >
                    <option value="Summer Internship 2026">Summer Internship 2026</option>
                    <option value="Full-Time SDE (PPO)">Full-Time SDE (PPO)</option>
                    <option value="6-Month Product Track">6-Month Product Track</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Offered CTC / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1.5L/mo or ₹36 LPA"
                    value={newComp}
                    onChange={(e) => setNewComp(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="text"
                    value={newCgpa}
                    onChange={(e) => setNewCgpa(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Application Deadline
                  </label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={14} />
                  <span>Publish to Student Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOpportunityManagerPage;
