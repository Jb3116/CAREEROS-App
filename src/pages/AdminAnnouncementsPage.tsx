import React, { useState } from 'react';
import {
  Megaphone,
  Bell,
  Search,
  Plus,
  Send,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Paperclip,
  X,
  Share2,
  Eye,
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  category: 'urgent' | 'shortlist' | 'ppt' | 'drive';
  categoryLabel: string;
  targetAudience: string;
  content: string;
  author: string;
  timestamp: string;
  readRate: string;
  deliveryChannels: string[];
  attachmentName?: string;
  attachmentSize?: string;
}

export const AdminAnnouncementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'shortlist' | 'ppt' | 'drive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Announcement Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'urgent' | 'shortlist' | 'ppt' | 'drive'>('urgent');
  const [newAudience, setNewAudience] = useState('All Batch 2026 Engineering Students (1,600)');
  const [newContent, setNewContent] = useState('');
  const [sendPush, setSendPush] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: 'a1',
      title: 'Google Software Engineering Summer Internship 2026 - Registration Deadline in 48 Hours',
      category: 'urgent',
      categoryLabel: '🚨 HIGH PRIORITY • ACTION REQUIRED',
      targetAudience: 'Batch 2026 CSE / IT • 1,420 Eligible Students',
      content:
        'All students meeting the >= 8.5 CGPA criteria are reminded that the Google Campus Portal registration window closes on Aug 25 at 11:59 PM. Ensure your ATS resume is verified and uploaded prior to the deadline.',
      author: 'Dr. R. K. Sharma (TPO)',
      timestamp: '2 hours ago',
      readRate: '96% Read (1,364 / 1,420)',
      deliveryChannels: ['Push App', 'Institutional Email', 'SMS'],
      attachmentName: 'Google_SWE_Intern_Campus_JD_2026.pdf',
      attachmentSize: '1.2 MB',
    },
    {
      id: 'a2',
      title: 'Goldman Sachs Summer Analyst 2026 - HackerRank OA Shortlist & Exam Schedule Released',
      category: 'shortlist',
      categoryLabel: '📝 SHORTLIST RELEASE',
      targetAudience: 'Shortlisted Candidates • 280 Students',
      content:
        'The official shortlist for the Goldman Sachs Online Assessment has been released. The 120-minute proctored test will take place on HackerRank this Thursday, Aug 28, from 6:00 PM to 8:00 PM.',
      author: 'Placement Directorate',
      timestamp: '6 hours ago',
      readRate: '99% Read (278 / 280)',
      deliveryChannels: ['Push App', 'Email'],
      attachmentName: 'GS_Shortlist_Batch2026_Final.pdf',
      attachmentSize: '840 KB',
    },
    {
      id: 'a3',
      title: 'Microsoft SDE Campus PPT & Tech Talk - In-Person Main Auditorium Session',
      category: 'ppt',
      categoryLabel: '🏛️ PRE-PLACEMENT TALK (PPT)',
      targetAudience: 'All 3rd Year B.Tech & M.Tech Students',
      content:
        'Senior Engineering Managers from the Microsoft Azure & Cloud AI team will be on campus this Friday, Sep 05, at 4:00 PM in the Main Auditorium. Q&A and spot technical review sessions included.',
      author: 'Corporate Relations Cell',
      timestamp: 'Yesterday',
      readRate: '84% Read (1,344 / 1,600)',
      deliveryChannels: ['Push App', 'Email'],
      attachmentName: 'Microsoft_Campus_Briefing_Schedule.pdf',
      attachmentSize: '450 KB',
    },
    {
      id: 'a4',
      title: 'Razorpay Product Engineering Internship - Applications Open for Cohort 2026',
      category: 'drive',
      categoryLabel: '💼 RECRUITMENT DRIVE',
      targetAudience: 'Full Stack & Backend Track Students',
      content:
        'Razorpay is inviting applications for their 6-month product engineering internship (Stipend: ₹80,000/mo). Online coding challenge scheduled for Sep 02. Minimum 7.5 CGPA required.',
      author: 'Placement Directorate',
      timestamp: '2 days ago',
      readRate: '91% Read (1,456 / 1,600)',
      deliveryChannels: ['Push App', 'Email', 'SMS'],
      attachmentName: 'Razorpay_Campus_Hiring_Guidelines.pdf',
      attachmentSize: '920 KB',
    },
  ]);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: AnnouncementItem = {
      id: `a-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      categoryLabel:
        newCategory === 'urgent'
          ? '🚨 HIGH PRIORITY • ACTION REQUIRED'
          : newCategory === 'shortlist'
          ? '📝 SHORTLIST RELEASE'
          : newCategory === 'ppt'
          ? '🏛️ PRE-PLACEMENT TALK (PPT)'
          : '💼 RECRUITMENT DRIVE',
      targetAudience: newAudience,
      content: newContent,
      author: 'Dr. R. K. Sharma (TPO)',
      timestamp: 'Just now',
      readRate: '0% Read (Dispatching...)',
      deliveryChannels: [
        ...(sendPush ? ['Push App'] : []),
        ...(sendEmail ? ['Institutional Email'] : []),
        ...(sendSms ? ['SMS'] : []),
      ],
    };

    setAnnouncements([created, ...announcements]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    setToastMessage('✓ Broadcast successfully dispatched across selected student channels!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="announce-page-container">
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
      <section className="announce-header-card" aria-label="Announcement Hub Header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Megaphone size={22} color="#FBBF24" />
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Campus Announcement Hub & Broadcast Dispatcher
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0 }}>
            Broadcast verified placement circulars, exam notifications, and shortlist alerts to <strong>1,600+ Batch of 2026 students</strong>.
          </p>
        </div>

        <div>
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
            <span>Create New Announcement</span>
          </button>
        </div>
      </section>

      {/* ---------------- 4 Stat Cards ---------------- */}
      <div className="announce-stats-grid">
        <div className="announce-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Total Circulars Dispatched</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>24 Broadcasts</div>
          <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>100% Delivery Reliability ✓</div>
        </div>

        <div className="announce-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Student Read Rate</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5' }}>98.4% Average</div>
          <div style={{ fontSize: 11.5, color: '#4338CA', fontWeight: 700 }}>1,574 Active Receivers</div>
        </div>

        <div className="announce-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Active Urgent Circulars</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626' }}>2 Urgent Drives</div>
          <div style={{ fontSize: 11.5, color: '#B91C1C', fontWeight: 700 }}>Google & Goldman Sachs</div>
        </div>

        <div className="announce-stat-card">
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Target Cohort</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>Class of 2026</div>
          <div style={{ fontSize: 11.5, color: '#2563EB', fontWeight: 700 }}>CSE, IT, ECE & AI Depts</div>
        </div>
      </div>

      {/* ---------------- Filter & Search Bar ---------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div className="announce-filter-tabs" style={{ border: 'none', padding: 0 }}>
          {[
            { id: 'all', label: 'All Announcements' },
            { id: 'urgent', label: '🚨 Urgent Drive Updates' },
            { id: 'shortlist', label: '📝 Shortlist Releases' },
            { id: 'ppt', label: '🏛️ PPT Schedules' },
            { id: 'drive', label: '💼 Recruitment Drives' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`announce-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search circulars, companies..."
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

      {/* ---------------- Announcements Feed ---------------- */}
      <div className="announce-feed-list">
        {filteredAnnouncements.map((item) => (
          <article key={item.id} className="announce-card">
            {/* Card Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  className={`announce-badge ${
                    item.category === 'urgent'
                      ? 'urgent'
                      : item.category === 'shortlist'
                      ? 'shortlist'
                      : item.category === 'ppt'
                      ? 'ppt'
                      : 'drive'
                  }`}
                >
                  {item.categoryLabel}
                </span>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>• {item.timestamp}</span>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {item.deliveryChannels.map((channel, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    ✓ {channel}
                  </span>
                ))}
              </div>
            </div>

            {/* Title & Target */}
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', lineHeight: 1.3, marginBottom: 4 }}>
                {item.title}
              </h2>
              <div style={{ fontSize: 12.5, color: '#4F46E5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={14} />
                <span>Target: {item.targetAudience}</span>
              </div>
            </div>

            {/* Content Text */}
            <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, margin: 0 }}>
              {item.content}
            </p>

            {/* Attachment If Present */}
            {item.attachmentName && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '8px 14px',
                  borderRadius: 8,
                  width: 'fit-content',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#1E293B',
                }}
              >
                <Paperclip size={14} color="#64748B" />
                <span>{item.attachmentName}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>({item.attachmentSize})</span>
                <button
                  onClick={() => alert(`Downloading circular ${item.attachmentName}...`)}
                  style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 800, cursor: 'pointer', marginLeft: 8 }}
                >
                  Download ↓
                </button>
              </div>
            )}

            {/* Footer Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 12, marginTop: 4, fontSize: 12, color: '#64748B' }}>
              <span>Published by <strong>{item.author}</strong></span>
              <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={13} /> {item.readRate}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* ---------------- Create Announcement Modal ---------------- */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 620 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Megaphone size={22} color="#4F46E5" />
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Publish Campus Placement Broadcast
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Announcement Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Goldman Sachs OA Shortlist Released..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 600 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Category Tag
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, fontWeight: 600 }}
                  >
                    <option value="urgent">🚨 High Priority / Urgent Drive</option>
                    <option value="shortlist">📝 Shortlist Release</option>
                    <option value="ppt">🏛️ Pre-Placement Talk (PPT)</option>
                    <option value="drive">💼 Recruitment Drive Circular</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Target Audience
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, fontWeight: 600 }}
                  >
                    <option>All Batch 2026 Engineering Students (1,600)</option>
                    <option>Tier-1 Eligible Candidates (1,420)</option>
                    <option>CSE & IT Department (620)</option>
                    <option>Goldman Sachs Shortlisted Candidates (280)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Broadcast Content & Circular Text
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed circular details, venue, time, eligibility criteria..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, resize: 'vertical' }}
                  required
                />
              </div>

              {/* Delivery Channels */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 6 }}>
                  MULTI-CHANNEL DELIVERY CHANNELS:
                </label>
                <div style={{ display: 'flex', gap: 14, fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={sendPush} onChange={(e) => setSendPush(e.target.checked)} />
                    <span>📲 Mobile App Push</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                    <span>✉️ Institutional Email</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                    <span>💬 SMS / WhatsApp</span>
                  </label>
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
                  <Send size={14} />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementsPage;
