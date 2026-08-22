import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Filter,
  DollarSign,
} from 'lucide-react';

interface JobOpportunity {
  id: string;
  role: string;
  company: string;
  logoColor: string;
  location: string;
  type: 'Internship' | 'Full-Time' | 'Drive';
  stipend: string;
  matchScore: number;
  deadlineDays: number;
  skills: string[];
  description: string;
}

export const OpportunitiesView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'Internship' | 'Full-Time'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const opportunities: JobOpportunity[] = [
    {
      id: 'opp-1',
      role: 'Software Development Engineer Intern (Summer 2026)',
      company: 'Goldman Sachs',
      logoColor: '#1E3A8A',
      location: 'Bangalore / Hybrid',
      type: 'Internship',
      stipend: '₹1,20,000 / month',
      matchScore: 94,
      deadlineDays: 5,
      skills: ['C++', 'Data Structures', 'Algorithms', 'SQL', 'Distributed Systems'],
      description: 'Join the Core Engineering team building ultra-low-latency financial trading infrastructure and scalable event processing pipelines.',
    },
    {
      id: 'opp-2',
      role: 'Software Engineer - University Graduate 2026',
      company: 'Google Campus Drive',
      logoColor: '#EA4335',
      location: 'Bangalore / Hyderabad',
      type: 'Full-Time',
      stipend: '₹32 - 38 LPA CTC',
      matchScore: 91,
      deadlineDays: 3,
      skills: ['Trees & Graphs', 'Dynamic Programming', 'System Design', 'Python/Java'],
      description: 'Work on billion-user scale products across Search, Cloud, Android, and YouTube. Assessment includes 2 coding rounds + 1 behavioral.',
    },
    {
      id: 'opp-3',
      role: 'Full Stack Engineering Intern',
      company: 'Razorpay',
      logoColor: '#2563EB',
      location: 'Bangalore (Onsite)',
      type: 'Internship',
      stipend: '₹80,000 / month',
      matchScore: 88,
      deadlineDays: 8,
      skills: ['React', 'TypeScript', 'Node.js', 'Redis', 'PostgreSQL'],
      description: 'Develop developer-first payment checkout experiences, recurring billing microservices, and merchant dashboard analytics.',
    },
    {
      id: 'opp-4',
      role: 'Backend Engineering Intern',
      company: 'Zepto',
      logoColor: '#7C3AED',
      location: 'Mumbai / Bangalore',
      type: 'Internship',
      stipend: '₹1,00,000 / month',
      matchScore: 86,
      deadlineDays: 12,
      skills: ['Go', 'Microservices', 'Kafka', 'Docker', 'PostgreSQL'],
      description: 'Architect supply-chain optimization algorithms and real-time inventory dispatch routing engines under 10-minute SLAs.',
    },
    {
      id: 'opp-5',
      role: 'Member of Technical Staff 1',
      company: 'D.E. Shaw & Co.',
      logoColor: '#0F172A',
      location: 'Hyderabad',
      type: 'Full-Time',
      stipend: '₹45 - 52 LPA CTC',
      matchScore: 85,
      deadlineDays: 14,
      skills: ['Advanced Algorithms', 'C++', 'Concurrency', 'Operating Systems'],
      description: 'Solve complex quantitative problems and engineer high-performance analytical compute grids.',
    },
  ];

  const filtered = opportunities.filter((op) => {
    const matchesType = filterType === 'all' || op.type === filterType;
    const matchesSearch =
      op.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleApply = (id: string) => {
    setAppliedJobs([...appliedJobs, id]);
    alert('🎉 Application submitted through CAREEROS! Your verified skill profile and ATS resume have been forwarded directly to the campus placement team.');
  };

  return (
    <div style={{ padding: '24px 36px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          borderRadius: 20,
          padding: '28px 32px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 12px 32px rgba(79, 70, 229, 0.25)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Briefcase size={24} color="#C7D2FE" />
            <span>Opportunities & Placement Radar</span>
          </h1>
          <p style={{ fontSize: 13.5, color: '#C7D2FE' }}>
            Verified campus drives and internships filtered by algorithmic skill match with your student profile.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 16px', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>5</div>
            <div style={{ fontSize: 11, color: '#CBD5E1' }}>Active Matches</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 16px', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#34D399' }}>94%</div>
            <div style={{ fontSize: 11, color: '#CBD5E1' }}>Top Match Rate</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search roles, companies (e.g. Goldman Sachs, C++)..."
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
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'all', label: 'All Openings' },
            { id: 'Internship', label: 'Internships' },
            { id: 'Full-Time', label: 'Full-Time Offers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                border: '1px solid #CBD5E1',
                background: filterType === tab.id ? '#4F46E5' : '#FFFFFF',
                color: filterType === tab.id ? '#FFFFFF' : '#334155',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((op) => {
          const isApplied = appliedJobs.includes(op.id);
          return (
            <div
              key={op.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 18,
                padding: 24,
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 20,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 280 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: op.logoColor,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {op.company.charAt(0)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{op.role}</h2>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      {op.matchScore}% MATCH
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: '#64748B' }}>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{op.company}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {op.location}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{op.stipend}</span>
                  </div>

                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.45, marginTop: 4 }}>
                    {op.description}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {op.skills.map((s, idx) => (
                      <span key={idx} style={{ fontSize: 11.5, background: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 160 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: '#EA580C', fontWeight: 700 }}>
                  <Clock size={14} />
                  <span>{op.deadlineDays} Days Left</span>
                </div>

                <button
                  onClick={() => handleApply(op.id)}
                  disabled={isApplied}
                  style={{
                    background: isApplied ? '#ECFDF5' : 'linear-gradient(135deg, #4F46E5, #4338CA)',
                    color: isApplied ? '#059669' : '#FFFFFF',
                    border: isApplied ? '1px solid #A7F3D0' : 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '9px 18px',
                    borderRadius: 10,
                    cursor: isApplied ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Applied ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Apply with CareerOS</span>
                      <ExternalLink size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunitiesView;
