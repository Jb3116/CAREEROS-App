import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  Award,
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  FileSpreadsheet,
  MapPin,
} from 'lucide-react';

interface CompanyPartner {
  id: string;
  name: string;
  sector: string;
  tier: 'super' | 'dream' | 'growth';
  tierLabel: string;
  headquarters: string;
  historicalHires: number;
  avgCompensation: string;
  mouStatus: string;
  mouActive: boolean;
  hrPocName: string;
  hrPocRole: string;
  hrPocEmail: string;
  hrPocPhone: string;
  nextDriveDate: string;
}

export const AdminCompaniesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'super' | 'dream' | 'growth' | 'mou'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<CompanyPartner | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Company Form
  const [newName, setNewName] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newTier, setNewTier] = useState<'super' | 'dream' | 'growth'>('super');
  const [newHrName, setNewHrName] = useState('');
  const [newHrEmail, setNewHrEmail] = useState('');
  const [newAvgCtc, setNewAvgCtc] = useState('');

  const [partners, setPartners] = useState<CompanyPartner[]>([
    {
      id: 'c1',
      name: 'Google',
      sector: 'Big Tech & Cloud Infrastructure',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      headquarters: 'Mountain View, CA / Bengaluru HQ',
      historicalHires: 42,
      avgCompensation: '₹1,75,000 / mo (₹52.0 LPA PPO)',
      mouStatus: 'Multi-Year Signed (2024 - 2027)',
      mouActive: true,
      hrPocName: 'Sarah Jenkins',
      hrPocRole: 'University Programs Lead (APAC)',
      hrPocEmail: 's.jenkins@google.com',
      hrPocPhone: '+1 (650) 253-0000',
      nextDriveDate: 'Aug 25, 2026',
    },
    {
      id: 'c2',
      name: 'Goldman Sachs',
      sector: 'Global Investment Banking & FinTech',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      headquarters: 'New York, NY / Hyderabad HQ',
      historicalHires: 38,
      avgCompensation: '₹1,50,000 / mo (₹38.0 LPA PPO)',
      mouStatus: 'Multi-Year Signed (2023 - 2026)',
      mouActive: true,
      hrPocName: 'David Verma',
      hrPocRole: 'VP, Campus Recruiting & Talent',
      hrPocEmail: 'david.verma@gs.com',
      hrPocPhone: '+91 80 4127-1000',
      nextDriveDate: 'Aug 28, 2026',
    },
    {
      id: 'c3',
      name: 'Microsoft',
      sector: 'Cloud, Enterprise Software & AI',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      headquarters: 'Redmond, WA / Hyderabad HQ',
      historicalHires: 56,
      avgCompensation: '₹36.0 - ₹44.0 LPA',
      mouStatus: 'Multi-Year Signed (2024 - 2028)',
      mouActive: true,
      hrPocName: 'Ananya Rao',
      hrPocRole: 'Lead University Talent Partner',
      hrPocEmail: 'ananya.rao@microsoft.com',
      hrPocPhone: '+91 40 6695-0000',
      nextDriveDate: 'Sep 05, 2026',
    },
    {
      id: 'c4',
      name: 'Razorpay',
      sector: 'FinTech & Payment Infrastructure',
      tier: 'dream',
      tierLabel: 'Tier-1 Dream',
      headquarters: 'Bengaluru, India',
      historicalHires: 24,
      avgCompensation: '₹80,000 / mo (₹26.0 LPA PPO)',
      mouStatus: 'Active MoU Partner (2025 - 2026)',
      mouActive: true,
      hrPocName: 'Vikram Malhotra',
      hrPocRole: 'Head of Engineering Talent',
      hrPocEmail: 'vikram.m@razorpay.com',
      hrPocPhone: '+91 80 6790-2000',
      nextDriveDate: 'Sep 02, 2026',
    },
    {
      id: 'c5',
      name: 'Zepto',
      sector: 'Quick Commerce & AI Logistics',
      tier: 'growth',
      tierLabel: 'High-Growth Tech',
      headquarters: 'Mumbai / Bengaluru, India',
      historicalHires: 18,
      avgCompensation: '₹24.0 - ₹28.0 LPA',
      mouStatus: 'Active MoU Partner (2025 - 2027)',
      mouActive: true,
      hrPocName: 'Pooja Nair',
      hrPocRole: 'Campus Hiring Lead',
      hrPocEmail: 'pooja.nair@zeptonow.com',
      hrPocPhone: '+91 22 4890-5000',
      nextDriveDate: 'Sep 08, 2026',
    },
    {
      id: 'c6',
      name: 'Amazon',
      sector: 'E-Commerce & AWS Cloud Infrastructure',
      tier: 'super',
      tierLabel: 'Tier-1 Super Dream',
      headquarters: 'Seattle, WA / Hyderabad HQ',
      historicalHires: 64,
      avgCompensation: '₹1,40,000 / mo (₹45.0 LPA PPO)',
      mouStatus: 'Multi-Year Signed (2023 - 2027)',
      mouActive: true,
      hrPocName: 'Rahul Deshmukh',
      hrPocRole: 'Senior Student Programs Manager',
      hrPocEmail: 'r.deshmukh@amazon.com',
      hrPocPhone: '+91 40 6789-0000',
      nextDriveDate: 'Sep 12, 2026',
    },
  ]);

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSector.trim()) return;

    const created: CompanyPartner = {
      id: `c-${Date.now()}`,
      name: newName,
      sector: newSector,
      tier: newTier,
      tierLabel: newTier === 'super' ? 'Tier-1 Super Dream' : newTier === 'dream' ? 'Tier-1 Dream' : 'High-Growth Tech',
      headquarters: 'Bengaluru / India HQ',
      historicalHires: 0,
      avgCompensation: newAvgCtc || '₹22.0 LPA CTC',
      mouStatus: 'Signed 2026 MoU (Active)',
      mouActive: true,
      hrPocName: newHrName || 'Recruiting Team',
      hrPocRole: 'University Talent POC',
      hrPocEmail: newHrEmail || 'talent@company.com',
      hrPocPhone: '+91 80 0000-0000',
      nextDriveDate: 'Upcoming 2026',
    };

    setPartners([created, ...partners]);
    setShowAddModal(false);
    setNewName('');
    setNewSector('');
    setNewHrName('');
    setNewHrEmail('');
    setNewAvgCtc('');
    setToastMessage(`✓ ${newName} registered as an official institutional hiring partner!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredPartners = partners.filter((p) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'mou' && p.mouActive) ||
      p.tier === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hrPocName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="companies-page-container">
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
      <section className="companies-header-card" aria-label="Company Registry Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Building2 size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Institutional Company Registry & Corporate Directory
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Manage campus recruiter relationships, MoU contracts, historical hiring quotas, and HR POC direct lines.
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
            <span>Register Corporate Partner</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="companies-stats-grid">
        <div className="companies-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Registered Partners</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>38 Companies</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>100% Verified Corporate Entities</div>
        </div>

        <div className="companies-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Signed Placement MoUs</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>29 Active Agreements</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>Multi-Year Priority Hiring</div>
        </div>

        <div className="companies-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Historical Alumni Hires</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>540 Alumni</div>
          <div style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>Across Global Engineering Offices</div>
        </div>

        <div className="companies-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Benchmark Compensation</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>₹18.4 LPA Avg</div>
          <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 700 }}>Peak: ₹52.0 LPA (Google SWE)</div>
        </div>
      </div>

      {/* ---------------- Search & Filter Bar ---------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Partners (38)' },
            { id: 'super', label: 'Tier-1 Super Dream (14)' },
            { id: 'dream', label: 'Tier-1 Dream (12)' },
            { id: 'growth', label: 'High-Growth Tech (8)' },
            { id: 'mou', label: 'Active MoUs (29)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: activeTab === t.id ? '1.5px solid #4F46E5' : '1px solid #CBD5E1',
                background: activeTab === t.id ? '#4F46E5' : '#FFFFFF',
                color: activeTab === t.id ? '#FFFFFF' : '#475569',
                boxShadow: activeTab === t.id ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search company, sector, POC..."
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

      {/* ---------------- Partner Grid ---------------- */}
      <div className="companies-grid">
        {filteredPartners.map((p) => (
          <article key={p.id} className="companies-card">
            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>{p.name}</h2>
                  <span
                    className={`companies-badge ${
                      p.tier === 'super' ? 'super' : p.tier === 'dream' ? 'dream' : 'growth'
                    }`}
                  >
                    {p.tierLabel}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{p.sector}</div>
              </div>

              <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: 999, fontWeight: 800 }}>
                {p.mouStatus}
              </span>
            </div>

            {/* Compensation & Stats Box */}
            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Benchmark Compensation:</span>
                <span style={{ fontSize: 12.5, fontWeight: 900, color: '#059669' }}>{p.avgCompensation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Historical Campus Hires:</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>{p.historicalHires} Alumni</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>Primary HR POC:</span>
                <span style={{ fontSize: 11.5, color: '#4F46E5', fontWeight: 700 }}>{p.hrPocName} ({p.hrPocRole})</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
              <button
                onClick={() => setSelectedPartner(p)}
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
                <Briefcase size={14} />
                <span>Company Dossier & POC</span>
              </button>

              <button
                onClick={() => alert(`Launching direct recruiter communication terminal for ${p.name}...`)}
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

      {/* ---------------- Partner Dossier Modal ---------------- */}
      {selectedPartner && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {selectedPartner.name} • Corporate Dossier
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  {selectedPartner.sector} • {selectedPartner.headquarters}
                </span>
              </div>
              <button onClick={() => setSelectedPartner(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Recruiter POC Contact Card */}
            <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 800, color: '#4F46E5', fontSize: 13, marginBottom: 6 }}>
                Primary Institutional Campus Talent Lead:
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#1E1B4B' }}>{selectedPartner.hrPocName}</div>
              <div style={{ fontSize: 12, color: '#4338CA', marginBottom: 8 }}>{selectedPartner.hrPocRole}</div>

              <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#334155', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={13} color="#4F46E5" /> {selectedPartner.hrPocEmail}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={13} color="#059669" /> {selectedPartner.hrPocPhone}
                </span>
              </div>
            </div>

            {/* Historical Placement Performance */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, fontSize: 12.5, color: '#334155' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>MoU Terms & Hiring Quotas:</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', lineHeight: 1.6 }}>
                <li>Agreement: <strong>{selectedPartner.mouStatus}</strong></li>
                <li>Cumulative Alumni Placed: <strong>{selectedPartner.historicalHires} Candidates</strong></li>
                <li>Compensation Benchmark: <strong>{selectedPartner.avgCompensation}</strong></li>
                <li>Next Campus Sprint: <strong>{selectedPartner.nextDriveDate}</strong></li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelectedPartner(null)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  window.location.href = `mailto:${selectedPartner.hrPocEmail}?subject=CAREEROS Campus Recruitment Schedule - VIT`;
                }}
                style={{ padding: '8px 18px', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Mail size={14} />
                <span>Contact Recruiter POC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Register Partner Modal ---------------- */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building2 size={22} color="#4F46E5" />
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Register Corporate Partner
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adobe / NVIDIA / Morgan Stanley..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GPU Computing & AI..."
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                    required
                  />
                </div>

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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    HR POC Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Nambiar"
                    value={newHrName}
                    onChange={(e) => setNewHrName(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    HR Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. p.nambiar@nvidia.com"
                    value={newHrEmail}
                    onChange={(e) => setNewHrEmail(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Expected Benchmark CTC / Stipend
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹1.5L/mo or ₹36 LPA"
                  value={newAvgCtc}
                  onChange={(e) => setNewAvgCtc(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
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
                  <span>Register Partner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompaniesPage;
