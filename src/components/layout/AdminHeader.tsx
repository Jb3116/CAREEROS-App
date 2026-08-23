import React from 'react';
import { Building2, Bell, Search, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  return (
    <header className="admin-header" role="banner">
      {/* College Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4F46E5',
          }}
        >
          <Building2 size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em', margin: 0 }}>
            Vellore Institute of Technology, Vellore
          </h1>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Office of Training & Placement (Class of 2026 / 2027)
          </span>
        </div>
      </div>

      {/* Header Badges & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#ECFDF5',
            color: '#059669',
            border: '1px solid #A7F3D0',
            fontSize: 12,
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: 999,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <span>Active Campus Hiring Season 2026</span>
        </div>

        <button
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
          }}
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
